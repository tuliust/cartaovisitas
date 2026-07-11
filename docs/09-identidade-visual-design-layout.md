# 09 — Identidade visual, design e layout

## Princípio

O sistema usa identidade institucional controlada. O colaborador não pode fazer upload de fundo próprio nem criar temas livres.

## Branding global

Configurável em `/admin/configuracoes`:

- logo para fundo escuro;
- logo para fundo claro;
- favicon;
- Apple Touch Icon;
- Open Graph image;
- cor primária;
- cor secundária;
- cor de fundo;
- cor de superfície;
- cor de texto;
- background global.

## Seis variantes do cartão público

A Home oferece uma paleta visual circular, inspirada em um diafragma de seis segmentos, com acesso direto às seis variantes institucionais. Cada setor representa um fundo e usa a imagem real configurada quando disponível. A escolha do visitante é persistida no navegador pela chave `invest-rs-public-visual-mode` e acompanha a navegação por Home, autenticação, área administrativa, área do colaborador e cartão público. Essa preferência é somente local e não altera dados no banco.

### Modo escuro

| Código | Nome | Logo | Texto |
|---|---|---|---|
| `dark_black` | Preto institucional | clara/branca | branco |
| `dark_image_1` | Imagem escura 1 | clara/branca | branco |
| `dark_image_2` | Imagem escura 2 | clara/branca | branco |

### Modo claro

| Código | Nome | Logo | Texto |
|---|---|---|---|
| `light_white` | Branco institucional | escura/preta | preto |
| `light_image_3` | Imagem clara 1 | escura/preta | preto |
| `light_image_4` | Imagem clara 2 | escura/preta | preto |

## Fallback

- `dark_image_1` e `dark_image_2` sem imagem configurada usam `dark_black`.
- `light_image_3` e `light_image_4` sem imagem configurada usam `light_white`.
- Sem preferência local, o cartão público usa seu `public_visual_variant` institucional salvo no banco.
- Com preferência local, o cartão é renderizado no modo escolhido sem sobrescrever `public_visual_variant`.

## Logos

- `logo_on_dark_url`: logo branca/clara para fundos escuros.
- `logo_on_light_url`: logo preta/escura para fundos claros.
- `logo_url`: fallback técnico/legado, sem edição em `/admin/configuracoes`.

## Fundos institucionais

Recomendação:

- 1600 × 1000 px ou maior;
- sem textos incorporados;
- composição segura para desktop e mobile;
- JPG, PNG ou WebP até 5 MB.

## Favicon

- `favicon.svg`: preferencial, vetorial e quadrado.
- `favicon.ico`: fallback com 16×16, 32×32 e 48×48.
- PNG quadrado é aceito, até 512 KB.

## Apple Touch Icon

Usado quando o site é salvo na tela inicial do iPhone/iPad.

- PNG;
- 180×180 px;
- até 1 MB;
- configurado separadamente de favicon.

## Open Graph

Imagem recomendada:

- 1200×630 px.

Limitação: como o app é SPA, as metatags lidas por crawlers são genéricas. Metatags dinâmicas por cartão exigiriam SSR, prerender ou função dedicada.

## Classes relevantes

- `.app-shell`
- `.digital-card`
- `.card-visual`
- `.action-panel`
- `.public-card-theme-dark`
- `.public-card-theme-light`
- `.public-card-variant-dark-black`
- `.public-card-variant-dark-image-1`
- `.public-card-variant-dark-image-2`
- `.public-card-variant-light-white`
- `.public-card-variant-light-image-3`
- `.public-card-variant-light-image-4`
