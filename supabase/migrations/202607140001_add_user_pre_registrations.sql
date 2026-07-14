create table if not exists public.user_pre_registrations (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  job_title text,
  department text,
  status text not null default 'inactive' check (status in ('inactive', 'pending')),
  auth_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_pre_registrations enable row level security;

create policy "Admins can view user pre registrations"
on public.user_pre_registrations for select
to authenticated
using (exists (
  select 1 from public.user_profiles
  where user_profiles.id = auth.uid()
    and user_profiles.role = 'admin'
    and user_profiles.status <> 'blocked'
));

create index if not exists user_pre_registrations_status_idx
on public.user_pre_registrations(status);
