-- Atualiza o conteúdo canônico dos Termos e remove subtítulo/aviso de minuta.
-- Migration idempotente: preserva id, created_at e histórico do registro.
update public.managed_pages
set
  route_path = '/termos-de-uso-e-privacidade',
  visibility = 'public',
  is_published = true,
  title = 'Termos de Uso e Privacidade',
  subtitle = null,
  version_label = 'Versão informativa 0.2 - 13 de julho de 2026.',
  content = $terms_and_privacy$
{
  "sections": [
    {
      "id": "termos-de-uso",
      "title": "Termos de Uso",
      "body": "A plataforma de cartões digitais da Invest RS reúne dados profissionais, página do cartão, vCard, QR Code, assinatura de e-mail e estatísticas de utilização. Home, Guia de Utilização e Termos são públicos; edição, área do colaborador e administração dependem de autenticação e permissões válidas."
    },
    {
      "id": "controlador",
      "title": "Controlador",
      "body": "A Invest RS é a instituição responsável pela operação da plataforma e pela governança dos cartões profissionais. Administradores autorizados gerenciam cartões, usuários, configurações visuais, auditoria e conteúdo institucional estruturado."
    },
    {
      "id": "dados-coletados",
      "title": "Dados coletados",
      "body": "Podem ser tratados dados de identidade e contato profissional, cargo, área, empresa, telefone, e-mail, website, endereço, links, imagem de perfil quando autorizada, slug público do cartão e preferências visuais. A plataforma também registra eventos técnicos de interação, como visualizações, vCards, compartilhamentos, QR Code e futura Wallet."
    },
    {
      "id": "finalidades",
      "title": "Finalidades",
      "body": "Os dados são utilizados para autenticar usuários, criar e manter cartões profissionais, gerar vCard, QR Code, QR PNG e assinatura de e-mail, apresentar informações institucionais autorizadas, preservar a segurança da plataforma, produzir estatísticas para o proprietário do cartão e apoiar auditoria administrativa."
    },
    {
      "id": "bases-legais",
      "title": "Bases legais",
      "body": "O tratamento ocorre para viabilizar recursos institucionais relacionados à identificação profissional, comunicação corporativa, segurança, administração da plataforma e cumprimento de obrigações aplicáveis. A definição jurídica final das bases legais deve acompanhar as políticas institucionais vigentes."
    },
    {
      "id": "compartilhamento",
      "title": "Compartilhamento",
      "body": "Dados do cartão podem ser compartilhados quando o usuário gera ou divulga vCards, QR Codes, assinaturas de e-mail ou materiais digitais. Serviços técnicos como Supabase, Vercel e provedores de e-mail podem processar dados estritamente para autenticação, armazenamento, funções server-side, entrega e operação da plataforma."
    },
    {
      "id": "armazenamento-e-retencao",
      "title": "Armazenamento e retenção",
      "body": "Os cartões, perfis, eventos, branding, auditoria e páginas gerenciadas são armazenados no banco Supabase. Avatares e assets institucionais ficam no bucket de Storage da plataforma. Prazos de retenção devem considerar finalidade, segurança, auditoria, obrigações institucionais e eventual desativação ou bloqueio de usuários."
    },
    {
      "id": "cookies-e-localstorage",
      "title": "Cookies e localStorage",
      "body": "A aplicação pode usar armazenamento local para preferências de idioma, identidade visual e cache de branding. Mecanismos de sessão, autenticação e recuperação de senha são gerenciados pelos serviços técnicos utilizados pela plataforma, com separação entre credenciais públicas e segredos server-side."
    },
    {
      "id": "seguranca",
      "title": "Segurança",
      "body": "A plataforma utiliza autenticação, domínio institucional, controle de perfis e status, RLS no banco, validação defensiva, rate limit no fluxo de recuperação de senha, service role apenas no backend, auditoria administrativa e conteúdo gerenciado em JSON estruturado, sem HTML arbitrário ou scripts."
    },
    {
      "id": "direitos-do-titular",
      "title": "Direitos do titular",
      "body": "Usuários podem solicitar revisão, correção ou orientação sobre seus dados profissionais pelos canais institucionais definidos pela Invest RS. Campos sob governança administrativa devem ser ajustados por responsáveis autorizados, preservando rastreabilidade e consistência institucional."
    },
    {
      "id": "responsabilidades-do-usuario",
      "title": "Responsabilidades do usuário",
      "body": "O usuário deve proteger suas credenciais, utilizar e-mail institucional, manter dados profissionais corretos, respeitar direitos de terceiros, não contornar campos bloqueados e comunicar suspeitas de uso indevido, inconsistências cadastrais ou problemas de segurança."
    },
    {
      "id": "disponibilidade-do-servico",
      "title": "Disponibilidade do serviço",
      "body": "A plataforma pode passar por manutenção, evolução, indisponibilidade técnica ou alterações de recursos. Funcionalidades como Apple Wallet e Google Wallet permanecem em standby até a conclusão dos requisitos técnicos, certificados, destino público adequado e validações institucionais."
    },
    {
      "id": "canal-de-contato",
      "title": "Canal de contato",
      "body": "Dúvidas sobre uso do cartão, privacidade, dados profissionais, acesso ou incidentes devem ser encaminhadas aos canais institucionais de suporte e governança da Invest RS. Solicitações administrativas devem ser tratadas por usuários com permissão adequada."
    }
  ]
}
$terms_and_privacy$::jsonb
where page_key = 'terms_and_privacy';
