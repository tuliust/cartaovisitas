# 15 — E-mails transacionais e Resend

## Status

Integração com Resend ainda não implementada.

O fluxo atual utiliza mecanismos do Supabase Auth para:

- convite de usuário;
- confirmação de cadastro, conforme configuração;
- recuperação de senha.

Este documento registra requisitos para a nova frente, não uma implementação concluída.

## Fluxo atual

### Convite

- frontend chama `/api/admin/invite-user`;
- endpoint valida admin;
- Supabase Auth Admin envia convite;
- perfil fica `pending`;
- auditoria registra o envio.

### Cadastro

- `signUp` usa `emailRedirectTo`;
- a confirmação depende da configuração do Supabase Auth.

### Recuperação

- frontend chama a Edge Function `request-password-reset`;
- a função aplica rate limit;
- verifica se o e-mail existe;
- usa `resetPasswordForEmail`;
- redireciona para `/definir-senha`.

## Limitação atual de segurança

A recuperação diferencia conta cadastrada e não cadastrada por meio de `not_registered`.

O frontend exibe mensagem específica.

Isso permite enumeração de contas e precisa ser corrigido na nova arquitetura.

## Objetivo

Padronizar e controlar e-mails institucionais por meio do Resend, preservando a integração segura com o Supabase Auth.

## Decisões que precisam ser definidas

- Resend substituirá ou complementará o envio do Supabase?
- Como serão gerados links de convite?
- Como serão gerados links de redefinição?
- O cadastro exigirá confirmação por e-mail?
- Qual domínio remetente será validado?
- Qual endereço será usado em `from` e `reply-to`?
- Onde templates serão versionados?
- Quais eventos entram na auditoria?
- Como serão tratados retries e falhas?
- Como será garantida resposta uniforme ao solicitante?

## Requisitos técnicos

- `RESEND_API_KEY` somente server-side;
- domínio autenticado com SPF e DKIM;
- links originados no Supabase Admin API ou mecanismo seguro equivalente;
- validade e uso único dos links;
- domínio institucional validado;
- rate limiting;
- resposta uniforme para conta existente e inexistente;
- respostas sem stack trace;
- logs sem conteúdo sensível;
- tokens nunca registrados;
- ambiente Production separado de Preview.

## Fluxos previstos

### Convite

Possível fluxo:

1. admin solicita convite;
2. backend valida sessão e role;
3. backend gera link seguro;
4. Resend envia template institucional;
5. `user_profiles` fica `pending`;
6. auditoria registra envio;
7. usuário define senha.

### Recuperação

Possível fluxo:

1. usuário informa e-mail;
2. backend aplica rate limit;
3. backend responde de forma uniforme;
4. internamente verifica se existe conta;
5. quando aplicável, gera link seguro;
6. Resend envia;
7. usuário acessa `/definir-senha`.

## Templates

Templates mínimos:

- convite;
- redefinição de senha;
- confirmação de cadastro, se mantida;
- aviso de falha operacional para administração, se aprovado.

Templates devem incluir:

- identidade Invest RS;
- texto alternativo;
- CTA claro;
- URL visível de fallback;
- validade do link;
- orientação de segurança;
- suporte a texto simples.

## Variáveis futuras

Exemplo conceitual:

```text
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_REPLY_TO=
PUBLIC_SITE_URL=
```

Os nomes finais devem seguir o código implementado.

## Segurança

- nunca usar prefixo `VITE_`;
- nunca expor API key;
- não aceitar remetente arbitrário do cliente;
- não registrar tokens;
- não reutilizar links;
- validar URL pública;
- não confirmar publicamente se um e-mail existe.

## QA futuro

- domínio verificado;
- SPF e DKIM;
- entrega em Gmail e Outlook;
- spam;
- links;
- acentos;
- mobile;
- texto simples;
- falha do provedor;
- rate limit;
- convite duplicado;
- recuperação de conta existente;
- recuperação de conta inexistente com resposta idêntica;
- ausência de tokens em logs;
- auditoria.

## Atualização obrigatória

Depois da implementação, revisar:

- este documento;
- README;
- arquitetura;
- ambientes;
- rotas;
- admin;
- segurança;
- QA.
