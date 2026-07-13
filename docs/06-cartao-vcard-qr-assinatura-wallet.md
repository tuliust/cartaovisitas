# 06 — Cartão, vCard, QR, assinatura e Wallet

## Interface do cartão

A interface React `/:slug` é autenticada e pertence ao proprietário.

Exibe, conforme os dados disponíveis:

- logo;
- avatar autorizado;
- nome;
- cargo;
- área;
- telefone;
- e-mail;
- site;
- endereço;
- QR Code;
- seletor de idioma;
- ações do colaborador.

## Idiomas

Idiomas:

```text
PT
ES
EN
```

Fallback:

```text
idioma selecionado → PT → campo legado
```

A preferência do idioma do cartão pode ser armazenada localmente.

## vCard

Endpoint:

```text
/api/vcard/:slug?lang=pt|es|en
```

Características:

- vCard 3.0;
- UTF-8;
- CRLF;
- escaping de caracteres;
- cargo e departamento localizados;
- headers de download compatíveis.

Campos podem incluir:

```text
FN
N
ORG
TITLE
ROLE
TEL
EMAIL
URL
ADR
X-SOCIALPROFILE
```

## QR com tracking

Fluxo:

```text
/qr/:slug?lang=pt
→ registra event_type=qr
→ redireciona para /api/vcard/:slug?lang=pt
```

QRs de impressão devem usar a rota de tracking.

## QR PNG para assinatura

Endpoint:

```text
/api/qr-image/:slug?lang=pt|es|en
```

Gera PNG público com conteúdo apontando ao vCard localizado.

## Compartilhamento do vCard

Na área autenticada:

1. buscar o vCard;
2. criar arquivo `.vcf`;
3. verificar `navigator.canShare({ files })`;
4. abrir o compartilhamento nativo;
5. usar download como fallback.

O sistema operacional define os destinos disponíveis, como WhatsApp, AirDrop ou e-mail.

## Assinatura de e-mail

Rota:

```text
/meu-cartao/assinatura-de-email
```

Recursos:

- PT, ES e EN;
- logo;
- QR abaixo do logo;
- cargo e área localizados;
- WhatsApp, e-mail e site;
- ícones PNG públicos;
- aviso opcional de confidencialidade e LGPD;
- HTML para Gmail;
- texto simples;
- preview;
- `ClipboardItem` com fallback legado.

Não inclui LinkedIn nem a URL `/:slug`.

## Analytics

Eventos conhecidos:

| Evento | Uso |
|---|---|
| `view` | abertura da interface do cartão |
| `vcard` | interação com vCard |
| `share` | compartilhamento |
| `qr` | interação com QR |
| `wallet_apple` | emissão futura |

## Wallet

Apple e Google Wallet permanecem em standby.

Quando a flag pública não está ativa:

- botão permanece disponível conforme a interface;
- modal informa indisponibilidade;
- endpoint Apple não é chamado.

Ativação e certificados estão em `wallet-setup.md`.
