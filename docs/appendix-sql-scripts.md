# Apêndice — Scripts SQL

Este apêndice registra scripts, migrations e reparos. Não excluir arquivos executados: eles compõem a rastreabilidade técnica.

## Migrations recentes

### `202607120001_add_visual_variant_settings_and_titles.sql`

Adiciona configurações por variante e títulos de navegador/Apple Touch.

### `202607120002_add_password_reset_rate_limits.sql`

Adiciona estrutura de rate limit para recuperação de senha.

### `202607130001_add_managed_pages.sql`

Cria:

- `managed_pages`;
- trigger de `updated_at`;
- RLS;
- grants;
- seeds idempotentes para Termos e Guia.

Os seeds não sobrescrevem conteúdo existente.

### `202607130002_make_usage_guide_public.sql`

Atualiza de forma idempotente o registro `usage_guide`:

- rota canônica para `/guia-de-utilizacao`;
- visibilidade para `public`;
- publicação ativa;
- conteúdo ampliado dos 14 tópicos.

A migration preserva o identificador e a data de criação do registro. A policy pública existente passa a autorizar a leitura anônima depois da mudança de visibilidade.

## Repair

### `supabase/repairs/repair_managed_pages_utf8.sql`

- corrige Termos e Guia;
- ASCII-only;
- escapes Unicode;
- sem BOM;
- idempotente;
- preserva IDs, rotas e publicação.

## Scripts canônicos de bootstrap

- `docs/supabase-base-schema.sql`
- `docs/supabase-storage-business-card-assets.sql`
- `docs/supabase-governance-users-audit-import.sql`
- `docs/supabase-visual-variants-and-icons.sql`

Scripts complementares legados devem permanecer por compatibilidade e rastreabilidade.

## Ordem conceitual

1. schema base;
2. Storage;
3. governança, roles e auditoria;
4. variantes e assets;
5. migrations posteriores;
6. primeiro admin;
7. validação de policies.

`managed_pages` depende de `public.is_admin()` para as policies administrativas.

## Histórico da CLI

Quando um SQL é aplicado manualmente, reparar o histórico:

```powershell
npx.cmd supabase migration repair <versao> --status applied
npx.cmd supabase migration list
npx.cmd supabase db push --dry-run
```

Não executar `db push` normal depois de aplicar o mesmo SQL manualmente.

## Verificações

### Tabelas

```sql
select
  to_regclass('public.business_cards') as business_cards,
  to_regclass('public.user_profiles') as user_profiles,
  to_regclass('public.card_scan_events') as card_scan_events,
  to_regclass('public.brand_settings') as brand_settings,
  to_regclass('public.audit_logs') as audit_logs,
  to_regclass('public.managed_pages') as managed_pages;
```

### Policies

```sql
select tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

### Mojibake

```sql
select page_key
from public.managed_pages
where
  strpos(title, U&'\00C3') > 0
  or strpos(coalesce(subtitle, ''), U&'\00C3') > 0
  or strpos(coalesce(version_label, ''), U&'\00C3') > 0
  or strpos(content::text, U&'\00C3') > 0
  or strpos(content::text, U&'\00C2') > 0
  or strpos(content::text, U&'\FFFD') > 0;
```

Resultado esperado: zero linhas.

## Cuidados

- revisar SQL antes de executar;
- não usar scripts destrutivos sem backup;
- manter idempotência;
- revalidar RLS;
- sincronizar `database.types.ts`;
- não alterar production automaticamente.
