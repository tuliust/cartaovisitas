# 01 — Visão geral

## Objetivo

O sistema de cartões digitais da Invest RS centraliza a criação, edição, publicação e governança de cartões institucionais de colaboradores. Cada colaborador possui uma página pública por slug, com dados profissionais, vCard, QR Code e ações rápidas de contato.

## Usuários

| Perfil | Descrição |
|---|---|
| Visitante | Acessa cartão público, salva contato, escaneia QR Code ou compartilha link. |
| Colaborador | Acessa `/meu-cartao/editar` e edita o próprio cartão. |
| Admin | Gerencia cartões, usuários, convites, auditoria, identidade visual e importações. |

## Escopo implementado

- Cartões públicos por slug.
- Edição do próprio cartão.
- Painel admin de cartões.
- Painel admin de usuários.
- Convite por Supabase Auth Admin.
- Auditoria de ações administrativas.
- Importação CSV com modelo.
- vCard multilíngue.
- QR Code com tracking real.
- Wallet em standby.
- Branding dinâmico.
- Seis variantes visuais institucionais.
- Toasts globais.
- Regras de RLS e permissões por role/status.

## Fora de escopo atual

- Wallet real em produção.
- Google Wallet real.
- Aprovação editorial de cartões.
- Página pública por área/equipe.
- Busca pública de contatos.
- Dashboard executivo avançado.
- Assinatura de e-mail.
- FAQ pública.
- Modo evento.

## Decisões de produto

- O sistema é institucional; não há personalização visual livre pelo colaborador.
- O colaborador pode escolher apenas uma das seis variações visuais aprovadas.
- E-mails devem ser do domínio `@investrs.org.br`.
- O vCard deve preservar idioma selecionado.
- A coluna de ações da página pública permanece em português; o idioma altera apenas o conteúdo profissional do cartão.
- O QR Code para impressão deve apontar para `/qr/:slug?lang=pt` para registrar scan real antes de abrir o vCard.
