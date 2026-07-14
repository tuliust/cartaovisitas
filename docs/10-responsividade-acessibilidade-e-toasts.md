# 10 — Responsividade, acessibilidade e toasts

## Breakpoints de QA

Testar, no mínimo:

```text
1440 × 900
1366 × 768
1024 × 768
768 × 1024
430 × 932
390 × 844
375 × 667
360 × 800
320 × 568
zoom 125%
zoom 200%
```

## Regras gerais

- sem rolagem horizontal indevida;
- botões com área clicável suficiente;
- grids adaptáveis;
- labels legíveis;
- logos com `contain`;
- QR legível;
- headers sem corte;
- modais dentro da viewport.

## Navegação e scroll

- mudanças de rota retornam ao topo;
- hashes do Guia são preservados;
- links reais para navegação;
- botões reais para ações;
- ações intermediárias podem usar scroll suave para seções da mesma página.

## Home

### Desktop

- seletor visual no topo do card;
- três CTAs principais;
- links de apoio abaixo do card;
- em desktops de baixa altura, painel, logo, título e espaçamentos são compactados sem alterar o zoom da página;
- Guia e Termos permanecem visíveis na primeira tela quando a altura útil comportar o conteúdo;
- monitores com altura normal preservam a composição ampla.

### Mobile

- card principal com maior altura e respiro;
- logo alinhado visualmente com o conteúdo;
- seletor visual fora do topo do card;
- seletor posicionado acima dos links de apoio;
- Guia e Termos no rodapé da página.

## Autenticação pública

- `/entrar`, `/cadastro`, `/recuperar-senha`, `/definir-senha` e `/admin/login` compartilham o mesmo contrato responsivo;
- cards permanecem centralizados em monitores normais e desktops de baixa altura enquanto couberem na viewport;
- alturas reduzidas compactam logo, paddings, margens e gaps antes de alterar o alinhamento;
- alinhamento no topo é usado apenas em mobile baixo ou desktop de altura crítica;
- não usar `zoom`, `transform: scale()` ou rolagem interna no card.

## Cadastro

- sem subtítulo abaixo de “Cadastro”;
- e-mail e sufixo institucional na mesma linha;
- checkbox alinhado ao texto;
- modal de Termos acessível;
- comportamento consistente em mobile e desktop.

## Área do colaborador

O header compartilhado deve manter:

- logo;
- Home;
- Minha Página;
- Editar;
- Mais;
- seletor visual;
- Sair.

Em mobile:

- gaps e paddings compactos;
- logo reduzido sem perda de legibilidade;
- todos os botões permanecem disponíveis;
- seletor compacto centralizado;
- popover das seis variantes em duas colunas e três linhas;
- sem scroll horizontal.

## Edição do cartão

### Desktop

- formulário e preview lado a lado;
- preview permanente e sticky;
- botão “Salvar alterações” abaixo do preview na coluna direita;
- preview e botão acompanham o scroll como um único painel lateral;
- botão “Ver Preview” oculto.

### Mobile

- formulário em largura total;
- preview permanente removido do fluxo;
- botão “Ver Preview” ao lado de “Salvar alterações”;
- modal de preview usa valores ainda não salvos;
- restauração de foco ao fechar;
- variantes em três colunas por grupo;
- nomes visíveis das variantes removidos;
- acessibilidade preservada por `aria-label`, `title` e `aria-pressed`;
- toggle PT/ES/EN sem espaço excedente;
- input e sufixo de e-mail na mesma linha.

### Formulário e estados

- “Link da página” usa check, X e carregamento dentro do input;
- o texto equivalente permanece disponível por `aria-live`;
- cartões novos geram a sugestão pelo primeiro e pelo último nome;
- cartões existentes preservam o link salvo até edição explícita;
- campos institucionais desabilitados mantêm contraste sem `opacity` no container;
- inputs de LinkedIn e Instagram usam fundo sólido, separado do prefixo;
- prefixos sociais e sufixo de e-mail usam texto branco;
- a badge de status não aparece no preview do colaborador;
- contatos permanecem legíveis no preview de `light_image_4`.

### Foto

- com foto, o thumbnail destacado oferece Remover, Alterar e Reposicionar/Zoom;
- ações aparecem por hover e `focus-within` no desktop;
- ações permanecem acessíveis em touch;
- sem foto, uma área com borda oferece Upload;
- clique, teclado e drag-and-drop são suportados;
- arquivos inválidos preservam a foto atual e geram mensagem de erro;
- reposicionamento usa o modal de crop existente.

## Cartão por slug

### Desktop

- a barra compacta da coluna esquerda permanece oculta;
- o toggle PT, ES e EN aparece à direita de “Ferramentas da minha página”;
- ações completas permanecem na coluna direita.

### Mobile

A primeira dobra deve incluir:

- identidade;
- contatos;
- QR;
- barra inicial de idioma e ações.

A barra inicial:

- contém PT, ES e EN;
- contém Editar, Compartilhar, QR, Wallet e seta;
- permanece visível sem scroll quando a altura disponível permitir;
- leva o usuário à seção inferior por scroll suave;
- não repete o toggle na área inferior.

## Guia de Utilização

- rota pública e header compatível com visitante ou colaborador autenticado;
- índice com âncoras, números e ícones;
- no desktop, índice lateral sticky quando alcança o topo, com altura de `100dvh` e sem rolagem interna;
- os botões do índice desktop possuem dimensões uniformes e permanecem integralmente visíveis;
- os cards da coluna direita permanecem no fluxo normal e deslizam durante a rolagem da página;
- em tablet e mobile, o índice volta ao fluxo normal, em duas ou uma coluna conforme o espaço;
- cards em uma coluna;
- foco visível em todos os links;
- ícones decorativos com `aria-hidden`;
- sem rolagem horizontal em 320 px;
- conteúdo legível nas seis variantes e em zoom de 200%.

## Estatísticas

Em mobile:

- 7 dias, 30 dias, 90 dias e Personalizado na mesma linha;
- quatro KPIs principais em uma linha;
- títulos podem ocupar até duas linhas;
- indicadores secundários ficam abaixo;
- gráfico preserva descrição e resumo textual.

## Formulários

- labels visíveis;
- loading;
- erros amigáveis;
- autocomplete apropriado;
- prefixos e sufixos sem quebra indevida;
- foco direcionado ao campo inválido;
- checkbox e texto alinhados.

## Modais

Requisitos:

- `role="dialog"`;
- `aria-modal="true"`;
- título associado;
- Escape;
- backdrop;
- foco inicial;
- foco preso;
- restauração de foco;
- scroll do body bloqueado;
- superfície sólida;
- contraste nas seis variantes;
- `prefers-reduced-motion`.

Usos atuais incluem:

- Termos no cadastro;
- Wallet;
- instalação PWA;
- importação;
- convite;
- auditoria;
- crop;
- exclusão;
- preview do cartão.

## Modal PWA

O modal de instalação mantém:

- backdrop escurecido por token semântico;
- painel interno com superfície elevada sólida;
- independência de `card_surface_opacity`;
- contraste de textos, abas, passos, ícones e botões;
- foco preso, Escape, restauração de foco e bloqueio de scroll;
- comportamento consistente nas seis variantes.

## Menus e popovers

- fechamento por Escape;
- clique externo;
- scroll;
- resize;
- restauração de foco;
- prevenção de saída da viewport.

## Toasts

Tipos:

- sucesso;
- erro;
- informação.

Características:

- um toast visível por vez;
- posição fixa no canto inferior direito;
- expiração;
- fechamento manual;
- `aria-live`;
- compatibilidade mobile e desktop.
- linha lateral verde para sucesso e erro;
- linha lateral amarela para informações de atenção.

Não exibir simultaneamente toast e box inline com a mesma confirmação.

## Estado de revisão visual

Pequenas correções desktop e mobile continuam em andamento. Depois da estabilização, comparar este documento novamente com `src/index.css` e as páginas afetadas.
