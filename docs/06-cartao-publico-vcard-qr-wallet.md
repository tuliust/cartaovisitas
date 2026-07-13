# 06 — Cartão público, vCard, QR e Wallet

## Interface do proprietário e endpoints técnicos

A interface React `/:slug` exige autenticação e correspondência com o cartão do
proprietário. O QR continua contendo `/qr/:slug`; esse endpoint registra a
interação e redireciona para `/api/vcard/:slug`. QR Codes e vCards existentes não
dependem do login da interface. Apple Wallet e sua feature flag não mudaram.

O compartilhamento na área autenticada envia o arquivo vCard pela Web Share API
quando possível e baixa o `.vcf` como fallback.

## Rota da interface

Rota:

```text
/:slug
```

Exemplo:

```text
/tulius-souza
```

A página exibe:

- logo;
- avatar público, se autorizado;
- nome;
- cargo e área localizados;
- telefone;
- e-mail;
- site;
- endereço;
- QR Code;
- ações rápidas;
- outras funcionalidades.

## Idioma

Idiomas disponíveis:

- PT
- ES
- EN

Regra atual:

- o idioma altera apenas o conteúdo profissional do card esquerdo:
  - “Contato institucional”;
  - cargo;
  - área/departamento;
  - labels do bloco de contato.
- a coluna de ações rápidas permanece em português.

Fallback de conteúdo:

```text
idioma selecionado → PT → campo legado
```

## vCard

Endpoint:

```text
/api/vcard/:slug?lang=pt|es|en
```

Características:

- vCard `VERSION:3.0`;
- `CHARSET=UTF-8`;
- CRLF;
- escaping de vírgula, ponto e vírgula, barra invertida e quebras de linha;
- retorno `text/vcard; charset=utf-8`;
- `Buffer.from(content, 'utf8')`;
- cargo e área no idioma selecionado.

Campos principais:

- `FN`
- `N`
- `ORG`
- `TITLE`
- `ROLE`
- `TEL`
- `EMAIL`
- `URL`
- `ADR`
- `X-SOCIALPROFILE`

## QR Code com tracking real

Rota:

```text
/qr/:slug?lang=pt|es|en
```

Fluxo:

```text
scan QR
→ /qr/:slug?lang=pt
→ registra event_type=qr
→ 302 para /api/vcard/:slug?lang=pt
→ celular abre contato
```

QR Codes baixados no admin devem apontar para `/qr/:slug?lang=pt`.

QR Codes gerados na página pública usam o idioma selecionado.

## Analytics de eventos

Eventos registrados:

| Evento | Origem |
|---|---|
| `view` | abertura da página pública |
| `vcard` | salvar/copiar vCard |
| `share` | compartilhar/copiar link |
| `qr` | scan ou download de QR |
| `wallet_apple` | futuro, emissão Apple Wallet |

## Wallet standby

A integração Apple Wallet está tecnicamente preparada, mas em standby.

Enquanto:

```text
VITE_WALLET_PUBLIC_ENABLED !== "true"
```

o botão “Adicionar à Wallet” permanece visível, mas abre modal informativo e não chama endpoint Apple.

Backend:

```text
APPLE_WALLET_ENABLED=false
```

Frontend:

```text
VITE_WALLET_PUBLIC_ENABLED=false
```

## Apple Wallet futura

Para ativação real:

1. aprovar orçamento Apple Developer Program;
2. criar Pass Type ID;
3. gerar certificado `.p12`;
4. obter WWDR;
5. configurar variáveis privadas na Vercel;
6. ativar flags;
7. redeploy;
8. testar em iPhone.

## Google Wallet futura

O endpoint está reservado. Implementação real exige Issuer Account, Google Cloud, Service Account, Issuer ID, Class ID e JWT assinado.
