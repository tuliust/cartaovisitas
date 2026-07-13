-- Idempotent ASCII-only repair for public.managed_pages UTF-8 text.
-- Does not alter schema, policies, ids, route_path, visibility, publication flags, or created_at.
-- Execute manually in Supabase SQL Editor only after review.

with corrected (page_key, title, subtitle, version_label, content) as (
  values
  (
    'terms_and_privacy'::text,
    U&'Termos de Uso e Privacidade'::text,
    U&'Minuta informativa da plataforma de cart\00F5es digitais.'::text,
    U&'Vers\00E3o preliminar 0.1 \2014 12 de julho de 2026. Pendente de aprova\00E7\00E3o institucional e jur\00EDdica.'::text,
    '{
      "notice": {
        "title": "Minuta em revis\u00e3o",
        "body": "Este documento \u00e9 uma vers\u00e3o inicial e n\u00e3o deve ser interpretado como parecer jur\u00eddico definitivo. Conte\u00fado sujeito \u00e0 valida\u00e7\u00e3o institucional e jur\u00eddica."
      },
      "sections": [
        { "id": "termos-de-uso", "title": "Termos de Uso", "body": "A plataforma oferece recursos para cria\u00e7\u00e3o, manuten\u00e7\u00e3o e compartilhamento de cart\u00f5es profissionais institucionais. O acesso \u00e0 \u00e1rea do colaborador \u00e9 pessoal e depende de credenciais v\u00e1lidas." },
        { "id": "controlador", "title": "Controlador", "body": "A identifica\u00e7\u00e3o formal do controlador e de seus representantes ser\u00e1 confirmada na revis\u00e3o institucional. Conte\u00fado sujeito \u00e0 valida\u00e7\u00e3o institucional e jur\u00eddica." },
        { "id": "dados-coletados", "title": "Dados coletados", "body": "Podem ser tratados dados profissionais informados no cart\u00e3o, identificadores de conta, imagem de perfil e eventos t\u00e9cnicos de intera\u00e7\u00e3o, como visualiza\u00e7\u00f5es, vCards, compartilhamentos e QR Code." },
        { "id": "finalidades", "title": "Finalidades", "body": "Os dados s\u00e3o utilizados para autenticar usu\u00e1rios, apresentar o cart\u00e3o profissional, gerar arquivos solicitados, operar recursos da plataforma, proteger o acesso e produzir estat\u00edsticas para o propriet\u00e1rio." },
        { "id": "bases-legais", "title": "Bases legais", "body": "As bases legais aplic\u00e1veis a cada opera\u00e7\u00e3o ser\u00e3o definidas e documentadas ap\u00f3s an\u00e1lise jur\u00eddica e institucional. Conte\u00fado sujeito \u00e0 valida\u00e7\u00e3o institucional e jur\u00eddica." },
        { "id": "compartilhamento", "title": "Compartilhamento", "body": "Dados do cart\u00e3o podem integrar arquivos vCard, QR Code e Wallet quando o usu\u00e1rio aciona essas funcionalidades. Fornecedores de infraestrutura podem processar dados estritamente para operar o servi\u00e7o. A rela\u00e7\u00e3o definitiva de operadores depende de valida\u00e7\u00e3o institucional." },
        { "id": "armazenamento-e-retencao", "title": "Armazenamento e reten\u00e7\u00e3o", "body": "Os crit\u00e9rios e prazos de reten\u00e7\u00e3o ainda ser\u00e3o formalizados considerando finalidade, obriga\u00e7\u00f5es aplic\u00e1veis e seguran\u00e7a. Conte\u00fado sujeito \u00e0 valida\u00e7\u00e3o institucional e jur\u00eddica." },
        { "id": "cookies-e-localstorage", "title": "Cookies e localStorage", "body": "A aplica\u00e7\u00e3o utiliza armazenamento local para prefer\u00eancias p\u00fablicas de identidade visual e cache de branding. Eventuais cookies de autentica\u00e7\u00e3o ou recursos equivalentes s\u00e3o gerenciados pelos servi\u00e7os t\u00e9cnicos utilizados pela plataforma." },
        { "id": "seguranca", "title": "Seguran\u00e7a", "body": "S\u00e3o aplicadas medidas t\u00e9cnicas como autentica\u00e7\u00e3o, controle de acesso, pol\u00edticas de banco e separa\u00e7\u00e3o entre credenciais p\u00fablicas e server-side. Nenhum mecanismo elimina integralmente os riscos inerentes a servi\u00e7os conectados." },
        { "id": "direitos-do-titular", "title": "Direitos do titular", "body": "Os procedimentos, prazos e canal respons\u00e1vel pelo atendimento dos direitos do titular ser\u00e3o publicados ap\u00f3s valida\u00e7\u00e3o institucional e jur\u00eddica. Conte\u00fado sujeito \u00e0 valida\u00e7\u00e3o institucional e jur\u00eddica." },
        { "id": "responsabilidades-do-usuario", "title": "Responsabilidades do usu\u00e1rio", "body": "O usu\u00e1rio deve proteger suas credenciais, manter informa\u00e7\u00f5es profissionais corretas, respeitar direitos de terceiros e comunicar suspeitas de uso indevido." },
        { "id": "disponibilidade-do-servico", "title": "Disponibilidade do servi\u00e7o", "body": "A plataforma pode passar por manuten\u00e7\u00e3o, evolu\u00e7\u00e3o ou indisponibilidade t\u00e9cnica. Condi\u00e7\u00f5es formais de n\u00edvel de servi\u00e7o n\u00e3o est\u00e3o estabelecidas nesta minuta." },
        { "id": "canal-de-contato", "title": "Canal de contato", "body": "O canal oficial para privacidade e suporte ser\u00e1 inserido ap\u00f3s confirma\u00e7\u00e3o institucional. Conte\u00fado sujeito \u00e0 valida\u00e7\u00e3o institucional e jur\u00eddica." }
      ]
    }'::jsonb
  ),
  (
    'usage_guide'::text,
    U&'Guia de Utiliza\00E7\00E3o'::text,
    U&'Aprenda a configurar, divulgar e acompanhar seu cart\00E3o digital.'::text,
    null::text,
    '{
      "sections": [
        { "id": "visao-geral", "title": "Vis\u00e3o geral da plataforma", "body": "A plataforma re\u00fane seus dados profissionais, arquivo vCard, QR Code, assinatura de e-mail e m\u00e9tricas em uma \u00e1rea autenticada." },
        { "id": "primeiro-cartao", "title": "Criar o primeiro cart\u00e3o", "body": "Acesse Editar, revise os dados institucionais, preencha os campos pessoais e salve. O menu Minha P\u00e1gina ser\u00e1 habilitado ap\u00f3s o primeiro salvamento." },
        { "id": "slug", "title": "Preencher e validar o slug", "body": "O slug identifica o endere\u00e7o da sua p\u00e1gina. Use uma forma curta do nome, sem espa\u00e7os ou acentos. Aguarde a mensagem \u201cEndere\u00e7o dispon\u00edvel.\u201d antes de salvar." },
        { "id": "editar", "title": "Editar dados", "body": "Na p\u00e1gina Editar, atualize nome de exibi\u00e7\u00e3o, cargo, departamento, telefones e links. Os dados institucionais bloqueados s\u00e3o mantidos pela administra\u00e7\u00e3o." },
        { "id": "foto", "title": "Adicionar foto", "body": "Selecione uma imagem no formul\u00e1rio, ajuste o recorte e confirme. Use o controle de visibilidade para decidir se a foto aparece na sua p\u00e1gina." },
        { "id": "visual", "title": "Escolher visual", "body": "Use o bot\u00e3o circular no header para escolher uma das seis variantes. Essa escolha altera apenas sua prefer\u00eancia de interface e n\u00e3o salva silenciosamente um novo visual no cart\u00e3o." },
        { "id": "minha-pagina", "title": "Abrir Minha P\u00e1gina", "body": "Use o item Minha P\u00e1gina para abrir seu cart\u00e3o. Salve seu cart\u00e3o primeiro para habilitar o endere\u00e7o correto." },
        { "id": "compartilhar", "title": "Compartilhar vCard", "body": "Em Minha P\u00e1gina, escolha \u201cCompartilhar contato\u201d. Em navegadores compat\u00edveis, o arquivo vCard ser\u00e1 encaminhado pelo compartilhamento nativo; nos demais, ser\u00e1 baixado." },
        { "id": "copiar", "title": "Copiar vCard", "body": "Abra \u201cMais\u201d no header e selecione \u201cCopiar vCard\u201d para copiar o endere\u00e7o do arquivo de contato." },
        { "id": "qr", "title": "Baixar e utilizar o QR Code", "body": "No menu \u201cMais\u201d, selecione \u201cBaixar QR-Code\u201d. Ao escanear a imagem, o dispositivo abre o arquivo vCard para salvar o contato; o QR n\u00e3o depende de login." },
        { "id": "wallet", "title": "Wallet", "body": "\u201cAdicionar \u00e0 Wallet\u201d usa a integra\u00e7\u00e3o dispon\u00edvel para o dispositivo. Enquanto a fun\u00e7\u00e3o estiver desabilitada, o sistema apresenta o aviso institucional de desenvolvimento." },
        { "id": "gmail", "title": "Gerar assinatura para Gmail", "body": "Acesse Gerar Rodap\u00e9 para E-mail, escolha os campos, copie a assinatura e cole em Gmail \u2192 Configura\u00e7\u00f5es \u2192 Assinatura." },
        { "id": "estatisticas", "title": "Consultar estat\u00edsticas", "body": "A p\u00e1gina de Estat\u00edsticas de Compartilhamento mostra visualiza\u00e7\u00f5es, vCards, compartilhamentos e intera\u00e7\u00f5es com QR Code por per\u00edodo." },
        { "id": "faq", "title": "D\u00favidas frequentes", "body": "Confirme que o formul\u00e1rio foi salvo antes de atualizar a p\u00e1gina. O QR Code continua apontando para o mesmo slug ap\u00f3s edi\u00e7\u00f5es. Cada usu\u00e1rio autenticado acessa somente o pr\u00f3prio cart\u00e3o." }
      ]
    }'::jsonb
  )
)
update public.managed_pages as page
set
  title = corrected.title,
  subtitle = corrected.subtitle,
  version_label = corrected.version_label,
  content = corrected.content
from corrected
where page.page_key = corrected.page_key
  and (
    page.title,
    page.subtitle,
    page.version_label,
    page.content
  ) is distinct from (
    corrected.title,
    corrected.subtitle,
    corrected.version_label,
    corrected.content
  );

-- Read-only verification after manual execution:
-- select id, page_key, title, subtitle, version_label, content
-- from public.managed_pages
-- where page_key in ('terms_and_privacy', 'usage_guide')
-- order by page_key;
