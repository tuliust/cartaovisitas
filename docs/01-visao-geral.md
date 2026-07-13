# 01 — Visão geral

## Objetivo

O sistema centraliza a criação, edição, distribuição e governança de cartões digitais institucionais da Invest RS.

O produto combina:

- identidade visual controlada;
- dados profissionais multilíngues;
- vCard;
- QR Code;
- assinatura de e-mail;
- área autenticada do colaborador;
- administração e auditoria;
- instalação como aplicativo web.

## Perfis

| Perfil | Capacidades |
|---|---|
| Visitante | Acessa Home, cadastro, login, Termos e endpoints técnicos autorizados. |
| Colaborador | Acessa, edita e acompanha o próprio cartão. |
| Admin | Administra cartões, usuários, auditoria, identidade visual, conteúdos e importações. |

## Decisão sobre `/:slug`

A interface React `/:slug` pertence à área autenticada do proprietário.

O parâmetro deve corresponder ao slug do cartão carregado para a sessão. Não existe, nesta fase, catálogo público individual de colaboradores.

Os endpoints técnicos de vCard e QR mantêm suas regras próprias e podem ser usados sem abrir a interface React do cartão.

## Escopo implementado

- Home institucional;
- cadastro com e-mail `@investrs.org.br`;
- aceite obrigatório dos Termos;
- login;
- recuperação de senha com rate limit;
- edição do próprio cartão;
- dados profissionais em PT, ES e EN;
- avatar opcional;
- seis variantes visuais institucionais;
- vCard multilíngue;
- QR Code com tracking;
- compartilhamento nativo do vCard quando suportado;
- assinatura de e-mail com QR Code;
- Guia de Utilização;
- Termos de Uso e Privacidade gerenciados;
- estatísticas do cartão;
- PWA instalável;
- painel administrativo;
- usuários, convites, bloqueios e perfis;
- auditoria;
- importação CSV;
- branding, metadados e assets;
- Wallet em standby.

## Princípios do produto

- Personalização visual livre não é permitida.
- O colaborador escolhe somente entre as seis variantes aprovadas.
- O e-mail institucional é obrigatório.
- O idioma selecionado usa fallback para PT e depois para campos legados.
- O QR de impressão registra interação antes de abrir o vCard.
- O frontend não usa `service_role`.
- Conteúdo editorial é estruturado, sem HTML arbitrário.

## Frentes ainda abertas

- correções finais desktop e mobile;
- superfície sólida do modal PWA;
- substituição ou complementação dos e-mails com Resend;
- Apple Wallet real;
- Google Wallet real;
- catálogo público ou busca de contatos, se aprovado.
