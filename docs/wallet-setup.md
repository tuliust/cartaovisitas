# Configuração de Wallet

## Estado

Apple e Google Wallet permanecem em standby.

A base técnica do Apple Wallet existe, mas há um bloqueador funcional antes da ativação: o QR e a URL principal do passe apontam atualmente para `/:slug`, rota autenticada do proprietário.

A ativação não deve ocorrer antes da definição de um destino adequado para terceiros.

## Apple Wallet

O endpoint:

```text
GET /api/wallet/apple/:slug
```

gera um passe `.pkpass` assinado em memória.

Certificados e chaves nunca são enviados ao frontend nem gravados no repositório.

## Bloqueador: destino do QR e da URL

O código atual monta:

```text
https://cartaovisitas.vercel.app/:slug
```

como:

- URL do campo “Página”;
- conteúdo do QR Code do passe.

Como `/:slug` exige autenticação, esse destino não é adequado para pessoas que recebem o contato.

Antes da ativação, escolher e implementar uma opção:

```text
/qr/:slug
/api/vcard/:slug
ou uma futura rota pública aprovada
```

Depois da alteração:

- atualizar este documento;
- atualizar o documento 06;
- testar o passe em iPhone;
- validar tracking;
- confirmar que o destino funciona sem sessão.

## Variáveis de ambiente

Configure somente no backend da Vercel:

```text
APPLE_WALLET_ENABLED=true
APPLE_PASS_TYPE_IDENTIFIER=pass.com.investrs.businesscard
APPLE_TEAM_IDENTIFIER=XXXXXXXXXX
APPLE_ORGANIZATION_NAME=Invest RS
APPLE_PASS_CERT_BASE64=
APPLE_PASS_CERT_PASSWORD=
APPLE_WWDR_CERT_BASE64=
PUBLIC_SITE_URL=https://cartaovisitas.vercel.app
```

Nenhuma variável Apple deve usar prefixo `VITE_`.

O `.p12`, a senha e o WWDR são segredos de backend.

Não adicionar certificados, `.env`, `.env.local` ou `.vercel` ao Git.

## Emissão dos certificados

1. Ter conta ativa no Apple Developer Program.
2. Criar um Pass Type ID.
3. Gerar certificado para o Pass Type ID.
4. Instalar no Keychain Access.
5. Exportar certificado e chave privada como `.p12`.
6. Converter o `.p12` para base64.
7. Baixar o certificado WWDR vigente.
8. Converter o WWDR para base64.
9. Configurar as variáveis.
10. Fazer novo deploy.
11. Testar em iPhone.

Exemplos:

```bash
base64 -i pass-certificate.p12 | tr -d '\n'
base64 -i AppleWWDRCAG4.cer | tr -d '\n'
```

PowerShell:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes('pass-certificate.p12'))
[Convert]::ToBase64String([IO.File]::ReadAllBytes('AppleWWDRCAG4.cer'))
```

## Comportamento sem configuração

Se `APPLE_WALLET_ENABLED` não for `true` ou alguma credencial estiver ausente:

- endpoint retorna HTTP 503;
- resposta é JSON amigável;
- certificados e stack trace não são expostos.

## Analytics

Após gerar o passe, o endpoint tenta inserir:

```text
wallet_apple
```

em `card_scan_events`.

Antes da ativação, confirmar que a constraint ou enum aceita esse valor.

Falha de analytics não deve impedir o download do passe.

## Google Wallet

Google Wallet não é emitido nesta fase.

Variáveis futuras:

```text
GOOGLE_WALLET_ENABLED=false
GOOGLE_WALLET_ISSUER_ID=
GOOGLE_WALLET_CLASS_ID=
GOOGLE_WALLET_SERVICE_ACCOUNT_JSON_BASE64=
```

A implementação dependerá de:

- Google Wallet Issuer Account;
- Google Cloud;
- Service Account;
- Issuer ID;
- Class ID;
- JWT assinado;
- publishing access.

## Limitações

- sem PassKit Web Service;
- sem push;
- sem sincronização automática;
- sem revogação remota;
- sem Google Wallet real;
- sem upload de certificados pelo painel;
- destino público do QR ainda pendente.

## Verificação

Sem credenciais:

```text
/api/wallet/apple/tulius-souza
```

deve retornar HTTP 503 com JSON.

Com credenciais válidas e depois de corrigir o destino:

- `Content-Type: application/vnd.apple.pkpass`;
- filename esperado;
- abertura no iPhone;
- dados corretos;
- QR funcional para terceiros;
- analytics;
- vCard preservado.

## Modo standby

```text
APPLE_WALLET_ENABLED=false
GOOGLE_WALLET_ENABLED=false
VITE_WALLET_PUBLIC_ENABLED=false
```

Quando a flag pública não é `true`, o botão abre apenas o aviso de disponibilidade futura e não chama o endpoint Apple.
