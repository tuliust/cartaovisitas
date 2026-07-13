# Cartões digitais Invest RS

Sistema institucional de cartões de visita digitais da Invest RS, com páginas públicas por colaborador, vCard multilíngue, QR Code rastreável, painel administrativo, governança de usuários, auditoria, importação em massa e identidade visual controlada.

## Stack

- React + Vite + TypeScript
- Supabase Auth, Database, Row Level Security e Storage
- Vercel para deploy e funções serverless
- React Router
- `qrcode` para geração de QR Code
- `passkit-generator` e `node-forge` para Apple Wallet, atualmente em standby
- `react-easy-crop` para edição de avatar

## Rotas principais

### Públicas

- `/` — página inicial.
- `/guia-de-utilizacao` — Guia de Utilização público.
- `/termos-de-uso-e-privacidade` — Termos de Uso e Privacidade.
- `/api/vcard/:slug?lang=pt|es|en` — vCard UTF-8.
- `/qr/:slug?lang=pt|es|en` — tracking real de QR Code e redirecionamento para o vCard.

### Colaborador

- `/entrar` — login institucional.
- `/cadastro` — cadastro com e-mail `@investrs.org.br`.
- `/meu-cartao` — redirecionamento para a área do cartão.
- `/meu-cartao/editar` — edição do próprio cartão.
- `/:slug` — interface autenticada do proprietário, restrita ao cartão da sessão.
- `/recuperar-senha` — solicitação de redefinição.
- `/definir-senha` — definição/redefinição de senha.

### Admin

- `/admin/cartoes` — gestão de cartões.
- `/admin/cartoes/novo` — criação de cartão.
- `/admin/cartoes/:id/editar` — edição de cartão.
- `/admin/usuarios` — usuários, perfis, status e convites.
- `/admin/auditoria` — histórico de ações administrativas.
- `/admin/configuracoes` — identidade visual, assets e branding.

## Comandos locais

No Windows PowerShell:

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
npm.cmd run preview
```

Validação antes de deploy:

```powershell
npm.cmd run lint
npm.cmd run build
git diff --check
```

## Variáveis de ambiente

Use `.env.example` como referência. Variáveis `VITE_` são públicas no frontend. Segredos de backend nunca devem usar `VITE_`.

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APP_BASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
PUBLIC_SITE_URL=
APPLE_WALLET_ENABLED=false
GOOGLE_WALLET_ENABLED=false
VITE_WALLET_PUBLIC_ENABLED=false
```

`SUPABASE_SERVICE_ROLE_KEY` é usada apenas por endpoint server-side para convite de usuários. Nunca commitar essa chave.

## Segurança

Nunca commitar:

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

RLS deve permanecer habilitado. A função `public.is_admin()` governa o acesso administrativo.

## Documentação canônica

A documentação completa está em `docs/INDEX.md`.

## Status funcional

Implementado:

- cartão público por slug;
- vCard multilíngue com UTF-8;
- QR Code rastreável por `/qr/:slug`;
- painel administrativo;
- gestão de usuários;
- auditoria;
- importação CSV;
- branding dinâmico;
- seis variantes visuais institucionais;
- Guia de Utilização público e gerenciado;
- favicon e Apple Touch Icon configuráveis;
- toasts globais;
- Wallet em standby.

Standby/futuro:

- emissão real de Apple Wallet;
- Google Wallet;
- aprovação de cartões;
- páginas públicas por área/equipe;
- busca pública de contatos;
- analytics avançado;
- assinatura de e-mail;
- FAQ;
- modo evento.
