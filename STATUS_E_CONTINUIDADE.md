# STATUS E CONTINUIDADE — CartaoVisitas

> Auditoria de reintegração ao Supabase: 23/11/2026.  
> Estado: **projeto Supabase original recuperado e ativo; dados existentes preservados**. A reconexão funcional local foi confirmada pelo usuário; a verificação funcional independente da produção Vercel ainda está pendente.  
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

## Validação local da configuração real — 23/11/2026

A saída PowerShell enviada pelo usuário confirma a preparação para a reintegração na aplicação original, ainda sem testes funcionais com o backend:

- A pasta Windows é `C:\Users\Tulius\Documents\github\cartaovisitas`.
- A `main` local estava **15 commits atrás** de `origin/main`; o usuário executou `git merge --ff-only origin/main` com sucesso, atualizando `4bf73a6` para `5fa1cd7`, sem merge commit nem descartes.
- Após a atualização, `git status --short --branch` retornou `## main...origin/main`, e `git rev-list --left-right --count main...origin/main` retornou `0 0`. Nenhuma alteração local rastreada ou não rastreada foi apresentada.
- O `.env.local` já existia, mas a primeira verificação mostrou URL incorreta ou ausente, chave não configurada e `VITE_DEMO_MODE` igual a `true`.
- Em seguida o usuário ajustou o arquivo local. **Nova verificação mascarada:** URL exata `https://mmuzdakjliottmsxfhbd.supabase.co` = `True`; `VITE_SUPABASE_ANON_KEY` com prefixo `sb_publishable_` = `True`; `VITE_DEMO_MODE` desativado = `True`; `git status` continuou `## main...origin/main`. Nenhum valor da chave foi compartilhado.
- Essa verificação demonstra **configuração local correta**, mas não valida por si só autenticação, acesso às 8 tabelas, visualização dos 2 cartões/418 eventos, leitura das páginas administrativas ou alterações de registro.
- O documento e os dados reais continuam preservados. Nenhuma migration foi aplicada; a pendência da migration `202607250001` continua sob análise, sem execução.
- **Build da `main` concluído e aprovado**; próximo passo seguro: executar `npm.cmd run dev`, validar login com usuário existente, cartão, painel e métricas somente por leitura. Não usar `demo-case` nem importar fixtures.
- A exclusão de `demo-case` é desejada pelo usuário, mas não foi confirmada neste projeto: o procedimento anterior foi interrompido pela defasagem da `main`, agora corrigida. Não apagar trabalho local sem inventariar a branch.

## Build local aprovado — 23/11/2026

O usuário confirmou a execução da `main` original com a configuração local do Supabase real:

- Versões na sessão PowerShell: Node.js `v24.22.1` e npm `11.19.1`.
- Comando `npm.cmd run build`: **aprovado**, encadeando `npm run qa:theme && tsc -b && vite build`.
- `qa:theme`: **Auditoria do contrato visual: APROVADA**, com 25 verificações visuais/funcionais de componentes, seis variantes, identidade visual, responsividade, autenticação, autofill e mobile.
- TypeScript `tsc -b`: sucesso sem erro reportado.
- Vite `v8.1.4`: **1.975 módulos transformados**, build concluído em **1,00 segundo**.
- Artefatos: CSS `286,51 kB` (gzip `44,12 kB`), JS `768,11 kB` (gzip `218,48 kB`), HTML `1,96 kB` (gzip `0,63 kB`).
- Aviso **não bloqueante**: chunk JS superior a 500 kB após minificação; otimização por code splitting pode ser avaliada em trabalho futuro.
- `git status --short --branch` depois do build: `## main...origin/main`, sem alterações locais.
- `npm ci`, migrations, seeds, deploy, alterações em Supabase e importações não foram executados nesta rodada.
- **Pendente para encerramento funcional:** `npm.cmd run dev`, abertura de `/`, `/admin/login`, login com usuário real existente e inspeção **somente de leitura** de cartões, perfis e estatísticas. Não abrir links `/qr/:slug` para testar, pois o endpoint registra eventos de leitura/QR; não enviar convites nem executar operações de escrita.
- Não declarar integração funcional concluída apenas com o build: a configuração do cliente está correta, mas navegação e consultas Supabase ainda não foram confirmadas em browser.

## Testes funcionais locais — CONFIRMADOS pelo usuário em 23/11/2026

Após compilar a `main` com êxito e iniciar a aplicação com `npm.cmd run dev`, o usuário confirmou que **todos os testes solicitados funcionaram**:

- Página inicial (`/`) carregou corretamente.
- Login administrativo (`/admin/login`) funcionou usando o ambiente real.
- Painel de cartões (`/admin/cartoes`) abriu corretamente.
- Os dados históricos do Supabase recuperado foram exibidos na aplicação.

**Conclusão restrita:** reintegração **funcional local de navegação, autenticação e leitura** ao Supabase `mmuzdakjliottmsxfhbd` concluída. O sucesso foi informado pelo usuário; não houve coleta de dados pessoais ou de credenciais. A auditoria do build e os registros históricos foram confirmados anteriormente.

**Fora do escopo / pendências:**

- Testes de escrita ou operação institucional (edição, criação, importação, convite, reset de senha, QR com rastreamento) **não executados**, para preservar os dados reais.
- Valores sensíveis de variáveis da Vercel não verificados; produção `READY` não equivale a homologação funcional independente.
- Migration `202607250001_expand_independent_visual_tokens.sql` ainda sem registro no histórico remoto; **não executar**, pois sobrescreveria configurações atuais `visual_variant_settings` e poderia descartar personalizações.
- Supabase Advisors de segurança e aviso de bundle JS superior a 500 kB permanecem para revisão posterior.
- Branch `demo-case` deve ser **removida**, conforme decisão expressa do usuário, mas a exclusão **ainda não foi confirmada**. A `main` original deve permanecer preservada.

**Próxima etapa:** encerrar as referências de demo no Git após verificar que não há trabalho local pendente, e avançar à reintegração funcional local do projeto `tuliust/eventosinvestrs` com o Supabase original `kcixoybbxcogpqlgeaoi`.

## Limites

- Os dados recuperados **já estão no projeto Supabase original**: não é necessário copiá-los de um banco novo ou importar as demonstrações.
- Não executar `supabase db reset`, `db push`, seeds, `npm audit fix --force`, deploy nem operações de escrita sem revisão.
- Documentação registrada apenas na branch `docs/reintegracao-supabase-2026-11-23`; sem alterações na `main` ou na Vercel.
- **Resultado desta rodada:** banco recuperado e inventariado; `main` local alinhada ao GitHub e `.env.local` corrigido para chave publicável, URL original e demo desativado. **Build e reconexão funcional local com dados reais aprovados pelo usuário; produção funcional, branch demo e homologações de escrita ainda pendentes.**
