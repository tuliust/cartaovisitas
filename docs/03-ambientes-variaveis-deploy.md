# 03 — Ambientes, variáveis e deploy

## Ambientes

| Ambiente | Uso |
|---|---|
| Local | Desenvolvimento e testes manuais. |
| Vercel Preview | Validação por branch/PR, quando usado. |
| Vercel Production | Produção em `https://cartaovisitas.vercel.app`. |
| Supabase | Auth, Database, RLS e Storage. |

## Variáveis públicas

Variáveis públicas usam prefixo `VITE_` e entram no bundle do frontend.

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APP_BASE_URL=
VITE_WALLET_PUBLIC_ENABLED=false
```

## Variáveis privadas

Variáveis privadas são usadas somente no backend serverless. Nunca usar prefixo `VITE_`.

```text
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
PUBLIC_SITE_URL=https://cartaovisitas.vercel.app
APPLE_WALLET_ENABLED=false
GOOGLE_WALLET_ENABLED=false
```

## Wallet

Standby:

```text
APPLE_WALLET_ENABLED=false
GOOGLE_WALLET_ENABLED=false
VITE_WALLET_PUBLIC_ENABLED=false
```

Ativação futura exige Apple Developer Program, Pass Type ID, certificado `.p12`, senha, WWDR e redeploy.

## Comandos locais

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
git diff --check
```

## Commit e push

```powershell
git status
git add .
git status
git commit -m "Mensagem objetiva"
git push
```

Antes de commitar, conferir se não há:

```text
.env
.env.local
.env.*.local
.vercel
*.p12
*.cer
*.pem
*.key
```

## Deploy

O push para `main` aciona deploy automático na Vercel. Depois do deploy, validar:

```text
/
 /entrar
 /cadastro
 /meu-cartao/editar
 /admin/cartoes
 /admin/usuarios
 /admin/auditoria
 /admin/configuracoes
 /:slug
 /qr/:slug?lang=pt
 /api/vcard/:slug?lang=pt
```

## Supabase Auth Redirect URLs

Manter URLs de produção e local para:

- `/entrar`
- `/cadastro`
- `/meu-cartao`
- `/meu-cartao/editar`
- `/admin/login`
- `/admin/cartoes`
- `/recuperar-senha`
- `/definir-senha`
