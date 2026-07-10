-- Execute no SQL Editor do Supabase depois de revisar os nomes das policies existentes.
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer
set search_path = public
as $$ select exists (select 1 from public.user_profiles where id = auth.uid() and role = 'admin') $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "profiles select own or admin" on public.user_profiles;
create policy "profiles select own or admin" on public.user_profiles for select to authenticated
using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles insert own user" on public.user_profiles;
create policy "profiles insert own user" on public.user_profiles for insert to authenticated
with check (id = auth.uid() and email = auth.email() and role = 'user');
drop policy if exists "profiles admin update" on public.user_profiles;
create policy "profiles admin update" on public.user_profiles for update to authenticated
using (public.is_admin()) with check (public.is_admin());

alter table public.business_cards enable row level security;
-- Remova policies antigas equivalentes antes de aplicar, para evitar permissões cumulativas.
drop policy if exists "cards public active read" on public.business_cards;
create policy "cards public active read" on public.business_cards for select to anon, authenticated
using (is_active = true and (expires_at is null or expires_at > now()));
drop policy if exists "cards admin all read" on public.business_cards;
create policy "cards admin all read" on public.business_cards for select to authenticated using (public.is_admin());
drop policy if exists "cards owner read" on public.business_cards;
create policy "cards owner read" on public.business_cards for select to authenticated
using (created_by = auth.uid() or lower(email) = lower(auth.email()));
drop policy if exists "cards admin insert" on public.business_cards;
create policy "cards admin insert" on public.business_cards for insert to authenticated with check (public.is_admin());
drop policy if exists "cards owner insert" on public.business_cards;
create policy "cards owner insert" on public.business_cards for insert to authenticated
with check (created_by = auth.uid() and lower(email) = lower(auth.email()));
drop policy if exists "cards admin update" on public.business_cards;
create policy "cards admin update" on public.business_cards for update to authenticated
using (public.is_admin()) with check (public.is_admin());
drop policy if exists "cards owner update" on public.business_cards;
create policy "cards owner update" on public.business_cards for update to authenticated
using (created_by = auth.uid() or lower(email) = lower(auth.email()))
with check (lower(email) = lower(auth.email()));

-- A policy identifica a linha antiga no USING, mas não consegue comparar OLD/NEW. Este
-- trigger impede que um colaborador troque created_by, inclusive em cartões legados
-- associados por e-mail. Admins continuam podendo fazer a manutenção necessária.
create or replace function public.protect_business_card_owner()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if new.created_by is distinct from old.created_by and not public.is_admin() then
    raise exception 'created_by cannot be changed';
  end if;
  return new;
end;
$$;
drop trigger if exists protect_business_card_owner on public.business_cards;
create trigger protect_business_card_owner before update on public.business_cards
for each row execute function public.protect_business_card_owner();
drop policy if exists "cards admin delete" on public.business_cards;
create policy "cards admin delete" on public.business_cards for delete to authenticated using (public.is_admin());

alter table public.card_scan_events enable row level security;
drop policy if exists "events admin read" on public.card_scan_events;
create policy "events admin read" on public.card_scan_events for select to authenticated using (public.is_admin());
drop policy if exists "events admin delete" on public.card_scan_events;
create policy "events admin delete" on public.card_scan_events for delete to authenticated using (public.is_admin());
-- Preserve a policy pública de INSERT já existente. Ela deve validar que card_id aponta
-- para um business_cards ativo e não expirado.

-- Promova o primeiro admin somente pelo SQL Editor (service role), após criar o usuário:
-- insert into public.user_profiles (id, email, role)
-- select id, email, 'admin' from auth.users
-- where email = 'tulius.souza@investrs.org.br'
-- on conflict (id) do update set role = 'admin', updated_at = now();
-- Alternativa: localize o UUID em Authentication > Users e insira/atualize manualmente
-- public.user_profiles pelo Table Editor usando esse UUID. Nunca exponha a service role no front.
