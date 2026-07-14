# 12 — QA e checklists

## Antes do commit

```powershell
npm.cmd run lint
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
- criação válida.

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
- redirect para definição de senha.

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
- Termos não aparece nessa rota.

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
- índice estático e responsivo em tablet e mobile;
- foco visível;
- seis variantes;
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
- leitura física.

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
- imagens HTTPS.

## Estatísticas

- 7, 30, 90 e Personalizado;
- quatro filtros na mesma linha mobile;
- datas personalizadas;
- quatro KPIs principais na mesma linha mobile;
- indicadores secundários abaixo;
- gráfico;
- comparação;
- resumo textual;
- estado vazio;
- responsividade.

## Admin cartões

- busca;
- filtros;
- criação;
- edição;
- ativação;
- exclusão;
- QR;
- vCard;
- CSV;
- auditoria.

## Admin usuários

- convite;
- reenviar;
- promover;
- remover admin;
- bloquear;
- desbloquear;
- proteção do último admin;
- cartão vinculado.

## Auditoria

- filtros;
- busca;
- período;
- 30 itens;
- paginação;
- menu;
- detalhes;
- eventos sem corte;
- mobile.

## Configurações

- assets;
- títulos;
- seis variantes;
- preview;
- tokens;
- salvar com toast;
- cards opacos;
- editor de Termos e Guia;
- publicação;
- restauração;
- auditoria.

## PWA

- manifest válido;
- ícones;
- iOS;
- Android;
- desktop;
- `beforeinstallprompt`;
- `appinstalled`;
- modo standalone;
- app instalado oculta ação;
- modal acessível;
- Escape;
- foco;
- backdrop;
- bloqueio de scroll;
- ausência de service worker deliberada.

### Modal de instalação

- fundo sólido validado nas seis variantes;
- `card_surface_opacity` não afeta o painel;
- backdrop escurece a página;
- abas, passos, ícones, botões e textos mantêm contraste;
- mobile e desktop validados.

## Wallet

Standby:

- botão abre aviso;
- endpoint não é chamado com flag pública desativada.

Antes da ativação:

- corrigir o destino do QR do passe;
- impedir destino para rota autenticada;
- testar `.pkpass` em iPhone;
- validar evento `wallet_apple`.

## Pós-deploy

Validar as rotas listadas em `03-ambientes-variaveis-deploy.md` e conferir logs da Vercel e Supabase quando aplicável.
