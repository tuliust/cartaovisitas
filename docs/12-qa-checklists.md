# 12 — QA e checklists

## Checklist antes do deploy

```powershell
npm.cmd run lint
npm.cmd run build
git diff --check
git status
```

Conferir ausência de segredos.

## Checklist pós-deploy

Testar:

```text
/
 /entrar
 /cadastro
 /recuperar-senha
 /definir-senha
 /meu-cartao/editar
 /admin/cartoes
 /admin/usuarios
 /admin/auditoria
 /admin/configuracoes
 /:slug
 /qr/:slug?lang=pt
 /api/vcard/:slug?lang=pt
```

## vCard

- abre no iPhone;
- acentos corretos;
- `lang=pt`;
- `lang=es`;
- `lang=en`;
- cargo correto;
- departamento correto;
- telefone correto;
- e-mail correto;
- endereço correto.

## QR

- QR baixado no admin aponta para `/qr/:slug?lang=pt`;
- `/qr/:slug?lang=pt` registra evento `qr`;
- redirect 302 abre vCard;
- funciona em iPhone;
- funciona em Android.

## Página pública

- card carrega;
- idioma altera apenas conteúdo profissional;
- ações rápidas em português;
- salvar contato;
- copiar vCard;
- compartilhar;
- baixar QR;
- Wallet standby.
- usa a preferência visual local quando existente;
- sem preferência local, usa `public_visual_variant` do cartão;
- variante sem imagem usa o fallback preto ou branco correspondente.

## Admin cartões

- busca;
- filtros;
- ordenação;
- ativar/desativar;
- editar;
- apagar com confirmação;
- baixar QR;
- copiar link;
- copiar vCard;
- importação CSV;
- analytics.
- headers da tabela legíveis nos modos claro e escuro;
- contagem usa corretamente `cartão` ou `cartões`, sem forma parentética;
- textos auxiliares do formulário permanecem legíveis em criação e edição.

## Admin usuários

- listar usuários;
- buscar;
- filtrar;
- promover admin;
- remover admin;
- bloquear;
- desbloquear;
- convidar;
- reenviar convite;
- impedir auto-bloqueio.

## Auditoria

- ação aparece após editar cartão;
- ação aparece após bloquear usuário;
- ação aparece após convite;
- filtros funcionam;
- modal de detalhes abre.
- JSON e botão do modal permanecem legíveis nos modos claro e escuro.

## Importação CSV

- baixar modelo;
- importar válido;
- importar com e-mail inválido;
- importar com slug duplicado;
- importar com booleano inválido;
- prévia mostra erros;
- modos de importação funcionam;
- auditoria registra.
- modal, input de arquivo, preview e ações mantêm contraste nos modos claro e escuro.

## Modais administrativos

- convite de usuário legível nos modos claro e escuro;
- confirmação de apagar mantém título, input e botões legíveis;
- crop de avatar mantém instruções, zoom e ações legíveis;
- modais não aplicam opacidade ao container com conteúdo.

## Branding

- upload logo fundo escuro;
- upload logo fundo claro;
- upload fundos;
- upload favicon;
- upload Apple Touch;
- preview das seis variantes;
- persistência após reload.

## Modo visual global

- botão compacto abre popover com seis miniaturas na Home;
- clique externo e `Escape` fecham o popover;
- clique em uma miniatura seleciona a variante e fecha o popover;
- opção ativa possui destaque e marcador visíveis;
- escolha persiste em `invest-rs-public-visual-mode` após reload;
- `dark_black` acompanha a navegação para `/entrar`;
- `light_white` acompanha a navegação para `/cadastro`;
- preferência local altera apenas a renderização do cartão público;
- limpar a chave restaura o `public_visual_variant` salvo no cartão;
- vCard, QR, idioma e Wallet permanecem inalterados.
- seletor visual aparece à direita do toggle PT/ES/EN no cartão público;
- “Copiar vCard” copia a URL `/api/vcard/:slug?lang=:idioma`;
- área do colaborador exibe o logo institucional no header;
- `/admin/usuarios` mostra nome sobre e-mail e ações compactas com ícones.
- CTA principal da Home mantém texto branco em `light_white`, `light_image_3` e `light_image_4`;
- preferência visual persiste em cadastro, login, recuperação, definição de senha, área do colaborador e cartão público;
- `light_image_4` exibe card público quase branco, com texto, labels e QR legíveis.

## RLS

- visitante vê cartão ativo;
- visitante não vê cartão inativo;
- colaborador edita apenas próprio cartão;
- admin edita todos;
- bloqueado não acessa.

## Wallet

Standby:

- botão visível;
- modal “Wallet em breve”;
- endpoint Apple não chamado.

Futuro:

- testar `.pkpass` em iPhone quando credenciais forem ativadas.
