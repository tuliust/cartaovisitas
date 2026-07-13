# 11 — Segurança, governança e operação

## Princípios

- Menor privilégio.
- RLS habilitado.
- Service role somente no backend.
- E-mail institucional obrigatório.
- Logs de auditoria para ações administrativas.
- Não commitar segredos.

## Domínio institucional

Acesso de usuário depende de e-mail `@investrs.org.br`.

## Roles

- `admin`: acesso administrativo.
- `user`: colaborador.

O primeiro admin deve ser promovido manualmente via SQL, após a criação do usuário no Supabase Authentication. Depois desse bootstrap, novos admins devem ser geridos por `/admin/usuarios`.

Nunca deixe o sistema sem ao menos um admin ativo. Antes de bloquear, remover ou rebaixar um admin, confirme que outro admin ativo consegue acessar a área administrativa.

## Status

- `active`: acesso normal.
- `pending`: convidado/pendente.
- `blocked`: bloqueado.

## Service role

`SUPABASE_SERVICE_ROLE_KEY` é usada apenas no endpoint server-side de convite.

A Edge Function `request-password-reset` também usa `SUPABASE_SERVICE_ROLE_KEY`
somente no runtime server-side. Ela exige `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `PUBLIC_SITE_URL` e um
`PASSWORD_RESET_RATE_LIMIT_SALT` aleatório. O salt não deve usar valores públicos
nem ser incluído no repositório. O cliente nunca consulta `auth.users`.
A função é pública porque atende usuários sem sessão (`verify_jwt = false`), mas
aceita somente o domínio institucional e aplica os dois limites duráveis antes de
consultar o Auth.

Nunca:

- usar no frontend;
- prefixar com `VITE_`;
- commitar em arquivo;
- colar em documentação com valor real.

## RLS

Verificações essenciais:

- `Authenticated users can manage cards` não deve existir.
- `Public can read active cards` antiga não deve existir se substituída pela policy atual.
- `events public insert` deve validar cartão ativo.
- `audit_logs` deve ser lido apenas por admin.
- `brand_settings` deve ser escrito apenas por admin.

## Auditoria

Registrar:

- alterações de cartão;
- ativação/desativação;
- exclusão;
- convites;
- promoção/remoção de admin;
- bloqueios;
- alterações de branding;
- importações.

Falha de auditoria não deve quebrar ação crítica, mas deve ser registrada em console controlado.

## Apagar cartão

Ação permanente:

- remove eventos associados;
- remove o cartão;
- não remove automaticamente `auth.users`;
- exige confirmação pelo slug.

## Bloquear usuário

Bloqueio deve impedir:

- admin;
- edição do próprio cartão;
- passagem em `is_admin()`.

## Checklist de segurança antes de deploy

```powershell
git status
git diff --check
```

Conferir ausência de:

```text
.env
.env.local
.vercel
*.p12
*.cer
*.pem
*.key
```

## Operação

Rotina recomendada:

- revisar auditoria periodicamente;
- validar convites pendentes;
- remover admins desnecessários;
- testar vCard após mudanças de banco;
- testar RLS após mudanças de policy;
- manter scripts SQL preservados.
