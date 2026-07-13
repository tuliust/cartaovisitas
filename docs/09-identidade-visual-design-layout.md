# 09 — Identidade visual, design e layout

## Princípio

A identidade visual é institucional e controlada.

O colaborador não cria temas livres nem envia backgrounds próprios.

## Seis variantes

### Escuras

```text
dark_black
dark_image_1
dark_image_2
```

### Claras

```text
light_white
light_image_3
light_image_4
```

Cada variante possui tokens próprios de cor, background, superfície, texto, overlay e opacidade.

## Seleção global

O seletor visual:

- aparece na Home e em headers aplicáveis;
- usa miniaturas reais;
- persiste a preferência em `localStorage`;
- acompanha a navegação;
- não altera o cartão salvo no banco.

Chave:

```text
invest-rs-public-visual-mode
```

## Seleção no formulário

O seletor do formulário altera somente:

```text
public_visual_variant
```

Ele não altera:

- `VisualModeContext`;
- preferência local;
- branding global.

## Tokens semânticos

A aplicação deriva tokens para:

- texto;
- texto secundário;
- superfícies;
- bordas;
- inputs;
- header;
- botões;
- foco;
- modal;
- estados.

Componentes devem consumir os tokens semânticos e evitar paletas paralelas.

## Transparência

- não usar `opacity` em containers com texto;
- usar `rgba()` ou `color-mix()` no background;
- superfícies administrativas de configuração permanecem opacas;
- modais devem usar superfície sólida;
- `card_surface_opacity` afeta somente superfícies previstas.

O modal PWA usa uma superfície elevada sólida e um backdrop semântico nas seis variantes, sem herdar `card_surface_opacity`.

## Logos

- `logo_on_dark_url`: logo clara para fundos escuros;
- `logo_on_light_url`: logo escura para fundos claros;
- `logo_url`: fallback técnico/legado.

Usar:

```css
object-fit: contain;
```

## Metadados

Configuráveis:

- `browser_title`;
- `apple_touch_title`;
- favicon;
- Apple Touch Icon;
- Open Graph.

## Guia de Utilização

O Guia público usa:

- índice responsivo com números, ícones compactos e âncoras;
- cards ilustrados com hierarquia de tópico, título e conteúdo;
- ícones de `lucide-react` associados aos IDs canônicos;
- ícone genérico quando uma seção gerenciada utiliza ID não mapeado;
- superfícies e estados de foco derivados dos tokens semânticos;
- uma coluna no mobile e índice em duas colunas no tablet quando houver espaço.

## PWA

Existe manifest. A documentação específica está em `14-pwa-instalacao-e-compartilhamento.md`.

## Assets

Recomendações:

- fundos: 1600 × 1000 ou maior;
- Apple Touch: PNG 180 × 180;
- Open Graph: 1200 × 630;
- logos com área segura e transparência adequada.
