-- Reparo idempotente de conteúdo UTF-8 em public.managed_pages.
-- Não altera schema, policies, page_key, route_path, visibility, publicação ou IDs.
-- Revise e execute manualmente no SQL Editor do Supabase.

with corrected (page_key, title, subtitle, version_label, content) as (
  values
  (
    'terms_and_privacy'::text,
    'Termos de Uso e Privacidade'::text,
    'Minuta informativa da plataforma de cartões digitais.'::text,
    'Versão preliminar 0.1 — 12 de julho de 2026. Pendente de aprovação institucional e jurídica.'::text,
    jsonb_build_object(
      'notice', jsonb_build_object(
        'title', 'Minuta em revisão',
        'body', 'Este documento é uma versão inicial e não deve ser interpretado como parecer jurídico definitivo. Conteúdo sujeito à validação institucional e jurídica.'
      ),
      'sections', jsonb_build_array(
        jsonb_build_object('id', 'termos-de-uso', 'title', 'Termos de Uso', 'body', 'A plataforma oferece recursos para criação, manutenção e compartilhamento de cartões profissionais institucionais. O acesso à área do colaborador é pessoal e depende de credenciais válidas.'),
        jsonb_build_object('id', 'controlador', 'title', 'Controlador', 'body', 'A identificação formal do controlador e de seus representantes será confirmada na revisão institucional. Conteúdo sujeito à validação institucional e jurídica.'),
        jsonb_build_object('id', 'dados-coletados', 'title', 'Dados coletados', 'body', 'Podem ser tratados dados profissionais informados no cartão, identificadores de conta, imagem de perfil e eventos técnicos de interação, como visualizações, vCards, compartilhamentos e QR Code.'),
        jsonb_build_object('id', 'finalidades', 'title', 'Finalidades', 'body', 'Os dados são utilizados para autenticar usuários, apresentar o cartão profissional, gerar arquivos solicitados, operar recursos da plataforma, proteger o acesso e produzir estatísticas para o proprietário.'),
        jsonb_build_object('id', 'bases-legais', 'title', 'Bases legais', 'body', 'As bases legais aplicáveis a cada operação serão definidas e documentadas após análise jurídica e institucional. Conteúdo sujeito à validação institucional e jurídica.'),
        jsonb_build_object('id', 'compartilhamento', 'title', 'Compartilhamento', 'body', 'Dados do cartão podem integrar arquivos vCard, QR Code e Wallet quando o usuário aciona essas funcionalidades. Fornecedores de infraestrutura podem processar dados estritamente para operar o serviço.'),
        jsonb_build_object('id', 'armazenamento-e-retencao', 'title', 'Armazenamento e retenção', 'body', 'Os critérios e prazos de retenção ainda serão formalizados considerando finalidade, obrigações aplicáveis e segurança.'),
        jsonb_build_object('id', 'cookies-e-localstorage', 'title', 'Cookies e localStorage', 'body', 'A aplicação utiliza armazenamento local para preferências públicas de identidade visual e cache de branding.'),
        jsonb_build_object('id', 'seguranca', 'title', 'Segurança', 'body', 'São aplicadas medidas técnicas como autenticação, controle de acesso, políticas de banco e separação entre credenciais públicas e server-side.'),
        jsonb_build_object('id', 'direitos-do-titular', 'title', 'Direitos do titular', 'body', 'Os procedimentos e o canal responsável serão publicados após validação institucional e jurídica.'),
        jsonb_build_object('id', 'responsabilidades-do-usuario', 'title', 'Responsabilidades do usuário', 'body', 'O usuário deve proteger suas credenciais, manter informações profissionais corretas e comunicar suspeitas de uso indevido.'),
        jsonb_build_object('id', 'disponibilidade-do-servico', 'title', 'Disponibilidade do serviço', 'body', 'A plataforma pode passar por manutenção, evolução ou indisponibilidade técnica.'),
        jsonb_build_object('id', 'canal-de-contato', 'title', 'Canal de contato', 'body', 'O canal oficial para privacidade e suporte será inserido após confirmação institucional.')
      )
    )
  ),
  (
    'usage_guide'::text,
    'Guia de Utilização'::text,
    'Aprenda a configurar, divulgar e acompanhar seu cartão digital.'::text,
    null::text,
    jsonb_build_object(
      'sections', jsonb_build_array(
        jsonb_build_object('id', 'visao-geral', 'title', 'Visão geral da plataforma', 'body', 'A plataforma reúne seus dados profissionais, arquivo vCard, QR Code, assinatura de e-mail e métricas em uma área autenticada.'),
        jsonb_build_object('id', 'primeiro-cartao', 'title', 'Criar o primeiro cartão', 'body', 'Acesse Editar, revise os dados institucionais, preencha os campos pessoais e salve.'),
        jsonb_build_object('id', 'slug', 'title', 'Preencher e validar o slug', 'body', 'Use uma forma curta do nome, sem espaços ou acentos, e aguarde a confirmação de disponibilidade.'),
        jsonb_build_object('id', 'editar', 'title', 'Editar dados', 'body', 'Atualize nome de exibição, cargo, departamento, telefones e links na página Editar.'),
        jsonb_build_object('id', 'foto', 'title', 'Adicionar foto', 'body', 'Selecione uma imagem, ajuste o recorte e defina sua visibilidade pública.'),
        jsonb_build_object('id', 'visual', 'title', 'Escolher visual', 'body', 'Escolha uma das seis variantes no seletor visual.'),
        jsonb_build_object('id', 'minha-pagina', 'title', 'Abrir Minha Página', 'body', 'Use o item Minha Página para abrir seu cartão.'),
        jsonb_build_object('id', 'compartilhar', 'title', 'Compartilhar vCard', 'body', 'Use Compartilhar meu cartão para abrir o compartilhamento nativo ou baixar o vCard.'),
        jsonb_build_object('id', 'copiar', 'title', 'Copiar vCard', 'body', 'Abra Mais e selecione Copiar vCard.'),
        jsonb_build_object('id', 'qr', 'title', 'Baixar e utilizar o QR Code', 'body', 'Abra Mais e selecione Baixar QR-Code.'),
        jsonb_build_object('id', 'wallet', 'title', 'Wallet', 'body', 'Adicionar à Wallet usa a integração disponível para o dispositivo.'),
        jsonb_build_object('id', 'gmail', 'title', 'Gerar assinatura para Gmail', 'body', 'Acesse Gerar Rodapé para E-mail e copie a assinatura.'),
        jsonb_build_object('id', 'estatisticas', 'title', 'Consultar estatísticas', 'body', 'Acompanhe visualizações e interações por período.'),
        jsonb_build_object('id', 'faq', 'title', 'Dúvidas frequentes', 'body', 'Salve o formulário antes de atualizar a página. O QR continua apontando para o mesmo slug.')
      )
    )
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

-- Verificação somente leitura após eventual execução:
-- select id, page_key, title, subtitle, version_label, content
-- from public.managed_pages
-- where page_key in ('terms_and_privacy', 'usage_guide')
-- order by page_key;
