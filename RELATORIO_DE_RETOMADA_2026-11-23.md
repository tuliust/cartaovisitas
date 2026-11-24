# RELATÓRIO DE RETOMADA — CARTAOVISITAS

> **Encerramento da limpeza Git — 23/11/2026: CONCLUÍDO.** A branch `demo-case` foi removida **do GitHub e dos dois computadores locais/repositórios verificados**. O usuário executou o procedimento seguro e enviou saída com `Deleted branch demo-case`, `git branch -a --list '*demo-case*'` vazio e `## main...origin/main` em ambos os repositórios. A ausência das branches remotas foi confirmada diretamente no GitHub. `main`, documentação, banco Supabase e Vercel foram preservados.

**Data da verificação:** 23/11/2026  
**Status:** **REINTEGRAÇÃO FUNCIONAL LOCAL CONCLUÍDA** com o Supabase original; limpeza de `demo-case` local e remota **CONCLUÍDA**; homologação independente de produção e fluxos de escrita ainda pendentes.  
**Critério:** não confundir aprovação do build e das consultas locais com validação de fluxos de escrita, segurança ou produção.

## 1. Identidade e fontes de verdade

| Recurso | Identificação |
| --- | --- |
| Projeto | Cartões digitais Invest RS |
| Pasta Windows | `C:\Users\Tulius\Documents\github\cartaovisitas` |
| GitHub | https://github.com/tuliust/cartaovisitas |
| Código principal | `main`, SHA `5fa1cd70fea5a0dd72c8410c5a294fff7c0e2d36` |
| Documentação de auditoria | `STATUS_E_CONTINUIDADE.md`, branch `docs/reintegracao-supabase-2026-11-23` |
| Supabase original | `mmuzdakjliottmsxfhbd` — https://supabase.com/dashboard/project/mmuzdakjliottmsxfhbd |
| URL de API | `https://mmuzdakjliottmsxfhbd.supabase.co` |
| Organização vinculada ao projeto na conexão atual | ID `qlyuihuyiwxieeyntvfm` |
| Vercel | Projeto `cartaovisitas`; https://cartaovisitas.vercel.app |
| Vercel Project ID | `prj_dIgjo6zEy3N6jm6XraCpH7boCMyQ` |

O projeto recuperado está acessível pela conexão Supabase da conta atual. Os identificadores de projeto **não mudaram**; a transferência de acesso/conta não exige importar dados para um segundo banco.

## 2. Panorama técnico e recursos

- Aplicação React/TypeScript + Vite, React Router, Supabase JS e Vercel.
- Funcionalidades: cartões digitais por colaborador, páginas públicas, vCard multilíngue, QR Code rastreável, painel de administração, usuários, identidade visual, auditoria, estatísticas e importação CSV.
- Componentes opcionais de Wallet e e-mails transacionais exigem configuração/validação próprias; não foram homologados nesta reconciliação.
- Supabase `ACTIVE_HEALTHY`, região `sa-east-1`.
- **8 tabelas públicas com RLS**; registros vistos na auditoria: **2 cartões**, **418 eventos de leitura de QR/cartão**, **2 perfis**, **148 registros de auditoria**, **1 configuração visual**, **2 páginas gerenciadas**, **3 registros de rate limit** e **0 pré-cadastros**.
- **Auth:** 2 usuários. **Storage:** 1 bucket, 28 objetos. **Edge Functions:** `request-password-reset` ativa.
- **Migrations:** 8 arquivos SQL no GitHub contra 7 entradas no histórico remoto (detalhes na seção 5).
- A Vercel listou deployment de produção `READY` no mesmo SHA da `main`. A presença de variáveis de ambiente na Vercel **não comprova que seus valores atuais correspondam ao projeto recuperado**.

## 3. Evidências da reintegração local — CONCLUÍDO

1. O Git local foi atualizado por fast-forward de `4bf73a6` para `5fa1cd7` (15 commits); `main...origin/main` ficou `0 0` e `git status` limpo.
2. O arquivo local `.env.local` foi configurado e confirmado **sem divulgar valores**:
   - `VITE_SUPABASE_URL` = `https://mmuzdakjliottmsxfhbd.supabase.co`;
   - `VITE_SUPABASE_ANON_KEY` contém chave **Publishable** (`sb_publishable_...`);
   - `VITE_DEMO_MODE` desativado.
3. Com Node.js `24.22.1` e npm `11.19.1`, `npm.cmd run build` foi aprovado: auditoria `qa:theme`, TypeScript e Vite `8.1.4` (1.975 módulos).
4. O usuário confirmou no navegador local o carregamento da página inicial, login administrativo, painel de cartões e **exibição correta dos dados históricos do Supabase real**.
5. Nenhum dado real foi importado, editado, recriado ou excluído; nenhuma migration, seed ou publicação foi executada.

**Conclusão do teste:** reconexão **local, autenticada e de leitura** com o Supabase original aprovada pelo usuário. Não houve ensaio de mutações nem validação independente da produção.

## 4. Como retomar no Windows

### Preparação e Git (não descartar trabalho local)

```powershell
cd 'C:\Users\Tulius\Documents\github\cartaovisitas'
git status --short --branch
git fetch origin
git rev-list --left-right --count main...origin/main
git check-ignore .env.local
Test-Path .env.local
node --version
npm.cmd --version
```

- Usar a **`main`**, não `demo-case`. Se houver alterações locais, **não** executar pull, reset ou limpeza antes de analisá-las. Se a `main` estiver limpa e só atrasada, `git pull --ff-only` pode ser utilizado.
- Em `.env.local`, conferir URL original e chave pública na variável `VITE_SUPABASE_ANON_KEY`, sem expor a chave nem usar `sb_secret_`/service role em variáveis `VITE_`. Não substituir por mocks.
- `.env.local` deve permanecer ignorado pelo Git. `node_modules` já existia na última validação; usar `npm.cmd ci` **apenas** se precisar reinstalar dependências e após conferir a árvore local.

### Validar e abrir

```powershell
npm.cmd run build
npm.cmd run dev
```

- Acesso local habitual: http://localhost:5173/
- Login administrativo: http://localhost:5173/admin/login
- Cartões administrativos: http://localhost:5173/admin/cartoes
- Confirmar **somente leitura** de cartões, usuários e estatísticas. Não abrir links `/qr/:slug` como teste: o endpoint registra eventos de acesso.
- Encerrar o Vite com `Ctrl+C`. O `localhost:5173` pode mudar se outra aplicação estiver usando a porta.

### Ler a auditoria sem mudar de branch

```powershell
git fetch origin
git show origin/docs/reintegracao-supabase-2026-11-23:STATUS_E_CONTINUIDADE.md
git show origin/docs/reintegracao-supabase-2026-11-23:RELATORIO_DE_RETOMADA_2026-11-23.md
```

## 5. Pendências e riscos para tratar depois

| Prioridade | Questão | Ação recomendada |
| --- | --- | --- |
| Alta | Migration `202607250001_expand_independent_visual_tokens.sql` ausente no histórico remoto | **NÃO executar automaticamente.** Ela substitui integralmente `visual_variant_settings`. O banco já tem seis variantes com tokens estendidos, mas com JSON diferente do SQL; preservar possíveis personalizações e investigar histórico antes de conciliar |
| Alta | Segurança Supabase | Revisar avisos `SECURITY DEFINER` executável por papéis públicos/autenticados e proteção contra senhas vazadas, sem ampliar permissões inadvertidamente |
| Média | Vercel | Validar correspondência de URL/chave publicável, funções server-side, redirects Auth e testes independentes da produção antes de redeploy |
| Média | Operações não homologadas | Validar em ambiente apropriado criação/edição, convite, QR, importação, reset de senha, RLS e Storage, com plano de reversão |
| Baixa | Bundle JS | Aviso não bloqueante de chunk ~768 kB; planejar code splitting |
| Administrativa | `demo-case` | **CONCLUÍDO:** branch excluída do remoto e do ambiente local; ausência confirmada |

A antiga branch `demo-case` continha código/fixtures de demonstração, **não dados reais**. As referências **remota e local foram removidas e verificadas**. Nenhum mock foi mesclado à `main` ou importado no Supabase.

## 6. Limites de preservação

- Não executar `supabase db reset`, `db push`, seeds, imports, `git reset --hard`, `git clean` ou `npm audit fix --force` automaticamente.
- Não revelar API keys, certificados Wallet, service-role, secrets, tokens, dados pessoais nem registros de usuários.
- Não criar outro Supabase, não sobrescrever configurações visuais e não disparar operações de produção.
- A documentação está em branch separada; `main` e deployment existente foram preservados.
- Fonte complementar: `README.md`, `docs/INDEX.md`, `docs/03-ambientes-variaveis-deploy.md`, `docs/04-banco-supabase-rls-storage.md`, `docs/12-qa-checklists.md`.


## 7. Encerramento da demo-case — CONCLUÍDO EM 23/11/2026

- A exclusão remota da branch `demo-case` foi confirmada diretamente na lista de branches do GitHub.
- O usuário confirmou no PowerShell a exclusão da referência local: `Deleted branch demo-case (was 5f7a535)`.
- O comando `git branch -a --list '*demo-case*'` retornou **sem resultados**, após `git fetch --prune origin`.
- O estado final `git status --short --branch` retornou `## main...origin/main`, sem modificações locais reportadas.
- `main` e `docs/reintegracao-supabase-2026-11-23` permanecem preservadas; nenhum dado real foi alterado nem código de demonstração foi mesclado na aplicação.
- **Status de limpeza: concluído (remoto e local).** Não há ações adicionais de `demo-case` a executar.

**Estado a registrar no Guia de Retomada:** *Aplicação funcional com banco Supabase original recuperado; Git, build e login/leitura local validados em 23/11/2026. Pendentes apenas: verificação completa da produção e homologação de operações de escrita.*

## 8. Auditoria final de integridade e publicação — 23/11/2026

**Auditoria por leitura efetuada após a remoção de `demo-case`:**

- GitHub: `main` permanece em `5fa1cd70fea5a0dd72c8410c5a294fff7c0e2d36`; a branch documental difere somente por este relatório e `STATUS_E_CONTINUIDADE.md`. Não há branch remota `demo-case`.
- Supabase `mmuzdakjliottmsxfhbd`: `ACTIVE_HEALTHY`; consulta SQL **somente leitura** retornou `business_cards=2`, `card_scan_events=420`, `user_profiles=2`, `audit_logs=148` e `managed_pages=2`. Os eventos de leitura passaram de **418 no inventário anterior** para **420** nesta auditoria. Não há atribuição confirmada da origem desses dois novos registros; nenhum `INSERT`, `UPDATE` ou `DELETE` foi executado nesta verificação.
- Vercel: projeto `cartaovisitas`, deployment produção `dpl_2KrFrYzJADkZgNR4eQEibrgN5a6G`, estado `READY`, SHA `5fa1cd70...` compatível com GitHub `main`; domínio `cartaovisitas.vercel.app` **verificado**.
- Variáveis existentes na produção: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`. **Os valores sensíveis não foram confirmados**; `READY` não é teste funcional autenticado em produção.
- Supabase Security Advisors: 3 avisos `WARN` — funções `SECURITY DEFINER` executáveis por `anon` e `authenticated`, e proteção contra senhas vazadas desativada — e 1 `INFO` de RLS habilitada sem policy. Requer análise das funções, papéis e impacto antes de mudanças.
- **Decisão de segurança:** nenhum merge na `main`, redeploy, alteração em Auth/RLS, segredo, migration ou teste mutável nesta rodada. Documentação pronta para revisão via Pull Request; uma publicação acionada automaticamente por merge deve ser precedida da validação de ambiente e do fluxo de deploy.

**Status final seguro:** aplicação reintegrada e testada localmente; demo removida; infraestrutura e inventário confirmados por leitura; **produção e escrita ainda não homologadas**.

## 9. Auditoria das pendências e execução no VS Code — 23/11/2026

### 9.1 Segurança Supabase — diagnóstico por metadados concluído

Consulta **somente leitura** ao catálogo `pg_proc` e ao Security Advisor:

| Função `public` com `SECURITY DEFINER` | EXECUTE anon | EXECUTE authenticated | Observação |
| --- | --- | --- | --- |
| `is_admin()` | Sim | Sim | Retorna `boolean` e seu código referencia `auth.uid()`. Revisar implementação/RLS antes de restringir |
| `protect_business_card_owner()` | Sim | Sim | Retorna `trigger`; é uma função de gatilho, não uma RPC comum. Revisar concessões e triggers vinculados |
| `consume_password_reset_rate_limit(...)` | Não | Não | Execução direta não concedida aos dois papéis |

As três funções têm configuração explícita `search_path=public`. Isso **não substitui** revisão do corpo, RLS e chamadas internas. Não executar `REVOKE` em massa: `is_admin()` pode participar de políticas RLS e remover `EXECUTE` pode impedir fluxos legítimos.

**Advisors atuais:** `anon_security_definer_function_executable` (WARN); `authenticated_security_definer_function_executable` (WARN); `auth_leaked_password_protection` (WARN); `rls_enabled_no_policy` (INFO). A proteção contra senhas vazadas pode ser habilitada pelo painel Auth **se o projeto tiver plano Supabase Pro ou superior**; não houve alteração de configuração. Referência: https://supabase.com/docs/guides/auth/password-security.

### 9.2 Migration e personalizações — NÃO APLICAR

- Arquivos do GitHub: **8**. Histórico de migrations executadas no Supabase: **7**.
- A migration pendente `supabase/migrations/202607250001_expand_independent_visual_tokens.sql` contém um `UPDATE public.brand_settings SET visual_variant_settings = <JSON estático> WHERE singleton=true`. Executá-la substituiria a configuração recuperada.
- Verificação atual somente leitura: `brand_settings.visual_variant_settings` já é um objeto JSON com **seis variantes**; a tabela dispõe de **quatro políticas RLS**. O cadastro e o seletor de seis variantes já passaram no `qa:theme` e no teste funcional local.
- **Decisão:** não executar nem marcar falsamente a migration como aplicada. A eventual conciliação exige backup/versionamento do JSON existente e um novo plano idempotente que preserve personalizações; essa tarefa não bloqueia a aplicação já funcional.

### 9.3 Vercel e produção — diagnóstico concluído, homologação pendente

- O contexto Git da Vercel confirma ligação `cartaovisitas` → **`tuliust/cartaovisitas`**, coerente com GitHub `main`.
- Último deployment de produção consultado: `READY`, SHA correspondente à `main`, domínio `cartaovisitas.vercel.app` verificado.
- Variáveis de produção necessárias constam cadastradas, mas o conector não confirma os **valores** de `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` e variáveis server-side. Conferir **sem mostrar secrets** em Vercel → projeto `cartaovisitas` → Settings → Environment Variables; verificar URL `mmuzdakjliottmsxfhbd`.
- Depois dessa conferência, homologar login e leitura na **URL de produção** com usuário existente. Somente com ambiente de testes isolado e dados sintéticos homologar operações de escrita, recuperação de senha e QR com rastreamento.
- **Não fazer redeploy agora** apenas para incorporar esta documentação: push/merge na `main` pode disparar publicação na Vercel.

### 9.4 Comandos seguros para o terminal PowerShell do VS Code

Os comandos a seguir **não alteram dados Supabase nem publicam**. Executar na máquina Windows, sem copiar credenciais para o chat:

~~~powershell
Set-Location 'C:\Users\Tulius\Documents\github\cartaovisitas'

if ((git branch --show-current) -ne 'main') {
    throw 'Troque para main somente depois de preservar alteracoes locais.'
}
git status --short --branch
git fetch --prune origin
if ($LASTEXITCODE -ne 0) { throw 'Falha ao consultar GitHub.' }
git rev-list --left-right --count main...origin/main
git branch -a --list '*demo-case*'

if (-not (Test-Path '.env.local')) { throw '.env.local ausente.' }
$EnvVars = @{}
Get-Content '.env.local' | ForEach-Object {
    if ($_ -match '^\s*(VITE_SUPABASE_URL|VITE_SUPABASE_ANON_KEY|VITE_DEMO_MODE)\s*=(.*)$') {
        $EnvVars[$matches[1]] = $matches[2].Trim().Trim('"', "'")
    }
}
$Key = $EnvVars['VITE_SUPABASE_ANON_KEY']
Write-Output "URL correta: $($EnvVars['VITE_SUPABASE_URL'] -eq 'https://mmuzdakjliottmsxfhbd.supabase.co')"
Write-Output "Chave publica: $($Key -like 'sb_publishable_*')"
Write-Output "Secret indevido: $($Key -like 'sb_secret_*')"
Write-Output "Demo desativada: $($EnvVars['VITE_DEMO_MODE'] -ne 'true')"

npm.cmd run build
if ($LASTEXITCODE -ne 0) { throw 'Build reprovado.' }

if (Get-Command vercel -ErrorAction SilentlyContinue) {
    vercel project inspect cartaovisitas --scope tuliust
} else {
    Write-Output 'Vercel CLI nao instalado. Use o dashboard.'
}
~~~

O `vercel project inspect` só consulta metadados do projeto; requer CLI instalado e login na equipe correta. **Não usar** `vercel git connect`, `vercel deploy`, `vercel env pull`, `supabase db push` ou comandos de escrita nesta verificação.

### 9.5 Critérios de encerramento

- **Concluído:** recuperação do banco; Git, build, login e leitura local; exclusão da demo; inspeção de migrations e dos privilégios básicos; identificação da integração Vercel; documentação.
- **Pendente (não é falha da recuperação):** conferência privada dos valores Vercel; homologação autenticada em produção; revisão linha a linha de funções/autorizações; eventual habilitação de proteção de senha; plano específico para fluxos mutáveis em staging.
- Pull Request documental: https://github.com/tuliust/cartaovisitas/pull/6 (**draft**, sem merge). Após homologação do impacto de deploy, poderá ser revisado e mesclado. Não alterar `main` automaticamente.

## 10. Resultado de execução no VS Code e diagnóstico do domínio principal — 23/11/2026

O usuário executou os comandos de validação em PowerShell no VS Code e enviou a saída integral:

| Verificação | Resultado |
| --- | --- |
| `git status --short --branch` inicial/final | `## main...origin/main` (limpa e sincronizada) |
| `git rev-list --left-right --count main...origin/main` | `0 0` |
| `git branch -a --list '*demo-case*'` | Sem entradas |
| `npm.cmd run build` | **APROVADO**; auditoria visual de 6 variantes, `tsc -b` e Vite `8.1.4`, 1.975 módulos, 696 ms |
| Otimização | Aviso **não bloqueante** para bundle JS de 768,11 kB (gzip 218,48 kB) |
| `vercel.cmd project inspect cartaovisitas --scope tuliust` | Projeto `prj_dIgjo6zEy3N6jm6XraCpH7boCMyQ` encontrado; Vite, Node 24.x |
| HTTP `HEAD https://cartaovisitas.vercel.app/` | **HTTP 200**, conforme saída do usuário |

**Interpretação:** o build local, o estado Git, a identificação do projeto na Vercel e a disponibilidade HTTP pública foram confirmados. Isso **não comprova login administrativo, RLS nem operações de escrita em produção**. Os testes de login e leitura com banco real foram previamente confirmados **apenas localmente**.

**Ações finais recomendadas:** nenhuma migration/destruição de dados; conferir variáveis Vercel de forma privada, testar autenticação e leitura em produção com conta existente, e planejar homologação de escrita em staging. O PR #6 continua **draft**, não mesclado, para evitar deployment inesperado ao incorporar documentação. 
