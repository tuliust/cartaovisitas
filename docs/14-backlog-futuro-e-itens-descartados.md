# 14 — Backlog futuro e itens descartados

## Objetivo

Este documento registra decisões de evolução do sistema de cartões digitais da Invest RS, separando:

- funcionalidades futuras aprovadas para consideração;
- integrações em standby;
- evoluções institucionais futuras;
- itens definitivamente descartados.

Ele não representa autorização automática de desenvolvimento. Qualquer item futuro listado aqui depende de nova decisão institucional, refinamento técnico, priorização e validação antes de implementação.

## Princípio de governança

- Itens futuros não fazem parte do escopo atual implementado.
- Nenhuma funcionalidade futura deve ser implementada sem nova decisão institucional.
- Itens em standby dependem de condições externas, orçamento, credenciais, contas ou aprovações específicas.
- Itens definitivamente descartados não devem ser reabertos como pendência técnica ou produto futuro sem decisão formal.
- A documentação deve ser atualizada sempre que uma decisão de produto, operação ou governança mudar.

---

## Futuro aprovado para consideração

### Seletor global de modo visual

Status: futuro aprovado para consideração. Não implementado.

Descrição:

- adicionar na Home um botão redondo com o modo visual atual e uma seta para baixo;
- ao clicar, exibir as seis variações visuais institucionais:
  - `dark_black`;
  - `dark_image_1`;
  - `dark_image_2`;
  - `light_white`;
  - `light_image_3`;
  - `light_image_4`;
- salvar a escolha em `localStorage`;
- aplicar a preferência visual às páginas seguintes;
- não alterar `public_visual_variant` no banco;
- manter `public_visual_variant` como fallback institucional do cartão.

Premissa técnica:

- a escolha deve ser uma preferência local do visitante, não uma alteração persistida no Supabase.

### Aprovação editorial de cartões

Status: futuro aprovado para consideração. Não implementado.

Descrição:

Criar um fluxo de revisão antes da publicação ou alteração de cartões, por exemplo:

```text
rascunho → enviado para revisão → aprovado → publicado
```

Objetivo:

- permitir controle institucional sobre alterações sensíveis;
- reduzir risco de publicação de dados incorretos;
- separar edição operacional de aprovação final.

### Página pública por área/equipe

Status: futuro aprovado para consideração. Não implementado.

Descrição:

Criar páginas agregadoras de cartões por área, equipe, diretoria ou grupo institucional.

Exemplos possíveis:

```text
/equipe/comunicacao
/equipe/diretoria
```

Objetivo:

- facilitar acesso a grupos de contatos;
- apoiar eventos, apresentações institucionais e relacionamento externo;
- organizar cartões por estrutura interna.

### Busca pública de contatos

Status: futuro aprovado para consideração. Não implementado.

Descrição:

Criar uma página pública de busca de colaboradores por:

- nome;
- área;
- cargo;
- departamento.

Premissas:

- respeitar apenas cartões ativos;
- avaliar privacidade e exposição pública antes da implementação;
- manter governança institucional sobre quais dados são pesquisáveis.

### Analytics avançado e dashboard executivo

Status: futuro aprovado para consideração. Não implementado.

Descrição:

Evoluir o painel analítico com:

- gráficos por período;
- ranking de cartões mais acessados;
- origem/referrer;
- dispositivos;
- evolução de views, vCards, QR Codes e compartilhamentos;
- exportação CSV de analytics;
- painel executivo.

Premissas:

- avaliar retenção de dados;
- preservar privacidade;
- evitar coleta excessiva de informações pessoais ou sensíveis.

### Assinatura de e-mail

Status: futuro aprovado para consideração. Não implementado.

Descrição:

Gerar assinatura institucional em HTML e/ou texto com dados do cartão.

Possíveis elementos:

- nome;
- cargo;
- área;
- telefone;
- e-mail;
- link do cartão;
- QR Code.

Objetivo:

- padronizar assinaturas institucionais;
- reduzir inconsistências visuais;
- integrar os cartões digitais ao uso cotidiano de e-mail.

### FAQ e suporte

Status: futuro aprovado para consideração. Não implementado.

Descrição:

Criar documentação de apoio para colaboradores e administradores.

Conteúdos possíveis:

- como acessar o cartão;
- como editar dados;
- como salvar contato;
- como usar QR Code;
- como solicitar correções;
- boas práticas de uso;
- dúvidas frequentes;
- orientações para administradores.

### Modo evento

Status: futuro aprovado para consideração. Não implementado.

Descrição:

Criar recursos específicos para eventos, feiras, missões e rodadas de negócio.

Possibilidades:

- cartões específicos por evento;
- páginas temporárias;
- QRs específicos;
- identidade visual de evento;
- agrupamento de participantes;
- métricas segmentadas por evento.

---

## Integrações em standby

### Apple Wallet real

Status: standby. Tecnicamente preparada, mas não ativa em produção.

Descrição:

A integração Apple Wallet possui base técnica preparada para emissão de `.pkpass`, mas depende de requisitos externos e aprovação institucional.

Dependências:

- Apple Developer Program;
- Pass Type ID;
- certificado `.p12`;
- certificado WWDR;
- variáveis privadas na Vercel;
- ativação de flags;
- teste físico em iPhone.

Observações:

- certificados e senhas nunca devem ser enviados ao frontend;
- variáveis Apple não devem usar prefixo `VITE_`;
- a ativação depende de orçamento e decisão institucional.

### Google Wallet

Status: standby/futuro. Não implementado.

Descrição:

Integração futura para emissão de cartões compatíveis com Google Wallet.

Dependências:

- Google Wallet Issuer Account;
- projeto Google Cloud;
- Service Account;
- Issuer ID;
- Class ID;
- JWT assinado;
- aprovação/publicação.

Observações:

- credenciais Google devem ser exclusivamente de backend;
- nenhuma credencial deve ser exposta no frontend;
- implementação depende de avaliação técnica e institucional futura.

---

## Evoluções institucionais futuras

### Manual institucional final

Status: futuro. Não implementado.

Descrição:

Criar um manual institucional de uso e governança dos cartões digitais.

Conteúdos previstos:

- padrões de cargos em PT/ES/EN;
- padrão de departamentos;
- padrão de telefones;
- política de uso de foto;
- processo de atualização de dados;
- governança de administradores;
- solicitação de novo cartão;
- boas práticas de QR Code;
- uso em eventos;
- critérios de publicação e desativação.

### Convite próprio

Status: futuro possível. Não implementado.

Descrição:

Criar fluxo próprio de convite, alternativo ao Supabase Auth Admin.

Possíveis componentes:

- tabela dedicada de convites;
- tokens com expiração;
- status de aceite;
- provedor transacional externo;
- layout institucional de e-mail;
- trilha de auditoria específica.

Premissa:

- o fluxo atual com Supabase Auth Admin permanece válido enquanto atender à operação.

---

## Itens definitivamente descartados

Os itens abaixo foram avaliados e não serão implementados neste projeto, salvo decisão institucional futura expressa.

### Open Graph dinâmico por cartão

Decisão: descartado definitivamente.

Motivos:

- o app é uma SPA;
- metatags dinâmicas por cartão exigiriam SSR, prerenderização ou função dedicada;
- a funcionalidade não é prioridade institucional;
- metadados genéricos são suficientes para o escopo atual.

### Duplicar cartão

Decisão: descartado definitivamente.

Motivos:

- risco de replicar dados incorretos;
- criação manual e importação CSV já atendem ao fluxo operacional;
- manter cartões individualizados reduz inconsistências.

### Arquivar cartão

Decisão: descartado definitivamente.

Motivos:

- ativar/desativar cartão já cobre a necessidade operacional;
- criar mais um estado aumentaria complexidade sem ganho relevante;
- cartões inativos já deixam de ser exibidos publicamente.

### Exportação em lote de QR Codes

Decisão: descartado definitivamente.

Motivos:

- download individual de QR Code é suficiente para o uso previsto;
- exportação em lote adicionaria complexidade operacional;
- o escopo atual não demanda geração massiva de arquivos.

### Alertas de cartões desatualizados

Decisão: descartado definitivamente.

Motivos:

- a governança será operacional, não automatizada por alerta;
- administradores devem revisar dados conforme processo interno;
- evitar notificações automáticas sem fluxo institucional definido.

---

## Como atualizar este documento

- Se uma funcionalidade futura for aprovada, criar documentação técnica específica antes da implementação.
- Se um item em standby for ativado, mover suas instruções para o documento técnico correspondente.
- Se um item descartado for reaberto, registrar a decisão, o motivo e a autoridade institucional responsável pela mudança.
- Manter este arquivo sincronizado com `docs/13-roadmap-e-itens-futuros.md`.
- Não transformar itens desta lista em tarefas técnicas sem nova priorização formal.
