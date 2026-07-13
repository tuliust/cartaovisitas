# 10 — Responsividade, acessibilidade e toasts

Mudanças de rota retornam ao topo; hashes do Guia são preservados. Menus fecham por Escape, clique externo, scroll e resize e restauram o foco.

## Responsividade

O header compartilhado do colaborador mantém ícones e nomes acessíveis entre
320 px e desktop. O seletor compacto usa opções circulares com `aria-pressed`.
Menus fecham por Escape, clique externo, scroll e resize e restauram o foco.
Os gráficos possuem descrição e resumo tabular equivalente.

O layout público usa duas áreas principais:

- card visual;
- painel de ações.

Em desktop, a composição pode aparecer em colunas. Em mobile, deve empilhar preservando legibilidade e acesso aos botões.

## Admin em mobile

A tabela de `/admin/cartoes` tem versão mobile em cards, evitando scroll horizontal excessivo. Slugs devem permanecer em uma linha quando exibidos em tabela e podem usar truncamento com ellipsis.

## Formulários

Regras:

- labels visíveis;
- mensagens claras;
- botões com estados de loading;
- erros técnicos convertidos em mensagens amigáveis;
- autocomplete habilitado em login;
- prefixo/sufixo de e-mail preservando compatibilidade com gerenciadores de senha.

## Toasts

O sistema usa toast global para:

- sucesso;
- erro;
- informação.

Características esperadas:

- múltiplas mensagens empilhadas;
- expiração automática;
- fechamento manual;
- `aria-live`;
- funcionamento em desktop e mobile.

Exemplos de uso:

- salvar cartão;
- upload de asset;
- erro de login;
- copiar vCard;
- baixar QR Code;
- enviar convite;
- importar CSV;
- Wallet em standby.

## Modais

Usados para:

- confirmação de apagar cartão;
- convite de usuário;
- detalhes de auditoria;
- Wallet standby;
- importação CSV.

Regras:

- `role="dialog"`;
- `aria-modal="true"`;
- título com `aria-labelledby`;
- fechamento por botão;
- fechamento por backdrop quando seguro;
- não fechar durante operação crítica.

Modais administrativos usam tokens próprios de backdrop, superfície, texto, inputs e botões para manter contraste nos modos claros e escuros. Transparência deve existir apenas no background; o container e seu conteúdo não usam opacidade global.

Headers de tabela, labels e textos auxiliares administrativos usam tokens semânticos (`--admin-text`, `--admin-muted` e `--admin-table-heading`) em vez de cores fixas. Containers com texto não devem receber opacidade reduzida.

## Acessibilidade

Regras mínimas:

- `focus-visible` preservado;
- botões reais para ações;
- links reais para navegação;
- imagens com `alt`;
- campos com labels;
- contraste adequado nas seis variantes;
- QR Code com `alt`;
- toasts com `aria-live`.

## Seletor global de modo visual

O botão compacto de visual exibido na Home abre um popover com seis miniaturas. O controle informa `aria-haspopup` e `aria-expanded`, usa botões com nomes acessíveis, preserva foco visível e fecha por clique externo ou `Escape`. A preferência fica em `localStorage` e pode ser alterada retornando à Home.

No cartão público, o mesmo seletor fica alinhado ao toggle PT/ES/EN e pode quebrar de linha no mobile. Em `/admin/usuarios`, ações compactas usam ícone, texto quando houver espaço, `aria-label` e `title`.

Nos modos claros, botões primários com fundo escuro mantêm texto branco em todos os estados. A transparência visual é aplicada somente aos backgrounds das superfícies; textos, ícones e ações disponíveis permanecem opacos.

## QR e mobile

QR Code precisa ser legível em mobile e desktop. Downloads devem gerar PNG com nome baseado no slug.

## Erros

Usar `getFriendlyErrorMessage` quando aplicável. Evitar exibir stack trace ou mensagens técnicas internas ao usuário final.
