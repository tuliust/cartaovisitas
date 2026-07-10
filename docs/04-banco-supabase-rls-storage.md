# 04 — Banco, RLS e Storage

## Tabelas principais

### `business_cards`

Armazena cartões.

Campos relevantes:

- `id`
- `slug`
- `full_name`
- `display_name`
- `job_title`, `job_title_pt`, `job_title_es`, `job_title_en`
- `department`, `department_pt`, `department_es`, `department_en`
- `company`
- `mobile_phone`
- `work_phone`
- `email`
- `website`
- `address_line`, `city`, `state`, `country`
- `linkedin_url`, `instagram_url`
- `avatar_url`
- `show_avatar_public`
- `logo_url`
- `public_visual_variant`
- `is_active`
- `expires_at`
- `created_by`
- `created_at`
- `updated_at`

### `card_scan_events`

Registra eventos:

- `view`
- `vcard`
- `share`
- `qr`
- `wallet_apple` quando Wallet for ativada

Campos:

- `id`
- `card_id`
- `event_type`
- `user_agent`
- `referrer`
- `created_at`

### `user_profiles`

Controla perfis e status.

Campos:

- `id`
- `email`
- `role`: `admin` ou `user`
- `full_name`
- `status`: `active`, `blocked`, `pending`
- `blocked_at`
- `invited_at`
- `last_seen_at`
- `created_at`
- `updated_at`

### `brand_settings`

Configura branding.

Campos:

- `logo_url`
- `favicon_url`
- `og_image_url`
- `background_image_url`
- `logo_on_dark_url`
- `logo_on_light_url`
- `card_bg_dark_image_1_url`
- `card_bg_dark_image_2_url`
- `card_bg_light_image_3_url`
- `card_bg_light_image_4_url`
- `apple_touch_icon_url`
- `primary_color`
- `secondary_color`
- `background_color`
- `surface_color`
- `text_color`

### `audit_logs`

Registra governança.

Campos:

- `actor_id`
- `actor_email`
- `action`
- `target_type`
- `target_id`
- `target_label`
- `before_data`
- `after_data`
- `metadata`
- `created_at`

## Função `public.is_admin()`

Retorna verdadeiro quando o usuário autenticado possui `user_profiles.role = 'admin'` e `status <> 'blocked'`.

## RLS

Regras esperadas:

- Público lê apenas cartões ativos e não expirados.
- Admin lê, cria, edita e apaga todos os cartões.
- Colaborador lê/edita apenas o próprio cartão.
- Usuário bloqueado não acessa áreas restritas.
- Eventos podem ser inseridos publicamente apenas para cartões ativos.
- Admin lê eventos e auditoria.
- Branding é lido publicamente, mas escrito apenas por admin.

## Storage

Bucket:

```text
business-card-assets
```

Uso:

- avatars;
- logo;
- favicon;
- Apple Touch;
- OG image;
- background global;
- fundos institucionais;
- logos por contraste.

Paths sugeridos:

```text
brand/favicon-{timestamp}.{ext}
brand/apple-touch-icon-{timestamp}.png
brand/logo-on-dark-{timestamp}.{ext}
brand/logo-on-light-{timestamp}.{ext}
brand/card-bg-dark-1-{timestamp}.{ext}
brand/card-bg-dark-2-{timestamp}.{ext}
brand/card-bg-light-3-{timestamp}.{ext}
brand/card-bg-light-4-{timestamp}.{ext}
```

## Scripts SQL

Consultar `appendix-sql-scripts.md`.
