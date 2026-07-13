# 02 — Arquitetura técnica

## Visão

O projeto é uma SPA React/Vite hospedada na Vercel, com Supabase para autenticação, banco, RLS e Storage.

A solução combina:

- frontend React;
- Vercel Functions em `api/`;
- Supabase Edge Function para recuperação de senha;
- Supabase Database e Storage;
- manifest PWA;
- conteúdo editorial estruturado.

## Camadas

| Camada | Responsabilidade |
|---|---|
| React | Rotas, páginas, formulários, modais, previews e navegação. |
| Contexts/Providers | Branding, visual, toasts, colaborador e instalação PWA. |
| `src/lib` | Regras de domínio, serviços Supabase, vCard, QR, auditoria e normalização. |
| Supabase Auth | Sessão, cadastro, login e atualização de senha. |
| Supabase Database | Cartões, perfis, eventos, branding, auditoria e páginas gerenciadas. |
| Supabase RLS | Controle de acesso por perfil, status e propriedade. |
| Supabase Storage | Avatares e assets institucionais. |
| Vercel Functions | vCard, QR, convite, QR PNG e Wallet. |
| Supabase Edge Functions | Recuperação de senha com rate limiting. |

## Providers principais

Ordem conceitual:

```text
BrandSettingsProvider
└─ VisualModeProvider
   └─ ToastProvider
      └─ BrowserRouter
         └─ InstallAppProvider
            ├─ ScrollToTop
            └─ Routes
```

Rotas privadas do colaborador são envolvidas por `CollaboratorProvider`.

## Estrutura relevante

```text
api/
  admin/invite-user.ts
  qr/[slug].ts
  qr-image/[slug].ts
  vcard/[slug].ts
  wallet/

public/
  manifest.webmanifest
  icons/
  email-signature/
  wallet/

src/
  components/
  components/admin/
  components/collaborator/
  contexts/
  hooks/
  lib/
  pages/
  pages/admin/

supabase/
  functions/request-password-reset/
  migrations/
  repairs/
```

## Rotas

As rotas React estão em `src/App.tsx`.

Grupos:

- públicas;
- colaborador autenticado;
- administração.

`ScrollToTop` restaura o topo em mudanças de rota e preserva hashes quando aplicável.

## Serviços server-side

### vCard

```text
/api/vcard/:slug?lang=pt|es|en
```

Gera vCard 3.0 UTF-8.

### QR tracking

```text
/qr/:slug?lang=pt|es|en
```

Rewrite para a função correspondente, registra evento e redireciona ao vCard.

### QR PNG

```text
/api/qr-image/:slug?lang=pt|es|en
```

Gera imagem PNG pública usada pela assinatura de e-mail.

### Convite

```text
/api/admin/invite-user
```

Valida admin ativo e atualmente usa Supabase Auth Admin. A arquitetura será revista na frente Resend.

### Recuperação de senha

```text
supabase/functions/request-password-reset
```

Valida domínio institucional, aplica rate limit e solicita o e-mail de redefinição.

### Wallet

Endpoints Apple e Google permanecem em standby.

## Conteúdo gerenciado

`managed_pages` armazena Termos e Guia em JSON estruturado.

O frontend:

1. consulta o Supabase;
2. normaliza o conteúdo;
3. rejeita dados inválidos ou com mojibake;
4. usa fallback local.

## Build

```powershell
npm.cmd run lint
npm.cmd run build
git diff --check
```

O aviso de chunk acima de 500 kB é conhecido e não bloqueia o build.
