# 08 — Importação CSV

## Objetivo

Permitir criação ou atualização em massa de cartões pelo painel admin.

## Onde fica

Em `/admin/cartoes`:

- botão “Baixar modelo”;
- botão “Importar planilha”.

## Formato

Arquivo CSV UTF-8 com BOM, separado por vírgula.

Arquivo gerado:

```text
modelo-importacao-cartoes-invest-rs.csv
```

## Colunas

```text
full_name
display_name
email
slug
job_title_pt
job_title_es
job_title_en
department_pt
department_es
department_en
mobile_phone
linkedin
instagram
show_avatar_public
is_active
```

## Regras por coluna

| Coluna | Regra |
|---|---|
| `full_name` | obrigatório |
| `display_name` | opcional |
| `email` | obrigatório, precisa ser `@investrs.org.br` |
| `slug` | obrigatório, minúsculo, sem acentos, sem espaços |
| `job_title_pt` | recomendado |
| `job_title_es` | opcional, fallback PT |
| `job_title_en` | opcional, fallback PT |
| `department_pt` | recomendado |
| `department_es` | opcional, fallback PT |
| `department_en` | opcional, fallback PT |
| `mobile_phone` | opcional, normalizado |
| `linkedin` | opcional, normalizado para URL |
| `instagram` | opcional, normalizado para URL |
| `show_avatar_public` | `true` ou `false` |
| `is_active` | `true` ou `false` |

## Validações

- colunas obrigatórias existem;
- e-mail institucional;
- slug válido;
- duplicidade interna de e-mail;
- duplicidade interna de slug;
- conflito de slug/e-mail no banco;
- booleanos válidos;
- arquivo precisa ser CSV.

## Modos de importação

| Modo | Comportamento |
|---|---|
| Criar apenas novos | ignora registros que já tenham e-mail ou slug existente. |
| Criar e atualizar por e-mail | atualiza cartão encontrado por e-mail; cria se não existir. |
| Criar e atualizar por slug | atualiza cartão encontrado por slug; cria se não existir. |

## Fluxo

1. Baixar modelo.
2. Preencher sem alterar os nomes das colunas.
3. Importar CSV.
4. Revisar prévia.
5. Corrigir linhas com erro, se houver.
6. Escolher modo.
7. Confirmar.
8. Conferir toast de resultado.
9. Conferir auditoria.

## Auditoria

Eventos:

- `bulk_import_started`
- `bulk_import_completed`
- `bulk_import_failed`

## Cuidados

- Não importar planilhas com dados pessoais desnecessários.
- Revisar slugs antes de confirmar.
- Preferir importação por e-mail para atualizações de colaboradores.
