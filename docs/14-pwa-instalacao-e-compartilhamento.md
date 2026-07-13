# 14 — PWA, instalação e compartilhamento

## Estado

A aplicação possui manifest e fluxo de instalação.

Não existe service worker nesta fase.

## Manifest

Arquivo:

```text
public/manifest.webmanifest
```

Configuração principal:

```text
name: Cartões Digitais | Invest RS
short_name: Invest RS
start_url: /
scope: /
display: standalone
```

Ícones:

```text
/icons/app-192.png
/icons/app-512.png
/icons/app-maskable-512.png
```

## Provider

`InstallAppProvider` centraliza:

- `beforeinstallprompt`;
- `appinstalled`;
- plataforma;
- estado instalado;
- instruções selecionadas;
- abertura e fechamento do modal.

O evento de instalação não deve ser persistido no banco ou localStorage.

## Android e Chromium

Quando `beforeinstallprompt` está disponível:

1. abrir modal institucional;
2. usuário escolhe instalar;
3. chamar `prompt()`;
4. aguardar `userChoice`;
5. limpar o evento após uso.

Quando não está disponível, exibir instruções manuais.

## iPhone e iPad

Não existe instalação automática por botão.

Instruções:

1. abrir no Safari;
2. Compartilhar;
3. Adicionar à Tela de Início;
4. ativar modo de app quando disponível;
5. confirmar.

## Desktop

- navegador compatível pode oferecer prompt;
- navegador incompatível recebe orientação;
- não simular instalação.

## App instalado

Detectar:

- `display-mode: standalone`;
- `navigator.standalone` em Apple;
- evento `appinstalled`.

A ação de instalar não deve aparecer dentro do app já instalado.

## Compartilhamento do vCard

O botão aparece somente quando o navegador suporta arquivo no Web Share:

```text
navigator.share
navigator.canShare({ files })
```

A detecção usa um arquivo `.vcf` de teste e não compartilha esse arquivo.

A ação real:

- busca o vCard;
- cria `File`;
- abre folha nativa;
- mantém download como fallback.

## Service worker

Decisão atual: não criar.

Motivos:

- evitar cache de áreas autenticadas;
- evitar offline incompleto;
- evitar cache de vCards e dados sensíveis;
- manifest e fluxo de instalação atendem ao escopo atual.

## Acessibilidade

O modal deve:

- ter superfície sólida;
- usar backdrop;
- prender foco;
- fechar com Escape;
- restaurar foco;
- bloquear scroll;
- respeitar redução de movimento.

## Superfície do modal

O modal de instalação usa:

- `--semantic-surface-raised` no painel interno;
- `--semantic-modal-backdrop` no backdrop;
- tokens semânticos de texto, borda, botões e foco.

A superfície é sólida nas seis variantes e não depende de `card_surface_opacity`, imagem de fundo ou overlay da variante.
