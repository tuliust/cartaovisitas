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
- links Guia e Termos;
- seletor visual;
- logos corretos;
- seis variantes;
- persistência após reload;
- mobile e desktop.

## Cadastro

- e-mail institucional;
- senha e confirmação;
- aceite obrigatório;
- modal de Termos;
- fallback de conteúdo;
- foco no erro;
- checkbox alinhado;
- criação válida.

## Login e recuperação

- login ativo;
- bloqueado negado;
- e-mail inválido;
- reset com rate limit;
- e-mail inexistente sem enumeração indevida;
- redirect para definição de senha.

## Área do colaborador

- sessão;
- logout;
- cartão próprio;
- slug divergente redireciona;
- header;
- menu Mais;
- seletor compacto;
- mobile.

## Edição

- dados institucionais bloqueados quando previsto;
- avatar;
- slug;
- seis variantes;
- idioma;
- e-mail;
- salvar;
- preview;
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
- compartilhar somente quando suportado;
- instalação PWA;
- Wallet standby;
- sem acesso a slug arbitrário.

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

- períodos;
- personalizado;
- contagens;
- gráfico;
- comparação;
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
- superfície sólida;
- ausência de service worker deliberada.

## Pós-deploy

Validar as rotas listadas em `03-ambientes-variaveis-deploy.md` e conferir logs da Vercel e Supabase quando aplicável.
