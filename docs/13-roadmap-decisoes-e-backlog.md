# 13 — Roadmap, decisões e backlog

## Em andamento

### Correções visuais finais

- desktop;
- mobile;
- headers;
- formulários;
- página do cartão;
- estatísticas;
- modais.

### Modal PWA

Corrigir a superfície transparente do modal de instalação nas seis variantes.

### Resend

Migrar ou complementar os e-mails atuais com Resend.

A arquitetura definitiva ainda precisa ser implementada e validada.

## Standby

### Apple Wallet

Base técnica preparada, sem ativação em produção.

Dependências:

- Apple Developer Program;
- Pass Type ID;
- certificado;
- WWDR;
- secrets;
- flags;
- teste físico.

### Google Wallet

Depende de Issuer Account, Google Cloud, Service Account, IDs e publicação.

## Futuro para avaliação

- aprovação editorial de cartões;
- páginas por área ou equipe;
- busca pública de contatos;
- analytics executivo;
- exportação de analytics;
- modo evento;
- manual institucional final.

## Implementado e removido do backlog

- seletor visual global;
- assinatura de e-mail;
- Guia de Utilização;
- Termos;
- estatísticas básicas;
- PWA;
- conteúdo gerenciado.

## Decisões adiadas

- terceira página editorial em `managed_pages`;
- persistência do aceite dos Termos;
- service worker;
- catálogo público individual;
- política definitiva de retenção de analytics.

## Itens descartados

### Open Graph dinâmico por cartão

Motivo: exigiria SSR, prerender ou função específica sem prioridade atual.

### Duplicar cartão

Motivo: risco de inconsistência e existência de criação/importação.

### Arquivar cartão

Motivo: ativar/desativar atende à operação.

### Exportação em lote de QR

Motivo: sem demanda operacional atual.

### Alertas automáticos de cartões desatualizados

Motivo: governança permanece operacional.

## Governança

Nenhum item de roadmap constitui autorização automática de desenvolvimento.
