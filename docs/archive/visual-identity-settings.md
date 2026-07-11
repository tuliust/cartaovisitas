# Identidade visual institucional

O sistema oferece seis variações controladas para o cartão público. O colaborador e o administrador escolhem uma opção; não existe upload de fundo pelo colaborador.

- **Preto institucional**: fundo preto, logo clara e textos brancos.
- **Imagem escura 1 e 2**: fundos institucionais com overlay escuro. Sem imagem configurada, usam o preto institucional.
- **Branco institucional**: fundo branco, logo escura e textos pretos.
- **Imagem clara 1 e 2**: fundos institucionais com overlay claro. Sem imagem configurada, usam o branco institucional.

Use uma logo branca/clara para fundos escuros e uma logo preta/escura para fundos claros. Fundos devem ter preferencialmente 1600 × 1000 px ou mais, sem textos incorporados e com composição adequada para desktop e mobile. São aceitos JPG, PNG e WebP até 5 MB.

## Ícones e compartilhamento

- `favicon.ico`: múltiplos de 16 × 16, 32 × 32 e 48 × 48 px.
- `favicon.svg`: arte vetorial quadrada, preferida quando disponível.
- favicon PNG: quadrado, até 512 KB.
- `apple-touch-icon.png`: PNG de 180 × 180 px, até 1 MB. É separado do favicon e usado ao salvar o site na tela inicial do iPhone/iPad.
- imagem Open Graph: 1200 × 630 px.

O provider atualiza dinamicamente `rel="icon"`. Ele somente cria `rel="apple-touch-icon"` quando `apple_touch_icon_url` está configurado, evitando referência a asset inexistente.
