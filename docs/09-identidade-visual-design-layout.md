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

A Home e o cartão público oferecem um botão compacto de visual que abre um popover com seis miniaturas institucionais em grade. Cada opção representa um fundo e usa a imagem real configurada quando disponível. A escolha do visitante é persistida no navegador pela chave `invest-rs-public-visual-mode` e acompanha a navegação por Home, autenticação, área administrativa, área do colaborador e cartão público. Essa preferência é somente local e não altera dados no banco. O cabeçalho da área do colaborador usa o logo institucional adequado ao contraste atual.

Os shells de autenticação e das áreas restritas permanecem transparentes para que a variante global aplicada ao `body` não seja escondida por backgrounds locais.

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
- `light_image_4` usa no cartão público uma superfície quase branca sobre a textura institucional, preservando conteúdo escuro e totalmente opaco.

## Logos

- `logo_on_dark_url`: logo branca/clara para fundos escuros.
- `logo_on_light_url`: logo preta/escura para fundos claros.
- `logo_url`: fallback técnico/legado, sem edição em `/admin/configuracoes`.

## Configuração por variante e metadados

As seis variantes têm tokens próprios para cores, opacidade da camada de fundo e
opacidade das superfícies. Variantes claras compõem overlay branco e variantes
escuras compõem overlay preto. A mesma função gera o estilo da aplicação, cartão,
seletor e previews administrativos.

`browser_title` controla um único `document.title` para todas as rotas.
`apple_touch_title` controla `apple-mobile-web-app-title`, independentemente do
Apple Touch Icon e do Apple Wallet. Não há manifesto neste projeto; atalhos iOS
existentes precisam ser removidos e adicionados novamente para refletir o nome.

O branding público é mantido em cache local versionado. Sem cache, a aplicação
preserva o espaço da marca e só renderiza as rotas após a consulta; o fallback
institucional só é usado depois de falha confirmada.

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
