# Importação de cartões

Em `/admin/cartoes`, use **Baixar modelo** para obter o CSV UTF-8 esperado. Não renomeie as colunas. A importação valida e-mail institucional, nome, slug, booleanos e duplicidades antes de habilitar a confirmação.

Modos disponíveis:

- criar apenas novos;
- criar e atualizar existentes por e-mail;
- criar e atualizar existentes por slug.

Linhas inválidas aparecem na prévia e bloqueiam a confirmação até que a planilha seja corrigida. O resultado e as falhas são registrados em `audit_logs`.
