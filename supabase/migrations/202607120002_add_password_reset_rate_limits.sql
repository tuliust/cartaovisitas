create table if not exists public.password_reset_rate_limits (
  key_hash text primary key,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  window_started_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.password_reset_rate_limits enable row level security;
revoke all on table public.password_reset_rate_limits from anon, authenticated;

create or replace function public.consume_password_reset_rate_limit(
  p_key_hash text,
  p_limit integer default 5,
  p_window_seconds integer default 900
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_attempts integer;
begin
  if p_key_hash is null or length(p_key_hash) <> 64 or p_limit < 1 or p_window_seconds < 60 then
    return false;
  end if;

  insert into public.password_reset_rate_limits (key_hash, attempt_count, window_started_at, updated_at)
  values (p_key_hash, 1, now(), now())
  on conflict (key_hash) do update
  set attempt_count = case
        when password_reset_rate_limits.window_started_at < now() - make_interval(secs => p_window_seconds) then 1
        else password_reset_rate_limits.attempt_count + 1
      end,
      window_started_at = case
        when password_reset_rate_limits.window_started_at < now() - make_interval(secs => p_window_seconds) then now()
        else password_reset_rate_limits.window_started_at
      end,
      updated_at = now()
  returning attempt_count into current_attempts;

  return current_attempts <= p_limit;
end;
$$;

revoke all on function public.consume_password_reset_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_password_reset_rate_limit(text, integer, integer) to service_role;
