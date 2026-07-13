-- Execute no SQL Editor do Supabase depois de criar a função public.is_admin().
create table if not exists public.brand_settings (
  id uuid primary key default gen_random_uuid(),
  singleton boolean not null default true unique check (singleton),
  logo_url text,
  favicon_url text,
  og_image_url text,
  background_image_url text,
  browser_title text,
  apple_touch_title text,
  primary_color text not null default '#050505',
  secondary_color text not null default '#f7f3eb',
  background_color text not null default '#050505',
  surface_color text not null default '#111111',
  text_color text not null default '#ffffff',
  visual_variant_settings jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.brand_settings
  add column if not exists background_image_url text,
  add column if not exists browser_title text,
  add column if not exists apple_touch_title text,
  add column if not exists visual_variant_settings jsonb;

insert into public.brand_settings (singleton)
values (true)
on conflict (singleton) do nothing;

alter table public.brand_settings enable row level security;
drop policy if exists "brand settings public read" on public.brand_settings;
create policy "brand settings public read" on public.brand_settings for select using (true);
drop policy if exists "brand settings admin insert" on public.brand_settings;
create policy "brand settings admin insert" on public.brand_settings for insert to authenticated with check (public.is_admin());
drop policy if exists "brand settings admin update" on public.brand_settings;
create policy "brand settings admin update" on public.brand_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "brand settings admin delete" on public.brand_settings;
create policy "brand settings admin delete" on public.brand_settings for delete to authenticated using (public.is_admin());

-- O bucket business-card-assets deve ser público. Estas policies limitam a escrita da pasta brand/ a admins.
drop policy if exists "brand assets admin insert" on storage.objects;
create policy "brand assets admin insert" on storage.objects for insert to authenticated
with check (bucket_id = 'business-card-assets' and (storage.foldername(name))[1] = 'brand' and public.is_admin());
drop policy if exists "brand assets admin update" on storage.objects;
create policy "brand assets admin update" on storage.objects for update to authenticated
using (bucket_id = 'business-card-assets' and (storage.foldername(name))[1] = 'brand' and public.is_admin());
drop policy if exists "brand assets admin delete" on storage.objects;
create policy "brand assets admin delete" on storage.objects for delete to authenticated
using (bucket_id = 'business-card-assets' and (storage.foldername(name))[1] = 'brand' and public.is_admin());
