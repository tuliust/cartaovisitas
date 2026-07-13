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


### Resend

Migrar ou complementar os e-mails atuais com Resend.

A arquitetura definitiva ainda precisa ser implementada e validada.

Objetivos obrigatórios:

- templates institucionais;
- secrets server-side;
- geração segura de links;
- resposta uniforme para reduzir enumeração;
- logs sem tokens;
- auditoria;
- testes em Gmail e Outlook.

## Bloqueadores antes de ativar integrações

### Apple Wallet

O passe atual aponta o QR e a URL principal para `/:slug`, rota autenticada.

Antes da ativação:

- escolher destino público adequado;
- alterar o código do passe;
- atualizar `wallet-setup.md`;
- testar em iPhone;
- validar analytics.

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
- destino público do QR;
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
- Guia de Utilização público, ilustrado e gerenciado;
- Termos;
- estatísticas básicas;
- PWA;
- modal PWA com superfície sólida nas seis variantes;
- edição do cartão com link automático e validado por ícones;
- variante salva como padrão de novas sessões autenticadas;
- preview e salvamento sticky no desktop;
- editor de foto com drag-and-drop, ações compactas e recrop;
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
