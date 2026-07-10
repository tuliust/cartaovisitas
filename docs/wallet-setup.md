# Configuração de Wallet

## Apple Wallet

O endpoint `GET /api/wallet/apple/:slug` gera um passe `.pkpass` assinado em memória. Certificados e chaves nunca são enviados ao frontend nem gravados no repositório.

### Variáveis de ambiente

Configure somente no backend da Vercel (Production, Preview e Development conforme necessário):

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

Nenhuma variável Apple deve usar o prefixo `VITE_`. O `.p12`, a senha e o certificado WWDR são segredos de backend. Não adicione certificados, arquivos `.env`, `.env.local` ou `.vercel` ao Git.

### Emissão dos certificados

1. Tenha uma conta ativa no Apple Developer Program.
2. Em Certificates, Identifiers & Profiles, crie um Pass Type ID, por exemplo `pass.com.investrs.businesscard`.
3. Gere um certificado para esse Pass Type ID e instale-o no Keychain Access.
4. Exporte o certificado e sua chave privada como `.p12`, protegido por senha.
5. Converta o arquivo completo para base64 e salve o resultado em `APPLE_PASS_CERT_BASE64`.
6. Baixe o certificado Apple Worldwide Developer Relations (WWDR) vigente no portal da Apple.
7. Converta o WWDR para base64 e salve em `APPLE_WWDR_CERT_BASE64`. O endpoint aceita certificado DER ou PEM codificado em base64.
8. Configure as variáveis na Vercel, faça um novo deploy e teste o endpoint em um iPhone.

Exemplos de conversão:

```bash
base64 -i pass-certificate.p12 | tr -d '\n'
base64 -i AppleWWDRCAG4.cer | tr -d '\n'
```

No PowerShell:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes('pass-certificate.p12'))
[Convert]::ToBase64String([IO.File]::ReadAllBytes('AppleWWDRCAG4.cer'))
```

Se `APPLE_WALLET_ENABLED` não for `true` ou alguma credencial estiver ausente, o endpoint retorna HTTP 503 com JSON amigável. Ele nunca retorna conteúdo de certificados ou stack trace.

### Analytics

Após gerar o passe com sucesso, o endpoint tenta inserir `wallet_apple` em `card_scan_events`. Se `event_type` tiver uma constraint ou enum limitado a `view`, `vcard`, `share` e `qr`, inclua `wallet_apple` entre os valores aceitos antes do deploy. Uma falha de analytics não impede o download do passe.

## Google Wallet

Google Wallet está preparado, mas não é emitido nesta fase. O endpoint reservado retorna HTTP 501 e o frontend apresenta uma mensagem de disponibilidade futura.

Variáveis futuras, ainda opcionais:

```text
GOOGLE_WALLET_ENABLED=false
GOOGLE_WALLET_ISSUER_ID=
GOOGLE_WALLET_CLASS_ID=
GOOGLE_WALLET_SERVICE_ACCOUNT_JSON_BASE64=
```

A implementação futura exigirá Google Wallet Issuer Account, projeto Google Cloud, Service Account, Issuer ID, Class ID, JWT assinado e publishing access. A service account também será exclusiva do backend e nunca poderá usar prefixo `VITE_`.

## Limitações desta fase

- Sem Apple PassKit Web Service ou atualizações push.
- Sem sincronização automática quando os dados do cartão mudam.
- Sem revogação remota ou atualização dinâmica do passe emitido.
- Sem Google Wallet real.
- Sem upload de certificados pelo painel administrativo.
- O QR do passe aponta diretamente para a página pública, sem tracking intermediário.

## Verificação

Sem credenciais, confirme HTTP 503 JSON em `/api/wallet/apple/tulius-souza`. Com credenciais válidas, confirme `Content-Type: application/vnd.apple.pkpass`, nome `invest-rs-tulius-souza.pkpass`, abertura no iPhone e os dados do cartão. Verifique separadamente que `/api/vcard/tulius-souza` continua retornando `text/vcard`.

## Modo standby

`APPLE_WALLET_ENABLED` controla a emissão no backend. `VITE_WALLET_PUBLIC_ENABLED` controla a exposição da funcionalidade no frontend. Quando a flag pública não é exatamente `true`, o botão continua visível, mas abre somente o aviso “Wallet em breve” e não chama o endpoint Apple.

Para manter a Wallet em standby:

```text
APPLE_WALLET_ENABLED=false
GOOGLE_WALLET_ENABLED=false
VITE_WALLET_PUBLIC_ENABLED=false
```

Para ativar futuramente, aprove o orçamento do Apple Developer Program, crie o Pass Type ID, configure certificados Apple reais na Vercel, defina `APPLE_WALLET_ENABLED=true` e `VITE_WALLET_PUBLIC_ENABLED=true` e faça um novo deploy.
