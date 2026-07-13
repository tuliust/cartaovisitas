-- Torna o Guia de Utilização público e sincroniza seu conteúdo canônico.
-- Migration idempotente: preserva id, created_at e histórico do registro.
update public.managed_pages
set
  route_path = '/guia-de-utilizacao',
  visibility = 'public',
  is_published = true,
  title = 'Guia de Utilização',
  subtitle = 'Aprenda a configurar, divulgar e acompanhar seu cartão digital.',
  content = $usage_guide$
{
  "sections": [
    {
      "id": "visao-geral",
      "title": "Visão geral da plataforma",
      "body": "A plataforma de cartões digitais da Invest RS reúne, em um único ambiente, seus dados profissionais, sua página institucional, o arquivo vCard, o QR Code, a assinatura de e-mail e as estatísticas de utilização. A Home, o Guia e os Termos podem ser consultados sem login; a edição e a gestão do cartão permanecem protegidas pela sua conta institucional.\n\nDepois de entrar, use o menu do colaborador para acessar Minha Página, Editar e as demais ferramentas. A página identificada pelo seu slug é exibida apenas ao proprietário autenticado nesta fase."
    },
    {
      "id": "primeiro-cartao",
      "title": "Criar o primeiro cartão",
      "body": "Acesse Editar e revise os dados que já foram associados ao seu cadastro. Preencha as informações pessoais permitidas, como nome de exibição, cargo, área, telefones, links e endereço, observando os campos institucionais que podem estar bloqueados pela administração.\n\nDefina um slug disponível e salve o formulário. Depois do primeiro salvamento válido, o sistema habilita Minha Página e passa a usar os dados do cartão nos arquivos, no QR Code e nas demais ferramentas."
    },
    {
      "id": "slug",
      "title": "Preencher e validar o slug",
      "body": "O slug é a parte final do endereço da sua página. Prefira uma forma curta e reconhecível do nome, sem espaços, acentos ou caracteres especiais. O sistema normaliza o valor e verifica se ele já está sendo usado por outro cartão.\n\nAguarde a confirmação “Endereço disponível.” antes de salvar. Alterar o slug posteriormente muda os endereços associados ao cartão; portanto, evite alterações depois de distribuir links ou materiais impressos."
    },
    {
      "id": "editar",
      "title": "Editar dados",
      "body": "Na página Editar, atualize os campos profissionais disponibilizados para o colaborador. Os cargos e departamentos podem ter versões em português, espanhol e inglês, usadas conforme o idioma selecionado na página e no vCard.\n\nRevise telefones, e-mail, site, endereço e nome de exibição antes de salvar. Campos institucionais bloqueados continuam sob governança administrativa e não devem ser contornados."
    },
    {
      "id": "foto",
      "title": "Adicionar foto",
      "body": "Selecione uma imagem atual, nítida e adequada ao uso profissional. O editor permite ajustar o recorte antes do envio para o Storage. Prefira enquadramento frontal, fundo simples e espaço suficiente ao redor do rosto.\n\nUse o controle de visibilidade para decidir se a foto será mostrada no cartão. A imagem pode permanecer armazenada para edição mesmo quando a exibição pública estiver desativada."
    },
    {
      "id": "visual",
      "title": "Escolher visual",
      "body": "O sistema oferece seis variantes institucionais: três escuras e três claras. O seletor visual do header altera a preferência da interface e a mantém no navegador por localStorage.\n\nNo formulário de edição, a escolha da variante do cartão é uma configuração própria e precisa ser salva. A preferência global de navegação não altera silenciosamente o visual registrado no cartão."
    },
    {
      "id": "minha-pagina",
      "title": "Abrir Minha Página",
      "body": "Depois de salvar um cartão válido, use Minha Página no header para abrir a interface do proprietário. O sistema carrega somente o cartão vinculado à sessão e confirma que o slug da URL corresponde ao cartão autenticado.\n\nNesta fase, essa interface não funciona como catálogo público de colaboradores. Para compartilhar os dados com terceiros, utilize o vCard, o QR Code e as ferramentas de assinatura."
    },
    {
      "id": "compartilhar",
      "title": "Compartilhar vCard",
      "body": "Em Minha Página, escolha Compartilhar contato. Quando o navegador suporta compartilhamento de arquivos, o sistema prepara o vCard no idioma selecionado e abre a folha nativa do dispositivo.\n\nSe o compartilhamento de arquivos não estiver disponível, o navegador usa o download como alternativa. O arquivo .vcf pode ser enviado por aplicativos de mensagem, e-mail ou outras ferramentas compatíveis."
    },
    {
      "id": "copiar",
      "title": "Copiar vCard",
      "body": "A ação Copiar vCard copia o endereço técnico do arquivo de contato. Use esse link quando precisar inserir o vCard em uma mensagem, documento, botão ou material digital sem anexar manualmente o arquivo.\n\nO endereço pode incluir o idioma desejado. Antes de divulgar, abra o link e confira nome, cargo, telefones, e-mail e demais informações."
    },
    {
      "id": "qr",
      "title": "Baixar e utilizar o QR Code",
      "body": "Use Baixar QR-Code para gerar a imagem vinculada ao fluxo rastreável do cartão. Quando escaneado, o QR registra a interação autorizada e redireciona para o vCard, que pode ser aberto por terceiros sem login.\n\nAntes de imprimir, teste o código em mais de um celular. Preserve margem branca, contraste e tamanho suficiente; evite deformar, recortar ou aplicar filtros sobre a imagem."
    },
    {
      "id": "wallet",
      "title": "Wallet",
      "body": "Apple Wallet e Google Wallet permanecem em standby. A base técnica existe, mas a emissão real não deve ser ativada enquanto o destino público do passe e os requisitos de certificados e contas não estiverem concluídos.\n\nEnquanto a função pública estiver desabilitada, Adicionar à Wallet apresenta um aviso institucional e não inicia a emissão do passe."
    },
    {
      "id": "gmail",
      "title": "Gerar assinatura para e-mail",
      "body": "Acesse Gerar Rodapé para E-mail, escolha o idioma e os campos que devem aparecer e revise a prévia. A assinatura pode incluir logo, dados profissionais, links, QR Code e o aviso opcional de confidencialidade e LGPD.\n\nCopie o HTML e cole no editor de assinatura do Gmail ou de outro cliente compatível. Envie uma mensagem de teste para conferir espaçamento, links e carregamento das imagens por HTTPS."
    },
    {
      "id": "estatisticas",
      "title": "Consultar estatísticas",
      "body": "A página de Estatísticas de Compartilhamento apresenta períodos de 7, 30 e 90 dias, além de intervalo personalizado. Os indicadores incluem visualizações, vCards, compartilhamentos, QR Code e outras interações disponíveis.\n\nUse a comparação e o resumo textual para acompanhar a evolução da utilização. Os números representam eventos registrados pelo sistema e não identificam necessariamente a pessoa que recebeu ou salvou o contato."
    },
    {
      "id": "faq",
      "title": "Dúvidas frequentes",
      "body": "Se Minha Página não estiver disponível, confirme que o formulário foi salvo e que o slug foi validado. Se uma alteração não aparecer, atualize a página e verifique se o salvamento terminou com sucesso.\n\nO QR Code continua ligado ao fluxo do cartão enquanto o slug não for alterado. Cada colaborador autenticado acessa somente o próprio cartão. Em caso de inconsistência institucional, procure a equipe responsável antes de criar dados alternativos."
    }
  ]
}
$usage_guide$::jsonb
where page_key = 'usage_guide';
