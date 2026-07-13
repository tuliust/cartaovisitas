# 05 — Rotas, fluxos e perfis

## Perfis

> Atualização: a interface React `/:slug` pertence à área privada do proprietário.
> Os endpoints técnicos de QR, vCard e Wallet permanecem acessíveis conforme suas
> regras atuais; não existe catálogo público individual nesta etapa.

| Perfil | Fonte | Permissões |
|---|---|---|
| Visitante | sem sessão | acessar Home, termos e endpoints técnicos de vCard/QR autorizados. |
| Colaborador | Supabase Auth + `user_profiles.role=user` | acessar, editar e acompanhar o próprio cartão. |
| Admin | Supabase Auth + `user_profiles.role=admin` | administrar cartões, usuários, auditoria e branding. |

Status:

As rotas `/meu-cartao`, `/meu-cartao/editar`, `/meu-cartao/guia`,
`/meu-cartao/assinatura-de-email`, `/meu-cartao/estatisticas` e `/:slug` usam o
`CollaboratorProvider`. Ele valida sessão e usuário ativo e carrega somente o
cartão vinculado por `created_by` ou e-mail. Em `/:slug`, o parâmetro é apenas
comparado ao slug do cartão autenticado e nunca alimenta uma consulta arbitrária.

`/termos-de-uso-e-privacidade` permanece pública, com header reduzido sem sessão.

- `active`: acesso normal.
- `pending`: usuário convidado, aguardando ativação ou primeiro acesso.
- `blocked`: acesso bloqueado no app.

## Fluxo de cadastro

1. Usuário acessa `/cadastro`.
2. Informa e-mail institucional e senha.
3. Supabase envia confirmação, se configurado.
4. Usuário acessa `/meu-cartao/editar`.

Regra: e-mail precisa terminar em `@investrs.org.br`.

## Fluxo de login

1. Usuário acessa `/entrar`.
2. Informa e-mail/senha.
3. Sistema verifica sessão.
4. Sistema verifica perfil e status.
5. Usuário bloqueado recebe erro amigável.
6. Usuário ativo segue para a área correspondente.

## Recuperação de senha

- `/recuperar-senha` envia e-mail de redefinição.
- `/definir-senha` atualiza senha após redirect do Supabase.

## Fluxo admin

- Admin acessa `/admin/login`.
- Depois de autenticado, `/admin` redireciona para `/admin/cartoes`.
- `requireAdmin()` protege páginas administrativas.

## Fluxo de convite

1. Admin acessa `/admin/usuarios`.
2. Clica em “Convidar usuário”.
3. Informa e-mail institucional.
4. Frontend chama `/api/admin/invite-user`.
5. Endpoint valida token e role admin.
6. Endpoint usa `SUPABASE_SERVICE_ROLE_KEY`.
7. Supabase envia convite.
8. `user_profiles` é criado/atualizado como `pending`.
9. Auditoria registra `user_invited`.

## Criação de cartão

Pode ocorrer por:

- admin em `/admin/cartoes/novo`;
- colaborador em `/meu-cartao/editar`, quando ainda não tem cartão;
- importação CSV.

## Cartão vinculado a usuário

O vínculo é identificado por:

- `business_cards.created_by = user_profiles.id`; ou
- `business_cards.email = user_profiles.email`.

## Bloqueio

Usuário bloqueado:

- não deve acessar `/meu-cartao/editar`;
- não deve acessar admin;
- não deve passar em `is_admin()`;
- mantém registro em `auth.users` e `user_profiles`.
