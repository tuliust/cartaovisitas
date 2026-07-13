# 07 — Admin: cartões, usuários, auditoria e configurações

## Navegação

- Cartões
- Usuários
- Auditoria
- Configurações
- Sair

## Cartões

Rota:

```text
/admin/cartoes
```

Capacidades:

- listar;
- buscar;
- filtrar;
- ordenar;
- criar;
- editar;
- abrir;
- copiar vCard;
- baixar QR;
- ativar ou desativar;
- apagar com confirmação;
- importar CSV;
- baixar modelo;
- consultar indicadores básicos.

## Usuários

Rota:

```text
/admin/usuarios
```

Capacidades:

- listar;
- buscar;
- filtrar perfil e status;
- localizar cartão vinculado;
- convidar ou reenviar convite;
- promover ou remover admin;
- bloquear ou desbloquear;
- criar cartão para usuário.

Regras:

- não bloquear a si próprio;
- não remover o último admin ativo;
- usuário bloqueado não acessa áreas restritas.

## Convites — fluxo atual

1. Admin informa o e-mail institucional.
2. Frontend chama `/api/admin/invite-user`.
3. Endpoint valida a sessão e o perfil admin.
4. Supabase Auth Admin cria ou convida o usuário.
5. `user_profiles` é criado ou atualizado como `pending`.
6. Auditoria registra o envio.

A migração para Resend está pendente.

Depois da implementação do Resend, revisar:

- endpoint;
- geração do link;
- template;
- status do perfil;
- tratamento de falhas;
- auditoria;
- reenvio de convite.

## Auditoria

Rota:

```text
/admin/auditoria
```

Características:

- busca;
- filtro por ação;
- filtro por alvo;
- período;
- ordenação por mais recentes;
- 30 itens por página;
- paginação;
- menu de ações;
- modal de detalhes;
- dados anteriores e posteriores quando disponíveis.

Ações incluem cartões, usuários, branding, assets, importação e páginas gerenciadas.

## Configurações

Rota:

```text
/admin/configuracoes
```

Duas frentes:

### Identidade visual

- favicon;
- Apple Touch Icon;
- Open Graph;
- títulos;
- logos por contraste;
- backgrounds;
- seis variantes;
- cores e opacidades;
- previews.

### Conteúdo das páginas

- Termos;
- Guia público em `/guia-de-utilizacao`;
- título e subtítulo;
- aviso;
- seções;
- versão;
- publicação;
- preview;
- restauração;
- auditoria.

## Auditoria de páginas gerenciadas

Ações esperadas:

```text
managed_page_updated
managed_page_published
managed_page_unpublished
managed_page_restored
```

Target:

```text
managed_page
```
