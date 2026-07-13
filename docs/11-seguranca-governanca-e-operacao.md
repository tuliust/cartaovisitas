# 11 — Segurança, governança e operação

## Princípios

- menor privilégio;
- RLS habilitado;
- service role somente no backend;
- e-mail institucional;
- auditoria;
- sem segredos no Git;
- validação defensiva de dados remotos.

## Domínio institucional

Usuários devem utilizar:

```text
@investrs.org.br
```

## Roles e status

Roles:

```text
admin
user
```

Status:

```text
active
pending
blocked
```

Bloqueio deve impedir:

- área do colaborador;
- administração;
- passagem em `public.is_admin()`.

## Service role

Usos atuais:

- convite server-side;
- recuperação de senha server-side;
- operações administrativas necessárias.

Nunca:

- expor no frontend;
- prefixar com `VITE_`;
- commitar;
- incluir valor real na documentação.

## Recuperação de senha

A Edge Function:

- aceita solicitação pública;
- valida domínio;
- aplica limite por IP e e-mail;
- usa hashes;
- evita consulta de `auth.users` pelo cliente;
- retorna respostas controladas.

## Conteúdo gerenciado

- JSON estruturado;
- sem HTML arbitrário;
- sem scripts;
- normalização;
- IDs de seção únicos;
- fallback local;
- detecção de mojibake;
- escrita exclusiva de admin.

## Mojibake

Proteções:

- detecção no frontend;
- conteúdo remoto inválido cai para fallback;
- script ASCII-only de reparo;
- sem substituições automáticas inseguras no cliente.

## Auditoria

Registrar ações administrativas relevantes.

Falha de auditoria não deve expor dados sensíveis nem quebrar uma ação crítica já concluída.

## E-mails

O fluxo atual depende do Supabase Auth para convite e redefinição.

A futura integração com Resend deve preservar:

- geração segura de links;
- proteção contra enumeração;
- rate limiting;
- segredos server-side;
- validação do domínio;
- auditoria;
- mensagens sem dados sensíveis.

## Checklist de segurança

```powershell
git status
git diff --check
```

Não incluir:

```text
.env
.env.local
.vercel
*.p12
*.cer
*.pem
*.key
dist
node_modules
supabase/.temp
```

## Operação

- revisar auditoria;
- revisar admins ativos;
- validar convites pendentes;
- testar RLS depois de policies;
- testar vCard depois de mudanças de schema;
- preservar migrations e repairs.
