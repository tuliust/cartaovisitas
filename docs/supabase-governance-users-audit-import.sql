-- Governança operacional. Idempotente; execute no SQL Editor do Supabase.

alter table public.user_profiles
  add column if not exists full_name text,
  add column if not exists status text not null default 'active',
  add column if not exists blocked_at timestamptz,
  add column if not exists invited_at timestamptz,
  add column if not exists last_seen_at timestamptz;

alter table public.user_profiles drop constraint if exists user_profiles_status_check;
alter table public.user_profiles add constraint user_profiles_status_check
  check (status in ('active', 'blocked', 'pending'));

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  actor_email text,
  action text not null,
  target_type text not null,
  target_id text,
  target_label text,
  before_data jsonb,
  after_data jsonb,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_profiles
    where id = auth.uid() and role = 'admin' and status <> 'blocked'
  )
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.business_cards enable row level security;
drop policy if exists "Authenticated users can manage cards" on public.business_cards;
drop policy if exists "Public can read active cards" on public.business_cards;
drop policy if exists "cards public active read" on public.business_cards;
create policy "cards public active read" on public.business_cards for select to anon, authenticated
  using (is_active = true and (expires_at is null or expires_at > now()));
drop policy if exists "cards admin all read" on public.business_cards;
create policy "cards admin all read" on public.business_cards for select to authenticated using (public.is_admin());
drop policy if exists "cards owner read" on public.business_cards;
create policy "cards owner read" on public.business_cards for select to authenticated
  using ((created_by = auth.uid() or lower(email) = lower(auth.email())) and exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.status <> 'blocked'));
drop policy if exists "cards admin insert" on public.business_cards;
create policy "cards admin insert" on public.business_cards for insert to authenticated with check (public.is_admin());
drop policy if exists "cards owner insert" on public.business_cards;
create policy "cards owner insert" on public.business_cards for insert to authenticated
  with check (created_by = auth.uid() and lower(email) = lower(auth.email()) and exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.role = 'user' and p.status <> 'blocked'));
drop policy if exists "cards admin update" on public.business_cards;
create policy "cards admin update" on public.business_cards for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "cards owner update" on public.business_cards;
create policy "cards owner update" on public.business_cards for update to authenticated
  using ((created_by = auth.uid() or lower(email) = lower(auth.email())) and exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.status <> 'blocked'))
  with check ((created_by = auth.uid() or lower(email) = lower(auth.email())) and exists (select 1 from public.user_profiles p where p.id = auth.uid() and p.status <> 'blocked'));

create or replace function public.protect_business_card_owner()
returns trigger language plpgsql security definer set search_path = public
as $$ begin
  if new.created_by is distinct from old.created_by and not public.is_admin() then
    raise exception 'created_by cannot be changed';
  end if;
  return new;
end $$;
drop trigger if exists protect_business_card_owner on public.business_cards;
create trigger protect_business_card_owner before update on public.business_cards
for each row execute function public.protect_business_card_owner();
drop policy if exists "cards admin delete" on public.business_cards;
create policy "cards admin delete" on public.business_cards for delete to authenticated using (public.is_admin());

alter table public.card_scan_events enable row level security;
drop policy if exists "Authenticated users can read scan events" on public.card_scan_events;
drop policy if exists "events public insert" on public.card_scan_events;
create policy "events public insert" on public.card_scan_events for insert to anon, authenticated
  with check (exists (select 1 from public.business_cards c where c.id = card_id and c.is_active = true and (c.expires_at is null or c.expires_at > now())));
drop policy if exists "events admin read" on public.card_scan_events;
create policy "events admin read" on public.card_scan_events for select to authenticated using (public.is_admin());
drop policy if exists "events owner read" on public.card_scan_events;
create policy "events owner read" on public.card_scan_events for select to authenticated
  using (exists (select 1 from public.business_cards c where c.id = card_id and (c.created_by = auth.uid() or lower(c.email) = lower(auth.email()))));
drop policy if exists "events admin delete" on public.card_scan_events;
create policy "events admin delete" on public.card_scan_events for delete to authenticated using (public.is_admin());

alter table public.brand_settings enable row level security;
drop policy if exists "brand settings public read" on public.brand_settings;
create policy "brand settings public read" on public.brand_settings for select to anon, authenticated using (true);
drop policy if exists "brand settings admin insert" on public.brand_settings;
create policy "brand settings admin insert" on public.brand_settings for insert to authenticated with check (public.is_admin());
drop policy if exists "brand settings admin update" on public.brand_settings;
create policy "brand settings admin update" on public.brand_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "brand settings admin delete" on public.brand_settings;
create policy "brand settings admin delete" on public.brand_settings for delete to authenticated using (public.is_admin());

alter table public.user_profiles enable row level security;
drop policy if exists "profiles select own or admin" on public.user_profiles;
create policy "profiles select own or admin" on public.user_profiles for select to authenticated using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles insert own user" on public.user_profiles;
create policy "profiles insert own user" on public.user_profiles for insert to authenticated with check (id = auth.uid() and lower(email) = lower(auth.email()) and role = 'user');
drop policy if exists "profiles admin update" on public.user_profiles;
create policy "profiles admin update" on public.user_profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

alter table public.audit_logs enable row level security;
drop policy if exists "audit admin read" on public.audit_logs;
create policy "audit admin read" on public.audit_logs for select to authenticated using (public.is_admin());
drop policy if exists "audit admin insert" on public.audit_logs;
create policy "audit admin insert" on public.audit_logs for insert to authenticated
  with check (public.is_admin() and actor_id = auth.uid() and lower(actor_email) = lower(auth.email()));

create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index if not exists audit_logs_action_idx on public.audit_logs (action);
create index if not exists user_profiles_status_idx on public.user_profiles (status);
