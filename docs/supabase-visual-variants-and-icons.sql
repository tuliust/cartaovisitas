-- Identidade visual institucional controlada. Execute no SQL Editor do Supabase.
alter table public.business_cards
  add column if not exists public_visual_variant text not null default 'dark_black';

alter table public.business_cards drop constraint if exists business_cards_public_visual_variant_check;
alter table public.business_cards add constraint business_cards_public_visual_variant_check
  check (public_visual_variant in ('dark_black','dark_image_1','dark_image_2','light_white','light_image_3','light_image_4'));

alter table public.brand_settings
  add column if not exists logo_on_dark_url text,
  add column if not exists logo_on_light_url text,
  add column if not exists card_bg_dark_image_1_url text,
  add column if not exists card_bg_dark_image_2_url text,
  add column if not exists card_bg_light_image_3_url text,
  add column if not exists card_bg_light_image_4_url text,
  add column if not exists apple_touch_icon_url text;
