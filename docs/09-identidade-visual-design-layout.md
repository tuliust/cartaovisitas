# 09 — Identidade visual, design e layout

## Princípio

A identidade visual é institucional e controlada.

O colaborador não cria temas livres nem envia backgrounds próprios.

As seis variantes constituem a fonte de verdade para cores, opacidades, superfícies, bordas, ícones e botões. Componentes não devem criar paletas paralelas quando existir um token semântico equivalente.

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

Cada variante possui tokens próprios de:

- background e overlay;
- superfície;
- texto;
- borda;
- ícone;
- botão principal;
- botão secundário;
- botão auxiliar;
- opacidades correspondentes.

## Seleção global

O seletor visual:

- aparece na Home e em headers aplicáveis;
- usa miniaturas reais;
- persiste a preferência de navegação em `localStorage`;
- acompanha a navegação;
- não altera o cartão salvo no banco;
- pode alterar temporariamente a interface durante uma sessão autenticada.

Chave:

```text
invest-rs-public-visual-mode
```

## Seleção no formulário

O seletor do formulário altera somente:

```text
public_visual_variant
```

Para o colaborador:

- a variante salva se torna o padrão visual após cada novo login;
- salvar o formulário aplica imediatamente a variante na interface atual;
- escolhas posteriores no seletor global continuam temporárias durante o acesso;
- o próximo login reaplica o padrão salvo no cartão;
- não há criação de tema livre nem alteração do branding global.

No preview de `/meu-cartao/editar`, a variante `light_image_4` usa uma superfície branca semitransparente específica atrás dos contatos. A superfície utiliza background com canal alpha e não aplica `opacity` ao container ou ao texto.

## Painel administrativo de identidade

Rota:

```text
/admin/configuracoes
```

O editor de identidade visual:

- mantém configuração independente para cada uma das seis variantes;
- atualiza a prévia da coluna direita antes do salvamento;
- preserva alterações locais ao alternar entre variantes;
- salva todas as variantes em uma única operação;
- atualiza o `BrandSettingsContext` da aba atual;
- sincroniza outras abas abertas pelo evento `storage`;
- registra auditoria dos campos alterados.

A prévia demonstra, para a variante ativa:

- logo correspondente ao contraste;
- background, imagem e overlay;
- superfície e borda;
- texto principal e secundário;
- ícone Lucide real;
- input;
- botão principal;
- botão secundário;
- botão auxiliar;
- estados semânticos de sucesso e alerta.

Os modos com imagem sem asset configurado usam automaticamente o modo sólido da mesma família visual, preservando os tokens específicos de cor, superfície e botões.

## Tokens semânticos

A aplicação deriva tokens para:

- texto;
- texto secundário;
- texto sutil;
- superfícies translúcidas, sólidas e elevadas;
- bordas;
- ícones;
- inputs e placeholders;
- header;
- botões principal, secundário e auxiliar;
- foco;
- modal e backdrop;
- sucesso, alerta e erro.

Os tokens são gerados em:

```text
src/lib/cardVisualVariants.ts
```

E aplicados globalmente em:

```text
src/contexts/VisualModeProvider.tsx
```

Arquivos de cobertura final:

```text
src/brand-token-contract.css
src/brand-token-specificity.css
src/brand-token-coverage.css
src/brand-token-auth.css
```

Esses arquivos são carregados depois dos estilos históricos para garantir que os tokens das variantes prevaleçam sem alterar a estrutura dos componentes.

## Cobertura esperada

Os tokens devem alcançar:

- Home;
- login, cadastro e recuperação de senha;
- cartão público e preview de edição;
- header do colaborador e header administrativo;
- menus, popovers e modais;
- inputs, selects, textareas e autofill;
- ações principais e funcionalidades adicionais;
- Guia, Termos, Estatísticas e páginas administrativas;
- tabelas, filtros, paginação e estados vazios;
- toasts e feedbacks.

## Escopo institucional fixo

Os itens abaixo não variam entre os seis modos:

- família tipográfica principal: Inter, com fallbacks do sistema;
- escala tipográfica e pesos;
- estrutura e legibilidade do QR Code;
- cores semânticas de sucesso, alerta e erro;
- assinatura de e-mail.

A assinatura usa Arial/Helvetica, fundo branco e cores próprias por compatibilidade com Gmail e outros clientes de e-mail. Ela não deve herdar a variante visual da página.

## Home e autenticação

- desktops com baixa altura usam uma composição compacta sem aplicar `zoom` ou `transform: scale()`;
- a Home reduz painel, logo, título e espaçamentos somente quando a altura útil é limitada;
- monitores com altura normal preservam a composição ampla;
- cards compartilhados de autenticação permanecem centralizados enquanto couberem na viewport;
- alinhamento no topo é reservado para mobile baixo ou alturas desktop críticas em que o conteúdo não cabe;
- áreas clicáveis preservam dimensão mínima e os cards usam a rolagem da página como proteção;
- campos, autofill, ícones, bordas e foco consomem os tokens da variante ativa.

## Formulário do colaborador

- “Link da página” substitui a nomenclatura técnica “slug” na interface;
- cartões novos sugerem o link com o primeiro e o último nome;
- links já salvos não são sobrescritos automaticamente;
- check verde e X vermelho apresentam o resultado visual da disponibilidade;
- campos institucionais bloqueados usam estado inativo de alto contraste;
- prefixos de redes sociais e o sufixo de e-mail mantêm contraste conforme os tokens;
- o editor de foto usa thumbnail, ações compactas, drag-and-drop e crop;
- o preview e o salvamento formam um painel lateral sticky no desktop.

## Transparência

- não usar `opacity` em containers com texto;
- usar `rgba()` ou `color-mix()` no background;
- superfícies administrativas de configuração permanecem opacas;
- modais devem usar superfície sólida;
- `surface_opacity` afeta somente superfícies previstas;
- `background_opacity` afeta somente o overlay do background.

O modal PWA usa uma superfície elevada sólida e um backdrop semântico nas seis variantes, sem herdar a opacidade da superfície do cartão.

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
- no desktop, índice lateral sticky, com altura de `100dvh`, sem rolagem interna e com botões de dimensões uniformes;
- no desktop, os cards permanecem no fluxo e deslizam ao lado do índice fixado no topo;
- uma coluna no mobile e índice em duas colunas no tablet quando houver espaço.

## Auditoria estática do contrato visual

Comando:

```powershell
npm.cmd run qa:theme
```

A auditoria verifica:

- cadastro das seis variantes;
- presença dos tokens semânticos obrigatórios;
- carregamento dos arquivos de contrato;
- aplicação global e aliases legados;
- sincronização entre abas;
- composição mínima da prévia administrativa;
- cobertura de autenticação e autofill;
- ausência de `@ts-nocheck` em `src`.

A auditoria estática complementa, mas não substitui, a validação visual manual das seis variantes.

## PWA

Existe manifest. A documentação específica está em `14-pwa-instalacao-e-compartilhamento.md`.

## Assets

Recomendações:

- fundos: 1600 × 1000 ou maior;
- Apple Touch: PNG 180 × 180;
- Open Graph: 1200 × 630;
- logos com área segura e transparência adequada.
