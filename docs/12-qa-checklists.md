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
- Guia e Termos;
- logos corretos;
- seis variantes;
- persistência após reload;
- seletor mobile abaixo do card;
- links de apoio no rodapé mobile;
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
- avatar;
- slug;
- seis variantes;
- três colunas por grupo no mobile;
- nomes visíveis das variantes removidos;
- acessibilidade preservada;
- idioma;
- toggle sem espaço excedente;
- e-mail e sufixo na mesma linha;
- salvar;
- preview lateral no desktop;
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
- ações;
- barra inicial mobile;
- scroll suave para área inferior;
- compartilhar somente quando suportado;
- instalação PWA;
- Wallet standby;
- sem acesso a slug arbitrário;
- Termos não aparece nessa rota.

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
- QR abaixo do logo;
- WhatsApp;
- `mailto:`;
- site;
- aviso LGPD;
- HTML;
- texto simples;
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

### Pendência conhecida

A superfície sólida do modal ainda não está aprovada.

Depois da correção:

- validar fundo sólido nas seis variantes;
- validar que `card_surface_opacity` não afeta o painel;
- validar abas, passos, botões e textos;
- validar mobile e desktop.

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
