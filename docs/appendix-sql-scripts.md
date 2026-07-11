# Apêndice — Scripts SQL

Este apêndice lista scripts SQL do projeto e sua finalidade. Não excluir scripts executados; eles servem como rastreabilidade técnica.

## Scripts principais

### `docs/supabase-base-schema.sql`

Cria o schema canônico mínimo para bootstrap de ambientes novos. Deve ser revisado antes da execução e não deve ser aplicado automaticamente em produção.

### `docs/supabase-storage-business-card-assets.sql`

Cria/configura bucket `business-card-assets` e policies de Storage.

### `docs/supabase-auth-roles-and-card-policies.sql`

Script inicial de roles e policies. Pode ter sido substituído parcialmente por scripts posteriores.

### `docs/supabase-card-localized-fields.sql`

Adiciona campos localizados:

- `job_title_pt`
- `job_title_es`
- `job_title_en`
- `department_pt`
- `department_es`
- `department_en`

### `docs/supabase-card-public-photo-flag.sql`

Adiciona:

- `show_avatar_public`

### `docs/supabase-brand-settings.sql`

Cria/configura `brand_settings` e campos iniciais de branding.

O campo `logo_url` desses scripts deve ser preservado por compatibilidade e funciona apenas como fallback técnico/legado. A operação administrativa dos logos usa `logo_on_dark_url` e `logo_on_light_url`.

### `docs/supabase-governance-users-audit-import.sql`

Adiciona governança operacional:

- campos de status em `user_profiles`;
- `audit_logs`;
- `public.is_admin()`;
- RLS revisada;
- policies de cartões, eventos, branding, usuários e auditoria;
- índices.

### `docs/supabase-visual-variants-and-icons.sql`

Adiciona:

- `public_visual_variant`;
- constraint das seis variantes;
- `logo_on_dark_url`;
- `logo_on_light_url`;
- fundos institucionais;
- `apple_touch_icon_url`.

## Ordem recomendada para ambiente novo

1. `supabase-base-schema.sql`
2. `supabase-storage-business-card-assets.sql`
3. `supabase-card-localized-fields.sql`, se ainda necessário em ambiente legado
4. `supabase-card-public-photo-flag.sql`, se ainda necessário em ambiente legado
5. `supabase-brand-settings.sql`, se ainda necessário em ambiente legado
6. `supabase-governance-users-audit-import.sql`
7. `supabase-visual-variants-and-icons.sql`

Em ambientes novos, alguns scripts complementares podem ser redundantes porque o schema base já contém suas colunas. Eles devem permanecer no repositório e na sequência operacional por rastreabilidade histórica e por serem idempotentes.

## Verificação de tabelas

```sql
select
  'business_cards' as item,
  to_regclass('public.business_cards') is not null as ok
union all
select 'card_scan_events', to_regclass('public.card_scan_events') is not null
union all
select 'user_profiles', to_regclass('public.user_profiles') is not null
union all
select 'brand_settings', to_regclass('public.brand_settings') is not null
union all
select 'audit_logs', to_regclass('public.audit_logs') is not null;
```

## Verificação de policies perigosas

```sql
select
  tablename,
  policyname,
  cmd,
  roles,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('business_cards', 'card_scan_events', 'user_profiles', 'brand_settings', 'audit_logs')
order by tablename, policyname;
```

Não deve existir:

```text
Authenticated users can manage cards
```

A policy pública de eventos deve validar cartão ativo e não expirado.

## Verificação de variantes visuais

```sql
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in ('business_cards', 'brand_settings')
  and column_name in (
    'public_visual_variant',
    'logo_on_dark_url',
    'logo_on_light_url',
    'card_bg_dark_image_1_url',
    'card_bg_dark_image_2_url',
    'card_bg_light_image_3_url',
    'card_bg_light_image_4_url',
    'apple_touch_icon_url'
  )
order by table_name, column_name;
```

## Verificação do primeiro admin

```sql
select email, role, status
from public.user_profiles
where lower(email) = 'tulius.souza@investrs.org.br';
```

## Cuidados

- Não executar scripts destrutivos sem backup.
- Manter SQLs idempotentes.
- Registrar mudanças relevantes na documentação.
- Revalidar RLS após mudanças de policy.
