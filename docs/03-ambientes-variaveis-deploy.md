# 03 — Ambientes, variáveis e deploy

## Ambientes

| Ambiente | Uso |
|---|---|
| Local | Desenvolvimento e QA manual. |
| Vercel Preview | Validação por branch ou PR, quando utilizado. |
| Vercel Production | Produção em `https://cartaovisitas.vercel.app`. |
| Supabase | Auth, Database, RLS, Storage e Edge Functions. |

## Variáveis públicas do frontend

Entram no bundle do navegador:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APP_BASE_URL=
VITE_WALLET_PUBLIC_ENABLED=false
```

Regras:

- qualquer variável `VITE_` deve ser tratada como pública;
- nenhum secret pode usar prefixo `VITE_`;
- `VITE_APP_BASE_URL` deve refletir o ambiente.

## Variáveis privadas das Vercel Functions

Usadas por endpoints em `api/`:

```text
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PUBLIC_SITE_URL=https://cartaovisitas.vercel.app

APPLE_WALLET_ENABLED=false
GOOGLE_WALLET_ENABLED=false

APPLE_PASS_TYPE_IDENTIFIER=
APPLE_TEAM_IDENTIFIER=
APPLE_ORGANIZATION_NAME=Invest RS
APPLE_PASS_CERT_BASE64=
APPLE_PASS_CERT_PASSWORD=
APPLE_WWDR_CERT_BASE64=

GOOGLE_WALLET_ISSUER_ID=
GOOGLE_WALLET_CLASS_ID=
GOOGLE_WALLET_SERVICE_ACCOUNT_JSON_BASE64=
```

`SUPABASE_SERVICE_ROLE_KEY` nunca deve ser exposta ao frontend.

## Secrets da Supabase Edge Function

A função:

```text
supabase/functions/request-password-reset
```

utiliza secrets no runtime do Supabase:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY
PUBLIC_SITE_URL
PASSWORD_RESET_RATE_LIMIT_SALT
```

Observações:

- esses valores não precisam estar no `.env.example` do frontend;
- `PASSWORD_RESET_RATE_LIMIT_SALT` deve ser aleatório e privado;
- secrets da Edge Function devem ser configurados no ambiente do Supabase;
- não registrar valores reais em documentação ou logs.

## Variáveis futuras do Resend

A integração ainda não foi implementada.

Nomes conceituais:

```text
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_REPLY_TO=
```

Os nomes finais devem seguir o código implementado.

Regras:

- somente server-side;
- nunca usar prefixo `VITE_`;
- não commitar valores reais;
- separar Production e Preview quando necessário.

## Regras gerais

- Não commitar `.env`, `.env.local`, `.vercel`, certificados ou chaves.
- Segredos do Supabase, Wallet e Resend ficam em runtimes server-side.
- `PUBLIC_SITE_URL` deve usar HTTPS em produção.
- Alterações de variáveis devem ser seguidas por redeploy ou redeploy da função afetada.

## Redirect URLs do Supabase Auth

Cadastrar em **Authentication → URL Configuration → Redirect URLs**.

### Produção

```text
https://cartaovisitas.vercel.app/entrar
https://cartaovisitas.vercel.app/cadastro
https://cartaovisitas.vercel.app/meu-cartao
https://cartaovisitas.vercel.app/meu-cartao/editar
https://cartaovisitas.vercel.app/admin/login
https://cartaovisitas.vercel.app/admin/cartoes
https://cartaovisitas.vercel.app/recuperar-senha
https://cartaovisitas.vercel.app/definir-senha
```

### Local — porta 5173

```text
http://localhost:5173/entrar
http://localhost:5173/cadastro
http://localhost:5173/meu-cartao
http://localhost:5173/meu-cartao/editar
http://localhost:5173/admin/login
http://localhost:5173/admin/cartoes
http://localhost:5173/recuperar-senha
http://localhost:5173/definir-senha
```

Adicionar a porta alternativa usada pelo Vite quando necessário.

## Rewrites da Vercel

Regras críticas:

- `/qr/:slug` deve chegar à função server-side;
- rotas `/admin/*`, `/meu-cartao/*` e rotas públicas da SPA devem cair em `index.html`;
- `/api/*` não pode ser capturado pelo fallback da SPA.

## Comandos locais

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
git diff --check
```

## Deploy

O push para `main` aciona deploy automático na Vercel.

Depois do deploy, validar:

```text
/
/entrar
/cadastro
/recuperar-senha
/definir-senha
/termos-de-uso-e-privacidade
/meu-cartao/editar
/meu-cartao/guia
/meu-cartao/assinatura-de-email
/meu-cartao/estatisticas
/:slug
/admin/cartoes
/admin/usuarios
/admin/auditoria
/admin/configuracoes
/qr/:slug?lang=pt
/api/vcard/:slug?lang=pt
/api/qr-image/:slug?lang=pt
```

## PWA

O manifest fica em:

```text
public/manifest.webmanifest
```

Ícones:

```text
public/icons/app-192.png
public/icons/app-512.png
public/icons/app-maskable-512.png
```

Não existe service worker nesta fase.
