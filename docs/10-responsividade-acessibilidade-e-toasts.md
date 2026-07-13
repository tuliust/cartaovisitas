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
- links de apoio abaixo do card.

### Mobile

- card principal com maior altura e respiro;
- logo alinhado visualmente com o conteúdo;
- seletor visual fora do topo do card;
- seletor posicionado acima dos links de apoio;
- Guia e Termos no rodapé da página.

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
- preview permanente;
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

## Cartão por slug

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

- pilha;
- expiração;
- fechamento manual;
- `aria-live`;
- compatibilidade mobile e desktop.

Não exibir simultaneamente toast e box inline com a mesma confirmação.

## Estado de revisão visual

Pequenas correções desktop e mobile continuam em andamento. Depois da estabilização, comparar este documento novamente com `src/index.css` e as páginas afetadas.
