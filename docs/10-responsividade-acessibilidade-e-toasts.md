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
- botões reais para ações.

## Área do colaborador

O header compartilhado deve manter:

- logo;
- Home;
- Minha Página;
- Editar;
- Mais;
- seletor visual;
- Sair.

Em mobile, o layout pode compactar gaps e ícones, mas não deve remover ações.

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
- preview do cartão, quando aplicável.

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

## Gráficos e estatísticas

- descrição acessível;
- resumo tabular quando necessário;
- filtros responsivos;
- KPIs sem corte.

## Estado de revisão visual

Pequenas correções desktop e mobile continuam em andamento. Depois da estabilização, este documento deve ser comparado novamente com `src/index.css` e as páginas afetadas.
