# 10 — Responsividade, acessibilidade e toasts

## Responsividade

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

## QR e mobile

QR Code precisa ser legível em mobile e desktop. Downloads devem gerar PNG com nome baseado no slug.

## Erros

Usar `getFriendlyErrorMessage` quando aplicável. Evitar exibir stack trace ou mensagens técnicas internas ao usuário final.
