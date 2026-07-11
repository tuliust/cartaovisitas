# Usuários e convites

O painel `/admin/usuarios` usa `user_profiles` para governar perfil e status. Convites são enviados pelo endpoint server-side `/api/admin/invite-user`, que valida o token do admin e usa `SUPABASE_SERVICE_ROLE_KEY` somente no backend.

Configure na Vercel, sem prefixo `VITE_`:

```text
SUPABASE_SERVICE_ROLE_KEY=
```

Sem essa variável, o endpoint responde de forma controlada que os convites não estão configurados.

Como evolução futura, uma solução de convites próprios poderá usar tabela dedicada, tokens com expiração e provedor transacional externo. Essa alternativa não faz parte da implementação atual.
