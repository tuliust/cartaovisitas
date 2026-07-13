-- Schema canônico para bootstrap de um ambiente Supabase novo.
-- Revise este script antes de executá-lo. Não o execute automaticamente em produção.
-- Depois deste bootstrap, execute os scripts complementares na ordem documentada em
-- docs/appendix-sql-scripts.md.

create extension if not exists "pgcrypto";

create table if not exists public.business_cards (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  full_name text not null,
  display_name text,
  job_title text,
  job_title_pt text,
  job_title_es text,
  job_title_en text,
  department text,
  department_pt text,
  department_es text,
  department_en text,
  company text default 'Invest RS',
  mobile_phone text,
  work_phone text,
  email text,
  website text,
  address_line text,
  city text,
  state text,
  country text default 'Brasil',
  linkedin_url text,
  instagram_url text,
  avatar_url text,
  show_avatar_public boolean not null default false,
  logo_url text, -- fallback técnico/legado; a operação usa as variantes por contraste
  theme text default 'invest_black',
  public_visual_variant text not null default 'dark_black'
    check (public_visual_variant in (
      'dark_black',
      'dark_image_1',
      'dark_image_2',
      'light_white',
      'light_image_3',
      'light_image_4'
    )),
  is_active boolean not null default true,
  expires_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.card_scan_events (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.business_cards(id) on delete cascade,
  event_type text not null,
  user_agent text,
  referrer text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'user' check (role in ('admin', 'user')),
  status text not null default 'active' check (status in ('active', 'blocked', 'pending')),
  blocked_at timestamptz,
  invited_at timestamptz,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brand_settings (
  id uuid primary key default gen_random_uuid(),
  singleton boolean not null default true unique check (singleton),
  logo_url text, -- fallback técnico/legado; preservar por compatibilidade
  favicon_url text,
  og_image_url text,
  background_image_url text,
  logo_on_dark_url text,
  logo_on_light_url text,
  card_bg_dark_image_1_url text,
  card_bg_dark_image_2_url text,
  card_bg_light_image_3_url text,
  card_bg_light_image_4_url text,
  apple_touch_icon_url text,
  browser_title text default 'Cartões Digitais | Invest RS',
  apple_touch_title text default 'Cartões Digitais',
  primary_color text not null default '#050505',
  secondary_color text not null default '#f7f3eb',
  background_color text not null default '#050505',
  surface_color text not null default '#111111',
  text_color text not null default '#ffffff',
  visual_variant_settings jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.brand_settings (singleton)
values (true)
on conflict (singleton) do nothing;

create index if not exists business_cards_created_by_idx
  on public.business_cards (created_by);
create index if not exists business_cards_email_idx
  on public.business_cards (lower(email));
create index if not exists business_cards_active_expires_idx
  on public.business_cards (is_active, expires_at);
create index if not exists card_scan_events_card_id_idx
  on public.card_scan_events (card_id);
create index if not exists card_scan_events_created_at_idx
  on public.card_scan_events (created_at desc);
create index if not exists user_profiles_status_idx
  on public.user_profiles (status);

-- Este schema deliberadamente não cria policies avançadas. Após executá-lo, aplique
-- os scripts complementares listados no apêndice para Storage, governança/RLS e
-- variantes visuais, e então valide todas as policies antes de liberar o ambiente.
