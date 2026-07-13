# 04 — Banco, RLS e Storage

## Tabelas principais

### `business_cards`

Armazena os cartões.

Campos relevantes:

- identidade: `id`, `slug`, `full_name`, `display_name`;
- conteúdo profissional: `job_title*`, `department*`, `company`;
- contato: telefones, e-mail, website, endereço e redes;
- imagem: `avatar_url`, `show_avatar_public`;
- fallback: `logo_url`;
- visual: `public_visual_variant`;
- governança: `is_active`, `expires_at`, `created_by`;
- timestamps.

Campos localizados:

```text
job_title_pt
job_title_es
job_title_en
department_pt
department_es
department_en
```

### `card_scan_events`

Eventos conhecidos:

```text
view
vcard
share
qr
wallet_apple
```

`wallet_apple` depende da ativação real da Wallet e da constraint do ambiente.

### `user_profiles`

Campos principais:

- `id`;
- `email`;
- `role`: `admin` ou `user`;
- `status`: `active`, `pending` ou `blocked`;
- nome;
- datas de convite, bloqueio e último acesso;
- timestamps.

### `brand_settings`

Armazena:

- logos por contraste;
- favicon;
- Apple Touch Icon;
- imagem Open Graph;
- background;
- quatro fundos institucionais;
- títulos do navegador e Apple Touch;
- tokens globais legados;
- `visual_variant_settings` em JSONB.

Chaves das variantes:

```text
dark_black
dark_image_1
dark_image_2
light_white
light_image_3
light_image_4
```

`logo_url` permanece como fallback técnico/legado.

### `audit_logs`

Armazena ator, ação, alvo, dados anteriores, dados posteriores, metadados e data.

### `managed_pages`

Conteúdo editorial estruturado.

Campos:

- `id`;
- `page_key`;
- `route_path`;
- `title`;
- `subtitle`;
- `content`;
- `visibility`;
- `is_published`;
- `version_label`;
- `updated_by`;
- timestamps.

Registros atuais:

```text
terms_and_privacy
usage_guide
```

### `password_reset_rate_limits`

Tabela privada utilizada pela Edge Function de recuperação de senha.

- sem leitura pública;
- sem policies para clientes;
- identificadores armazenados como hash;
- consumo por função atômica.

## Função `public.is_admin()`

Retorna verdadeiro para usuário autenticado com:

```text
role = admin
status diferente de blocked
```

## RLS esperada

- visitante lê apenas recursos explicitamente públicos;
- colaborador lê e edita somente o próprio cartão;
- admin administra cartões, usuários, auditoria, branding e conteúdo;
- usuário bloqueado não passa nas verificações;
- eventos públicos só podem ser inseridos para cartões válidos;
- páginas públicas publicadas são legíveis por `anon`;
- páginas autenticadas publicadas exigem sessão;
- escrita em `managed_pages` exige admin.

## Storage

Bucket:

```text
business-card-assets
```

Usos:

- avatars;
- logos claro/escuro;
- favicon;
- Apple Touch Icon;
- Open Graph;
- backgrounds;
- fundos das variantes.

Não armazenar certificados Wallet ou secrets no Storage público.

## Bootstrap

A ordem operacional e os scripts históricos estão em `appendix-sql-scripts.md`.

O primeiro admin deve ser promovido manualmente após criar o usuário no Auth.

## Tipos

`src/lib/database.types.ts` deve acompanhar o schema efetivamente aplicado.
