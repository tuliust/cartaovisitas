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

## Importação CSV

- baixar modelo;
- importar válido;
- importar com e-mail inválido;
- importar com slug duplicado;
- importar com booleano inválido;
- prévia mostra erros;
- modos de importação funcionam;
- auditoria registra.

## Branding

- upload de logo principal;
- upload logo fundo escuro;
- upload logo fundo claro;
- upload fundos;
- upload favicon;
- upload Apple Touch;
- preview das seis variantes;
- persistência após reload.

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
