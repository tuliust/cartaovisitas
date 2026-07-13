alter table public.brand_settings
  add column if not exists visual_variant_settings jsonb,
  add column if not exists browser_title text,
  add column if not exists apple_touch_title text;

update public.brand_settings
set browser_title = 'Cartões Digitais | Invest RS'
where browser_title is null;

update public.brand_settings
set apple_touch_title = 'Cartões Digitais'
where apple_touch_title is null;

update public.brand_settings
set visual_variant_settings = jsonb_build_object(
  'dark_black', jsonb_build_object('primary_color', primary_color, 'secondary_color', secondary_color, 'background_color', background_color, 'surface_color', surface_color, 'text_color', text_color, 'background_overlay_opacity', 0, 'card_surface_opacity', 0.78),
  'dark_image_1', jsonb_build_object('primary_color', primary_color, 'secondary_color', secondary_color, 'background_color', background_color, 'surface_color', surface_color, 'text_color', text_color, 'background_overlay_opacity', 0.72, 'card_surface_opacity', 0.78),
  'dark_image_2', jsonb_build_object('primary_color', primary_color, 'secondary_color', secondary_color, 'background_color', background_color, 'surface_color', surface_color, 'text_color', text_color, 'background_overlay_opacity', 0.72, 'card_surface_opacity', 0.78),
  'light_white', jsonb_build_object('primary_color', '#111111', 'secondary_color', '#555555', 'background_color', '#f4f1eb', 'surface_color', '#ffffff', 'text_color', '#111111', 'background_overlay_opacity', 0, 'card_surface_opacity', 0.82),
  'light_image_3', jsonb_build_object('primary_color', '#111111', 'secondary_color', '#555555', 'background_color', '#f4f1eb', 'surface_color', '#ffffff', 'text_color', '#111111', 'background_overlay_opacity', 0.75, 'card_surface_opacity', 0.82),
  'light_image_4', jsonb_build_object('primary_color', '#111111', 'secondary_color', '#555555', 'background_color', '#f4f1eb', 'surface_color', '#ffffff', 'text_color', '#111111', 'background_overlay_opacity', 0.75, 'card_surface_opacity', 0.82)
)
where visual_variant_settings is null;

alter table public.brand_settings drop constraint if exists brand_settings_visual_variant_settings_object;
alter table public.brand_settings add constraint brand_settings_visual_variant_settings_object
  check (visual_variant_settings is null or jsonb_typeof(visual_variant_settings) = 'object');
