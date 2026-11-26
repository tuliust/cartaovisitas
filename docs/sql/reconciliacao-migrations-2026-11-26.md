# Reconciliação de migration visual — baseline 26/11/2026

Preservar a configuração visual existente. O arquivo histórico `202607250001_expand_independent_visual_tokens.sql` substitui integralmente o JSON. Não reaplicar a versão original em um ambiente com configurações de negócio. Validar estrutura e tipos sem sobrescrever valores editoriais.

## Procedimento de regularização

- Comparar o conjunto de chaves da configuração atual com o contrato de seis variantes e 270 tokens da versão histórica.
- Se todos os campos e tipos estiverem presentes, não executar UPDATE; registrar baseline sem alteração de conteúdo. Diferenças de valores não demonstram execução histórica e precisam ser classificadas como customização aceita antes de reparar o histórico.
- Se houver campos ausentes em outro ambiente, criar uma migration aditiva com defaults apenas para chaves ausentes; não modificar chaves existentes. Testar idempotência, fixtures e restauração isolada.
- Usar `supabase migration repair --status applied` somente após aceite documentado de equivalência/adoção; conferir `supabase migration list` e `supabase db push --dry-run`. Não editar diretamente a tabela de histórico.

Este registro não marca uma migration como aplicada e não autoriza deploy ou reaplicação.
