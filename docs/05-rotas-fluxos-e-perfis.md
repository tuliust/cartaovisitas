# 05 — Rotas, fluxos e perfis

## Perfis

| Perfil | Fonte | Permissões |
|---|---|---|
| Visitante | sem sessão | Home, autenticação, Termos e endpoints técnicos autorizados. |
| Colaborador | Auth + perfil ativo | editar e acompanhar o próprio cartão. |
| Admin | Auth + perfil admin ativo | administrar o sistema. |

## Rotas públicas

```text
/
/entrar
/cadastro
/recuperar-senha
/definir-senha
/termos-de-uso-e-privacidade
```

## Rotas do colaborador

```text
/meu-cartao
/meu-cartao/editar
/meu-cartao/guia
/meu-cartao/assinatura-de-email
/meu-cartao/estatisticas
/:slug
```

Essas rotas usam `CollaboratorProvider`, exceto Termos, que pode montar o provider em modo não obrigatório.

## Rota `/:slug`

- exige sessão;
- carrega somente o cartão vinculado ao usuário;
- compara o parâmetro ao slug do cartão autenticado;
- não consulta um cartão arbitrário com base no parâmetro;
- redireciona quando o slug não corresponde.

## Rotas administrativas

```text
/admin
/admin/login
/admin/cartoes
/admin/cartoes/novo
/admin/cartoes/:id/editar
/admin/usuarios
/admin/auditoria
/admin/configuracoes
```

`/admin` redireciona para `/admin/cartoes`.

## Cadastro

1. Usuário informa prefixo do e-mail institucional.
2. Informa e confirma a senha.
3. Aceita os Termos de Uso.
4. O modal consulta `managed_pages` e usa fallback local.
5. Supabase cria o usuário e pode enviar confirmação, conforme configuração.
6. Depois da autenticação, o usuário acessa a área do cartão.

O aceite é obrigatório no frontend e ainda não possui registro dedicado no banco.

## Login

1. Validar credenciais.
2. Verificar sessão.
3. Verificar perfil e status.
4. Redirecionar usuário ativo.
5. Bloquear usuário com `status=blocked`.

## Recuperação de senha

1. Usuário acessa `/recuperar-senha`.
2. Edge Function valida domínio e rate limit.
3. A função verifica se o e-mail está cadastrado.
4. Solicita o fluxo de redefinição.
5. O link aponta para `/definir-senha`.

O mecanismo de entrega será revisto na frente Resend.

## Convite

Fluxo atual:

1. Admin envia e-mail em `/admin/usuarios`.
2. Frontend chama `/api/admin/invite-user`.
3. Endpoint valida o token e o perfil admin.
4. Supabase Auth Admin envia o convite.
5. `user_profiles` é criado ou atualizado como `pending`.
6. Auditoria registra `user_invited`.

## Criação do cartão

Pode ocorrer por:

- admin;
- colaborador sem cartão;
- importação CSV.

Vínculo:

- `created_by`; ou
- correspondência de e-mail institucional.

## Conteúdo gerenciado

- Termos: público.
- Guia: autenticado.
- Fallback local quando o Supabase falha, o registro não existe ou o conteúdo é inválido.
