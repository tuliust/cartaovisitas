# 02 — Arquitetura técnica

## Visão

O projeto é uma SPA em React/Vite hospedada na Vercel, com Supabase como backend de autenticação, banco, RLS e Storage. Funções serverless em `api/` tratam vCard, QR tracking, convites e Wallet.

## Camadas

| Camada | Responsabilidade |
|---|---|
| Frontend | Rotas, formulários, páginas públicas/admin, toasts e branding. |
| Supabase Auth | Login, cadastro, recuperação de senha e convites. |
| Supabase Database | Cartões, eventos, perfis, branding e auditoria. |
| Supabase RLS | Segurança por usuário, admin e cartão ativo. |
| Supabase Storage | Logos, fundos, favicon, Apple Touch, OG e avatars. |
| Vercel Functions | vCard, QR redirect, convite e Wallet. |
| Vercel Rewrites | Roteamento de SPA e `/qr/:slug`. |

## Estrutura de pastas

```text
api/
  admin/invite-user.ts
  qr/[slug].ts
  vcard/[slug].ts
  wallet/
src/
  components/
  components/admin/
  contexts/
  lib/
  pages/
  pages/admin/
docs/
public/
```

## Rotas React

As rotas SPA ficam em `src/App.tsx`. O app usa `BrandSettingsProvider` e `ToastProvider` envolvendo o `BrowserRouter`.

## Funções serverless

### `/api/vcard/:slug`

Gera vCard 3.0 com UTF-8, campos localizados e headers adequados.

### `/api/qr/:slug`

Registra evento `qr` e redireciona para `/api/vcard/:slug?lang=<lang>`.

### `/api/admin/invite-user`

Valida token do admin, usa `SUPABASE_SERVICE_ROLE_KEY` no backend e envia convite pelo Supabase Auth Admin.

### `/api/wallet/apple/:slug`

Preparado para emitir `.pkpass` quando as credenciais Apple estiverem configuradas. Em standby, o frontend não chama esse endpoint.

## Rewrites Vercel

O `vercel.json` deve preservar APIs e mapear `/qr/:slug` para a função serverless. Rotas SPA devem cair em `/index.html`.

Regra crítica: não usar fallback global que capture `/api/*`.

## Dependências principais

- `@supabase/supabase-js`
- `react`
- `react-dom`
- `react-router-dom`
- `qrcode`
- `lucide-react`
- `clsx`
- `react-easy-crop`
- `passkit-generator`
- `node-forge`

## Build

```powershell
npm.cmd run lint
npm.cmd run build
```

O aviso de bundle acima de 500 kB não bloqueia deploy.
