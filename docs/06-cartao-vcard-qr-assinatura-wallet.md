# 06 — Cartão, vCard, QR, assinatura e Wallet

## Interface do cartão

A interface React `/:slug` é autenticada e pertence ao proprietário.

O parâmetro precisa corresponder ao slug do cartão carregado para a sessão.

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

## Comportamento mobile

Na primeira dobra, a interface prioriza:

- identidade profissional;
- contatos;
- QR Code;
- barra de ações inicial.

A barra mobile contém:

- toggle PT, ES e EN;
- Editar;
- Compartilhar;
- QR Code;
- Wallet;
- seta para a área inferior.

Os botões dessa barra não executam diretamente as ações finais. Eles fazem scroll suave para a segunda área da página, onde ficam as ações completas.

A área inferior não repete o toggle de idioma.

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

A preferência do idioma pode ser armazenada localmente.

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
- QR centralizado abaixo do logo;
- cargo e área localizados;
- WhatsApp, e-mail e site;
- endereço institucional com link para mapa;
- ícones PNG públicos;
- aviso de confidencialidade e LGPD;
- HTML para Gmail;
- texto simples somente como fallback interno do clipboard;
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

## Bloqueador para ativação do Apple Wallet

O passe atual gera:

```text
/:slug
```

como URL e conteúdo do QR Code.

Essa rota exige autenticação e não é adequada como destino público para terceiros.

Antes de ativar o Apple Wallet, definir e implementar um destino apropriado, por exemplo:

- `/qr/:slug`;
- `/api/vcard/:slug`;
- ou futura rota pública formalmente aprovada.

A ativação da Wallet não deve ocorrer antes dessa decisão.

Configuração de certificados e detalhes operacionais estão em `wallet-setup.md`.
