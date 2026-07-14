-- Expand the existing JSON contract without removing legacy keys. This keeps
-- already deployed clients and saved cards compatible during rollout.
update public.brand_settings settings
set visual_variant_settings = migrated.value
from (
  select id, jsonb_object_agg(variant_key, variant_value || jsonb_build_object(
    'background_color', case
      when lower(coalesce(variant_value->>'background_color', '')) in ('#ffffff', '#808080', '#000000', '#00ac7c', '#fdb642', '#ee286e') then lower(variant_value->>'background_color')
      when variant_key like 'dark_%' then '#000000' else '#ffffff' end,
    'surface_color', case
      when lower(coalesce(variant_value->>'surface_color', '')) in ('#ffffff', '#808080', '#000000', '#00ac7c', '#fdb642', '#ee286e') then lower(variant_value->>'surface_color')
      when variant_key like 'dark_%' then '#000000' else '#ffffff' end,
    'text_color', case when variant_key like 'dark_%' then '#ffffff' else '#000000' end,
    'background_opacity', coalesce((variant_value->>'background_opacity')::numeric, (variant_value->>'background_overlay_opacity')::numeric, 0),
    'surface_opacity', coalesce((variant_value->>'surface_opacity')::numeric, (variant_value->>'card_surface_opacity')::numeric, 0.78),
    'border_color', case when variant_key like 'dark_%' then '#ffffff' else '#000000' end,
    'border_opacity', coalesce((variant_value->>'border_opacity')::numeric, 0.14),
    'icon_color', case when variant_key like 'dark_%' then '#ffffff' else '#000000' end,
    'icon_opacity', coalesce((variant_value->>'icon_opacity')::numeric, 1),
    'primary_button_color', case
      when lower(coalesce(variant_value->>'primary_button_color', variant_value->>'secondary_color', '')) in ('#ffffff', '#808080', '#000000', '#00ac7c', '#fdb642', '#ee286e')
        then lower(coalesce(variant_value->>'primary_button_color', variant_value->>'secondary_color'))
      when lower(coalesce(variant_value->>'primary_button_color', variant_value->>'secondary_color', '')) in ('#b5b0b0', '#555555') then '#808080'
      when variant_key like 'dark_%' then '#fdb642' else '#00ac7c' end,
    'primary_button_opacity', coalesce((variant_value->>'primary_button_opacity')::numeric, 1),
    'secondary_button_color', coalesce(variant_value->>'secondary_button_color', '#808080'),
    'secondary_button_opacity', coalesce((variant_value->>'secondary_button_opacity')::numeric, 0.18),
    'auxiliary_button_color', coalesce(variant_value->>'auxiliary_button_color', case when variant_key like 'dark_%' then '#000000' else '#ffffff' end),
    'auxiliary_button_opacity', coalesce((variant_value->>'auxiliary_button_opacity')::numeric, 1)
  )) as value
  from public.brand_settings source,
    lateral jsonb_each(coalesce(source.visual_variant_settings, '{}'::jsonb)) variants(variant_key, variant_value)
  group by source.id
) migrated
where settings.id = migrated.id;
