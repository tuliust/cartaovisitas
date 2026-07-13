export type ManagedPageKey = 'terms_and_privacy' | 'usage_guide'
export type ManagedPageSection = { id: string; title: string; body: string }
export type ManagedPageContent = { notice?: { title: string; body: string }; sections: ManagedPageSection[] }
export type ManagedPage = { id: string | null; page_key: ManagedPageKey; route_path: string; title: string; subtitle: string; content: ManagedPageContent; visibility: 'public' | 'authenticated'; is_published: boolean; version_label: string; updated_by: string | null; created_at: string | null; updated_at: string | null }

const pending = 'Conteúdo sujeito à validação institucional e jurídica.'

export const managedPageDefaults: Record<ManagedPageKey, ManagedPage> = {
  terms_and_privacy: {
    id: null,
    page_key: 'terms_and_privacy',
    route_path: '/termos-de-uso-e-privacidade',
    title: 'Termos de Uso e Privacidade',
    subtitle: 'Minuta informativa da plataforma de cartões digitais.',
    visibility: 'public',
    is_published: true,
    version_label: 'Versão preliminar 0.1 — 12 de julho de 2026. Pendente de aprovação institucional e jurídica.',
    updated_by: null,
    created_at: null,
    updated_at: null,
    content: {
      notice: {
        title: 'Minuta em revisão',
        body: `Este documento é uma versão inicial e não deve ser interpretado como parecer jurídico definitivo. ${pending}`,
      },
      sections: [
        { id: 'termos-de-uso', title: 'Termos de Uso', body: 'A plataforma oferece recursos para criação, manutenção e compartilhamento de cartões profissionais institucionais. O acesso à área do colaborador é pessoal e depende de credenciais válidas.' },
        { id: 'controlador', title: 'Controlador', body: `A identificação formal do controlador e de seus representantes será confirmada na revisão institucional. ${pending}` },
        { id: 'dados-coletados', title: 'Dados coletados', body: 'Podem ser tratados dados profissionais informados no cartão, identificadores de conta, imagem de perfil e eventos técnicos de interação, como visualizações, vCards, compartilhamentos e QR Code.' },
        { id: 'finalidades', title: 'Finalidades', body: 'Os dados são utilizados para autenticar usuários, apresentar o cartão profissional, gerar arquivos solicitados, operar recursos da plataforma, proteger o acesso e produzir estatísticas para o proprietário.' },
        { id: 'bases-legais', title: 'Bases legais', body: `As bases legais aplicáveis a cada operação serão definidas e documentadas após análise jurídica e institucional. ${pending}` },
        { id: 'compartilhamento', title: 'Compartilhamento', body: 'Dados do cartão podem integrar arquivos vCard, QR Code e Wallet quando o usuário aciona essas funcionalidades. Fornecedores de infraestrutura podem processar dados estritamente para operar o serviço. A relação definitiva de operadores depende de validação institucional.' },
        { id: 'armazenamento-e-retencao', title: 'Armazenamento e retenção', body: `Os critérios e prazos de retenção ainda serão formalizados considerando finalidade, obrigações aplicáveis e segurança. ${pending}` },
        { id: 'cookies-e-localstorage', title: 'Cookies e localStorage', body: 'A aplicação utiliza armazenamento local para preferências públicas de identidade visual e cache de branding. Eventuais cookies de autenticação ou recursos equivalentes são gerenciados pelos serviços técnicos utilizados pela plataforma.' },
        { id: 'seguranca', title: 'Segurança', body: 'São aplicadas medidas técnicas como autenticação, controle de acesso, políticas de banco e separação entre credenciais públicas e server-side. Nenhum mecanismo elimina integralmente os riscos inerentes a serviços conectados.' },
        { id: 'direitos-do-titular', title: 'Direitos do titular', body: `Os procedimentos, prazos e canal responsável pelo atendimento dos direitos do titular serão publicados após validação institucional e jurídica. ${pending}` },
        { id: 'responsabilidades-do-usuario', title: 'Responsabilidades do usuário', body: 'O usuário deve proteger suas credenciais, manter informações profissionais corretas, respeitar direitos de terceiros e comunicar suspeitas de uso indevido.' },
        { id: 'disponibilidade-do-servico', title: 'Disponibilidade do serviço', body: 'A plataforma pode passar por manutenção, evolução ou indisponibilidade técnica. Condições formais de nível de serviço não estão estabelecidas nesta minuta.' },
        { id: 'canal-de-contato', title: 'Canal de contato', body: `O canal oficial para privacidade e suporte será inserido após confirmação institucional. ${pending}` },
      ],
    },
  },
  usage_guide: {
    id: null,
    page_key: 'usage_guide',
    route_path: '/meu-cartao/guia',
    title: 'Guia de Utilização',
    subtitle: 'Aprenda a configurar, divulgar e acompanhar seu cartão digital.',
    visibility: 'authenticated',
    is_published: true,
    version_label: '',
    updated_by: null,
    created_at: null,
    updated_at: null,
    content: {
      sections: [
        { id: 'visao-geral', title: 'Visão geral da plataforma', body: 'A plataforma reúne seus dados profissionais, arquivo vCard, QR Code, assinatura de e-mail e métricas em uma área autenticada.' },
        { id: 'primeiro-cartao', title: 'Criar o primeiro cartão', body: 'Acesse Editar, revise os dados institucionais, preencha os campos pessoais e salve. O menu Minha Página será habilitado após o primeiro salvamento.' },
        { id: 'slug', title: 'Preencher e validar o slug', body: 'O slug identifica o endereço da sua página. Use uma forma curta do nome, sem espaços ou acentos. Aguarde a mensagem “Endereço disponível.” antes de salvar.' },
        { id: 'editar', title: 'Editar dados', body: 'Na página Editar, atualize nome de exibição, cargo, departamento, telefones e links. Os dados institucionais bloqueados são mantidos pela administração.' },
        { id: 'foto', title: 'Adicionar foto', body: 'Selecione uma imagem no formulário, ajuste o recorte e confirme. Use o controle de visibilidade para decidir se a foto aparece na sua página.' },
        { id: 'visual', title: 'Escolher visual', body: 'Use o botão circular no header para escolher uma das seis variantes. Essa escolha altera apenas sua preferência de interface e não salva silenciosamente um novo visual no cartão.' },
        { id: 'minha-pagina', title: 'Abrir Minha Página', body: 'Use o item Minha Página para abrir seu cartão. Salve seu cartão primeiro para habilitar o endereço correto.' },
        { id: 'compartilhar', title: 'Compartilhar vCard', body: 'Em Minha Página, escolha “Compartilhar contato”. Em navegadores compatíveis, o arquivo vCard será encaminhado pelo compartilhamento nativo; nos demais, será baixado.' },
        { id: 'copiar', title: 'Copiar vCard', body: 'Abra “Mais” no header e selecione “Copiar vCard” para copiar o endereço do arquivo de contato.' },
        { id: 'qr', title: 'Baixar e utilizar o QR Code', body: 'No menu “Mais”, selecione “Baixar QR-Code”. Ao escanear a imagem, o dispositivo abre o arquivo vCard para salvar o contato; o QR não depende de login.' },
        { id: 'wallet', title: 'Wallet', body: '“Adicionar à Wallet” usa a integração disponível para o dispositivo. Enquanto a função estiver desabilitada, o sistema apresenta o aviso institucional de desenvolvimento.' },
        { id: 'gmail', title: 'Gerar assinatura para Gmail', body: 'Acesse Gerar Rodapé para E-mail, escolha os campos, copie a assinatura e cole em Gmail → Configurações → Assinatura.' },
        { id: 'estatisticas', title: 'Consultar estatísticas', body: 'A página de Estatísticas de Compartilhamento mostra visualizações, vCards, compartilhamentos e interações com QR Code por período.' },
        { id: 'faq', title: 'Dúvidas frequentes', body: 'Confirme que o formulário foi salvo antes de atualizar a página. O QR Code continua apontando para o mesmo slug após edições. Cada usuário autenticado acessa somente o próprio cartão.' },
      ],
    },
  },
}

export function normalizeSectionId(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
