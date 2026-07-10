# 07 — Admin: cartões, usuários e auditoria

## Menu administrativo

- Cartões
- Usuários
- Auditoria
- Configurações
- Sair

## `/admin/cartoes`

Finalidade: gerenciar conteúdo dos cartões.

Funcionalidades:

- listar cartões;
- buscar por nome, e-mail, slug, cargo e departamento;
- filtrar por status;
- ordenar;
- ver analytics básicos;
- criar;
- editar;
- abrir;
- copiar link público;
- copiar vCard;
- baixar QR Code;
- ativar/desativar;
- apagar com confirmação pelo slug;
- baixar modelo CSV;
- importar planilha.

Diferença para `/admin/usuarios`: cartões representam conteúdo publicado; usuários representam acesso ao sistema.

## Apagar cartão

A ação:

- exige confirmação digitando o slug;
- remove eventos associados;
- remove o cartão;
- registra auditoria `card_deleted`.

Não remove necessariamente `auth.users`.

## `/admin/usuarios`

Finalidade: gerenciar acessos, perfis, status e convites.

Funcionalidades:

- listar usuários;
- buscar por nome/e-mail;
- filtrar por perfil;
- filtrar por status;
- visualizar cartão vinculado;
- promover a admin;
- remover admin;
- bloquear;
- desbloquear;
- criar cartão para usuário;
- enviar/reenviar convite.

Regras:

- admin não pode bloquear a si mesmo.
- o único admin não deve remover o próprio acesso.
- usuário bloqueado não acessa áreas restritas.

## Convite

Endpoint:

```text
/api/admin/invite-user
```

Regras:

- método POST;
- exige Bearer token;
- valida admin ativo;
- aceita apenas `@investrs.org.br`;
- usa `SUPABASE_SERVICE_ROLE_KEY` no backend;
- cria/atualiza `user_profiles`;
- registra `user_invited`.

## `/admin/auditoria`

Finalidade: rastrear ações administrativas.

Filtros:

- busca;
- ação;
- alvo;
- data inicial;
- data final.

Ações registradas:

- `card_created`
- `card_updated`
- `card_deleted`
- `card_activated`
- `card_deactivated`
- `user_invited`
- `user_promoted_admin`
- `user_removed_admin`
- `user_blocked`
- `user_unblocked`
- `brand_settings_updated`
- `brand_asset_uploaded`
- `bulk_import_started`
- `bulk_import_completed`
- `bulk_import_failed`

## `/admin/configuracoes`

Finalidade: gerenciar identidade visual e assets.

Inclui:

- logo principal;
- favicon;
- Apple Touch Icon;
- OG image;
- cores;
- background global;
- logo para fundo escuro;
- logo para fundo claro;
- quatro fundos institucionais;
- preview das seis variantes.
