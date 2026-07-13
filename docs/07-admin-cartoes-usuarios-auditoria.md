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
- Guia;
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

## Convites

O endpoint atual usa Supabase Auth Admin. A migração para Resend está pendente e poderá alterar o fluxo operacional e a auditoria.
