# Encerramento da recuperação — CartaoVisitas

**Data de encerramento documental:** 24/11/2026 (America/Sao_Paulo).  
**Classificação:** **RECUPERAÇÃO FUNCIONAL LOCAL CONCLUÍDA / PRODUÇÃO AINDA NÃO HOMOLOGADA**.  
**Natureza:** registro estático do estado verificado. Não é uma autorização para deploy, alteração de banco, migration ou uso de mocks.

## 1. Decisão de encerramento

O processo de recuperação do projeto original e de descontinuação da demonstração está **encerrado**, com evidências de compilação, login, leitura histórica, sincronização Git e preservação do Supabase. A fase de **homologação de produção e segurança** constitui trabalho novo e está registrada em [issue #7](https://github.com/tuliust/cartaovisitas/issues/7).

Não reabrir a recuperação em futuras retomadas por causa de pendências de produção. Os dados originais já existem no Supabase correto.

## 2. Estado confirmado

| Recurso | Estado em 24/11/2026 |
| --- | --- |
| Repositório de código | [`tuliust/cartaovisitas`](https://github.com/tuliust/cartaovisitas), `main` commit `5fa1cd70fea5a0dd72c8410c5a294fff7c0e2d36` |
| Diretório local utilizado | `C:\Users\Tulius\Documents\github\cartaovisitas` |
| Git no último teste Windows | `main...origin/main`, `0 0`, sem alterações reportadas |
| Demos | `demo-case` excluída do GitHub e localmente; nenhuma referência remanescente no teste |
| Supabase original | `mmuzdakjliottmsxfhbd` — `ACTIVE_HEALTHY` |
| Dados históricos recontados | 2 cartões, 2 perfis, 420 eventos de leitura, 148 auditorias, 2 páginas gerenciadas |
| Configuração visual | JSON atual com 6 variantes; 4 políticas RLS da tabela `brand_settings` |
| Configuração local | `.env.local` usa URL original, chave publicável e demo desativada; arquivo não versionado |
| Build | `npm.cmd run build` aprovado; `qa:theme`, TypeScript e Vite `8.1.4`, 1.975 módulos, 696 ms |
| Vercel | Projeto `cartaovisitas` (`prj_dIgjo6zEy3N6jm6XraCpH7boCMyQ`), conectado a `tuliust/cartaovisitas`, deployment `READY` no SHA da `main` |
| Domínio | `cartaovisitas.vercel.app` verificado; `HEAD /` respondeu HTTP 200 |
| Login e consulta real | **Confirmados localmente pelo usuário**; não testados de forma autenticada na Vercel |
| Documentação | Esta branch `docs/reintegracao-supabase-2026-11-23`; PR [#6](https://github.com/tuliust/cartaovisitas/pull/6) **draft, sem merge** |

O total de eventos de leitura foi **418 no inventário anterior** e **420 na recontagem**. Os dois eventos adicionais não foram atribuídos a uma ação específica. Nenhuma operação SQL de escrita foi executada na auditoria.

## 3. Pendências transferidas para a próxima fase

**[Issue #7 — homologação de produção e segurança](https://github.com/tuliust/cartaovisitas/issues/7)** é o único registro operacional para continuar o que ficou fora da recuperação:

1. Conferir valores das variáveis Vercel de maneira privada e testar autenticação/leitura em produção.
2. Revisar políticas e funções `SECURITY DEFINER` (`is_admin`, `protect_business_card_owner`, `consume_password_reset_rate_limit`); três avisos WARN e um INFO nos Supabase Advisors.
3. Avaliar proteção contra senhas vazadas conforme disponibilidade do plano.
4. **Não executar** `202607250001_expand_independent_visual_tokens.sql` como está: o `UPDATE` substituiria `visual_variant_settings` recuperado. GitHub tem 8 arquivos e o histórico remoto 7 migrations.
5. Homologar operações mutáveis apenas com dados sintéticos em staging, inclusive envio, edição, Wallet/QR e recuperação de senha.
6. Revisar gatilhos Vercel antes de mesclar documentos na `main`.

**Não há evidência de que essas pendências sejam falhas do banco recuperado**; são tarefas de homologação/release e segurança.

## 4. Retomada segura

~~~powershell
Set-Location 'C:\Users\Tulius\Documents\github\cartaovisitas'
git status --short --branch
git fetch --prune origin
git rev-list --left-right --count main...origin/main
git show origin/docs/reintegracao-supabase-2026-11-23:ENCERRAMENTO_RECUPERACAO_2026-11-24.md
npm.cmd run build
~~~

Consultar [relatório de retomada](RELATORIO_DE_RETOMADA_2026-11-23.md) e [trilha de continuidade](STATUS_E_CONTINUIDADE.md). Confirmar a presença de `.env.local` sem imprimir chaves. Caso o Git local esteja sujo ou divergente, avaliar antes de atualizar.

## 5. Regras de preservação

- Não executar `supabase db reset`, `db push`, seed, importações de demonstração, `git reset --hard` nem `git clean`.
- Não substituir os dados e JSON recuperados nem imprimir credenciais em logs, PRs ou documentos.
- **Nenhum merge na `main`, deploy ou alteração em Vercel/Supabase foi feito para este encerramento.**
- A PR documental **permanece draft** para revisão posterior; não confundir documentação pronta com publicação aprovada.

**Resultado final:** recuperação concluída e arquivada, ambiente preservado, produção pendente e rastreada na issue #7.
