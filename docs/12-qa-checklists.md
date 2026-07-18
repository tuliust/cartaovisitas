# 12 — QA e checklists

## Antes do commit

```powershell
npm.cmd run lint
npm.cmd run qa:theme
npm.cmd run build
git diff --check
git status
git diff --stat
git diff --name-only
```

## Segurança

- nenhum secret staged;
- nenhuma `.env`;
- nenhum certificado;
- nenhuma pasta `.vercel`;
- nenhum `dist`;
- nenhum `node_modules`;
- nenhuma pasta temporária do Supabase.

## Matriz obrigatória dos seis modos

Validar cada rota aplicável em:

```text
dark_black
dark_image_1
dark_image_2
light_white
light_image_3
light_image_4
```

Para cada variante, conferir:

- logo correta para o contraste;
- background, imagem e overlay;
- texto principal, secundário e sutil;
- superfície e borda;
- ícones;
- botão principal;
- botão secundário;
- botão auxiliar;
- inputs, placeholder e autofill;
- foco visível;
- header;
- menus, popovers e modais;
- toasts;
- estados de sucesso, alerta e erro;
- contraste em desktop e mobile.

Exceções deliberadas:

- tipografia institucional permanece Inter/sistema;
- QR Code mantém estrutura de alto contraste;
- sucesso, alerta e erro mantêm cores semânticas fixas;
- assinatura de e-mail mantém Arial/Helvetica e cores próprias.

## Preview administrativo de identidade

Em `/admin/configuracoes`, validar para cada uma das seis variantes:

- coluna direita sticky apenas a partir de `901px`;
- preview limitado à viewport e com rolagem interna;
- botão `Salvar configurações` sempre visível abaixo do preview;
- comportamento normal no mobile, sem sticky e sem rolagem interna própria;
- logo, background, imagem e overlay corretos;
- mini header com superfície, borda, ícones, item ativo e hover;
- card de superfície comum e superfície elevada;
- input vazio com placeholder;
- input preenchido;
- input em foco com focus ring;
- botões principal, secundário e auxiliar em estado normal;
- botões principal, secundário e auxiliar com hover simulado;
- popover com item em hover;
- estados sucesso, alerta, erro e desabilitado;
- destaque dos componentes afetados ao trocar o elemento editado;
- descrições e chips de componentes afetados coerentes com o token selecionado;
- escala administrativa em 75% sem deslocar ou cortar o sticky;
- Chrome e Edge em 1366, 1440 e 1920 px;
- escala do Windows em 100%, 125% e 150%, quando disponível.

## Home

- três CTAs principais;
- seletor visual;
- Guia e Termos acessíveis sem login;
- logos corretos;
- seis variantes;
- persistência após reload;
- seletor mobile abaixo do card;
- links de apoio no rodapé mobile;
- Home integralmente visível em desktop de baixa altura quando houver espaço físico;
- painel, logo, título e espaçamentos compactados sem `zoom` em viewport desktop baixo;
- composição ampla preservada em monitor de altura normal;
- botões principal, secundário e auxiliar coerentes com a variante;
- mobile e desktop.

## Cadastro

- sem subtítulo abaixo do título;
- e-mail institucional;
- input e sufixo na mesma linha;
- senha e confirmação;
- aceite obrigatório;
- checkbox alinhado;
- modal de Termos;
- fallback de conteúdo;
- foco no erro;
- criação válida;
- background, texto, borda, ícones, placeholder e autofill nas seis variantes.

## Login e recuperação

- cards de `/entrar`, `/cadastro`, `/recuperar-senha`, `/definir-senha` e `/admin/login` centralizados enquanto couberem na viewport;
- desktop de baixa altura compactado antes de permitir alinhamento no topo;
- monitor externo de altura normal preservado;
- escala do Windows em 100%, 125% e 150%, quando disponível;
- ausência de rolagem interna no card;
- login ativo;
- bloqueado negado;
- e-mail inválido;
- reset com rate limit;
- e-mail não cadastrado retorna o comportamento atual documentado;
- confirmar que a resposta uniforme ainda é pendência da frente Resend;
- redirect para definição de senha;
- autofill com texto, caret e background legíveis nos seis modos;
- botão de exibição de senha usa a cor configurada de ícone;
- seleção de texto permanece legível.

Após a implementação do Resend:

- e-mail existente e inexistente devem produzir resposta externa uniforme;
- nenhum token deve aparecer em log ou resposta;
- entrega e links devem ser validados.

## Área do colaborador

- sessão;
- logout;
- cartão próprio;
- slug divergente redireciona;
- header;
- menu Mais;
- seletor compacto;
- popover em duas colunas e três linhas;
- sem overflow horizontal;
- ícones e estados ativos coerentes com a variante;
- mobile.

## Edição

- dados institucionais bloqueados quando previsto;
- Empresa, Telefone comercial, Site, Endereço, Cidade, Estado e País com aparência inativa;
- textos auxiliares redundantes dos campos institucionais removidos;
- Link da página gerado pelo primeiro e último nome em cartão novo;
- link existente preservado até edição explícita;
- campo do link editável;
- check verde, X vermelho e carregamento dentro do input;
- status do link anunciado por `aria-live`;
- avatar com thumbnail destacado;
- upload por botão e drag-and-drop;
- Remover, Alterar e Reposicionar/Zoom por ícones;
- ações da foto acessíveis por hover, teclado e touch;
- recrop de foto já salva;
- seis variantes;
- variante salva aplicada imediatamente e como padrão do próximo login;
- escolha global temporária não substitui o padrão salvo;
- três colunas por grupo no mobile;
- nomes visíveis das variantes removidos;
- acessibilidade preservada;
- idioma;
- toggle sem espaço excedente;
- e-mail e sufixo na mesma linha;
- salvar;
- preview e botão Salvar sticky na coluna direita no desktop;
- badge de status ausente no preview do colaborador;
- box de contraste dos contatos em `light_image_4`;
- botão “Ver Preview” no mobile;
- modal usa valores ainda não salvos;
- nenhuma perda de dados.

## Cartão por slug

- logo;
- avatar;
- nome;
- cargo e área localizados;
- contatos;
- endereço;
- QR;
- idioma;
- toggle na coluna direita no desktop;
- barra compacta da coluna esquerda oculta no desktop;
- ações;
- barra inicial mobile;
- scroll suave para área inferior;
- compartilhar somente quando suportado;
- instalação PWA;
- Wallet standby;
- sem acesso a slug arbitrário;
- Termos não aparece nessa rota;
- labels, valores e ícones dos contatos consomem os tokens da variante;
- coluna direita usa os três tipos de botão configurados.

## Guia de Utilização

- `/guia-de-utilizacao` acessível sem sessão;
- `/meu-cartao/guia` redireciona para a rota canônica;
- Home e Minha Página apontam para a rota pública;
- conteúdo publicado de `managed_pages`;
- fallback local;
- 14 tópicos;
- números, ícones e âncoras;
- índice desktop sem rolagem interna;
- botões do índice com dimensões uniformes;
- índice sticky no topo com altura de `100dvh` no desktop;
- cards da coluna direita rolando independentemente do índice sticky;
- seletor nativo de tópicos no mobile;
- foco visível;
- seis variantes;
- ícones, links, superfícies e bordas coerentes com a variante;
- mobile, tablet, desktop e zoom de 200%.

## vCard

- PT, ES e EN;
- UTF-8;
- acentos;
- telefone;
- e-mail;
- endereço;
- cargo;
- departamento;
- abertura no iPhone e Android.

## QR

- `/qr/:slug`;
- registro do evento;
- redirect;
- QR de impressão;
- QR PNG da assinatura;
- leitura física;
- contraste estrutural não afetado pelas variantes.

## Assinatura

- PT, ES e EN;
- QR centralizado abaixo do logo;
- WhatsApp;
- `mailto:`;
- site;
- endereço institucional com link de mapa;
- aviso LGPD;
- HTML;
- texto simples usado apenas como fallback interno do clipboard;
- colagem no Gmail;
- imagens HTTPS;
- aparência institucional fixa independentemente do modo da página.
