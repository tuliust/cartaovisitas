# STATUS E CONTINUIDADE — CartaoVisitas

> Auditoria de reintegração ao Supabase: 23/11/2026.  
> Estado: **projeto Supabase original recuperado e ativo; dados existentes preservados**. A reconexão funcional local e a verificação do ambiente Vercel ainda não foram validadas.  
> Regra: nenhuma importação de mocks, seed, migration, ressincronização destrutiva ou deploy automático sem auditoria e testes.

## Identificação

- Repositório: https://github.com/tuliust/cartaovisitas; branch principal `main`, commit `5fa1cd70fea5a0dd72c8410c5a294fff7c0e2d36`.
- Pasta Windows informada: `C:\Users\Tulius\Documents\github\cartaovisitas`; Git local ainda não diagnosticado nesta etapa.
- Supabase real: `mmuzdakjliottmsxfhbd`, URL `https://mmuzdakjliottmsxfhbd.supabase.co`; projeto `cartaovisitas`, `ACTIVE_HEALTHY`, região `sa-east-1`.
- Organização atual acessível pela conta conectada: `Invest RS` (`qlyuihuyiwxieeyntvfm`); não confundir com a antiga organização/acesso.
- Vercel existente: projeto `cartaovisitas`, ID `prj_dIgjo6zEy3N6jm6XraCpH7boCMyQ`, domínio `cartaovisitas.vercel.app` verificado, produção `READY` vinculada ao mesmo SHA de `main`.

## Supabase real — verificação de leitura

- Tabelas: **8**, todas com RLS habilitado: `business_cards`, `card_scan_events`, `user_profiles`, `brand_settings`, `audit_logs`, `password_reset_rate_limits`, `managed_pages`, `user_pre_registrations`.
- Contagens observadas: **2 cartões**, **418 leituras de cartão/QR**, **2 perfis**, **1 registro de identidade visual**, **148 logs de auditoria**, **3 registros de limitação de reset de senha**, **2 páginas gerenciadas**, **0 pré-cadastros**.
- Auth: **2 usuários**. Storage: **1 bucket e 28 objetos**.
- Edge Function: `request-password-reset` ativa, versão 3.
- API URL e chaves públicas (legacy e `sb_publishable_`) disponíveis. **Nenhuma chave foi escrita em arquivo ou publicada neste diagnóstico.**
- Supabase Advisors: 1 INFO (`rls_enabled_no_policy`) e 3 WARN (`anon_security_definer_function_executable`, `authenticated_security_definer_function_executable`, `auth_leaked_password_protection`); revisar antes de abrir permissões.

### Divergência importante de migrations

- GitHub `main`: **8** arquivos SQL em `supabase/migrations`.
- Supabase restaurado: **7** migrations no histórico remoto.
- Não registrada: `202607250001_expand_independent_visual_tokens.sql`.
- O SQL da migration faz um **UPDATE incondicional em `public.brand_settings`**, substituindo todo o JSON `visual_variant_settings` e atualizando `updated_at`. **Não executá-lo automaticamente:** pode apagar personalizações recuperadas.
- Conferência de leitura: o banco já possui **6 templates** com os tokens estendidos de personalização, mas o JSON atual **não é exatamente igual** ao texto da migration. Isso pode refletir configurações editadas após a migração; preservar o estado atual.
- Não marcar a migration como executada sem evidência de histórico/decisão de reconciliação.

## GitHub e demos

- `main`: versão concebida para Supabase real; preservar e auditar antes de publicar mudanças.
- `demo-case`: 1 commit exclusivo à frente e 15 atrás de `main`, com mock `src/lib/demoSupabase.ts`, `.env.demo.example` e `STATUS_E_CONTINUIDADE.md` de demonstração. **Decisão do usuário: não manter a branch demo**. A exclusão ainda não foi executada; tratar após verificação de alterações locais. Não importar dados do mock ao Supabase real.
- O conector GitHub disponível não oferece exclusão de branches. Após a validação da integração, usar o Git local para excluir remotamente e localmente, com verificação de worktree.
- Documentação técnica principal em `docs/INDEX.md`, `docs/03-ambientes-variaveis-deploy.md`, `docs/04-banco-supabase-rls-storage.md`.

## Integração em etapas

1. Executar `git status --short --branch`, `git fetch origin`, verificar `main` e preservar alterações locais antes de trocar de branch.
2. Configurar localmente `.env.local` com `VITE_SUPABASE_URL=https://mmuzdakjliottmsxfhbd.supabase.co` e a **chave pública válida** na variável `VITE_SUPABASE_ANON_KEY`. A aplicação usa o nome `ANON_KEY` também para uma chave `sb_publishable_`; nunca usar secret/service-role no navegador.
3. Desativar/remover `VITE_DEMO_MODE=true` e código de mock; executar a versão `main`.
4. Compilar e validar navegação, login administrativo, cartões, perfis e métricas por leitura, sem gravações.
5. Vercel: já existem as variáveis `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`. Seus valores são classificados como sensíveis e o conector **não os revelou**, mesmo solicitada leitura: **não afirmar que estão certos ou errados**. Confirmar por procedimento autorizado sem divulgar os segredos, antes de qualquer redeploy.
6. Revisar Auth redirect URLs, Edge Function e políticas RLS antes de testes que escrevam dados.
7. Remover `demo-case` conforme decisão do usuário, **sem deletar `.env.local` ou trabalho não commitado**.

## Limites

- Os dados recuperados **já estão no projeto Supabase original**: não é necessário copiá-los de um banco novo ou importar as demonstrações.
- Não executar `supabase db reset`, `db push`, seeds, `npm audit fix --force`, deploy nem operações de escrita sem revisão.
- Documentação registrada apenas na branch `docs/reintegracao-supabase-2026-11-23`; sem alterações na `main` ou na Vercel.
- **Resultado desta rodada:** banco recuperado e inventariado; reconexão funcional local e validação produtiva ainda pendentes.
