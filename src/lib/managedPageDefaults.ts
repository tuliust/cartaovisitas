export type ManagedPageKey = 'terms_and_privacy' | 'usage_guide'
export type ManagedPageSection = { id: string; title: string; body: string }
export type ManagedPageContent = { notice?: { title: string; body: string }; sections: ManagedPageSection[] }
export type ManagedPage = { id: string | null; page_key: ManagedPageKey; route_path: string; title: string; subtitle: string; content: ManagedPageContent; visibility: 'public' | 'authenticated'; is_published: boolean; version_label: string; updated_by: string | null; created_at: string | null; updated_at: string | null }

export const managedPageDefaults: Record<ManagedPageKey, ManagedPage> = {
  terms_and_privacy: {
    id: null,
    page_key: 'terms_and_privacy',
    route_path: '/termos-de-uso-e-privacidade',
    title: 'Termos de Uso e Privacidade',
    subtitle: '',
    visibility: 'public',
    is_published: true,
    version_label: 'Versão informativa 0.2 - 13 de julho de 2026.',
    updated_by: null,
    created_at: null,
    updated_at: null,
    content: {
      sections: [
        { id: 'termos-de-uso', title: 'Termos de Uso', body: 'A plataforma de cartões digitais da Invest RS reúne dados profissionais, página do cartão, vCard, QR Code, assinatura de e-mail e estatísticas de utilização. Home, Guia de Utilização e Termos são públicos; edição, área do colaborador e administração dependem de autenticação e permissões válidas.' },
        { id: 'controlador', title: 'Controlador', body: 'A Invest RS é a instituição responsável pela operação da plataforma e pela governança dos cartões profissionais. Administradores autorizados gerenciam cartões, usuários, configurações visuais, auditoria e conteúdo institucional estruturado.' },
        { id: 'dados-coletados', title: 'Dados coletados', body: 'Podem ser tratados dados de identidade e contato profissional, cargo, área, empresa, telefone, e-mail, website, endereço, links, imagem de perfil quando autorizada, slug público do cartão e preferências visuais. A plataforma também registra eventos técnicos de interação, como visualizações, vCards, compartilhamentos, QR Code e futura Wallet.' },
        { id: 'finalidades', title: 'Finalidades', body: 'Os dados são utilizados para autenticar usuários, criar e manter cartões profissionais, gerar vCard, QR Code, QR PNG e assinatura de e-mail, apresentar informações institucionais autorizadas, preservar a segurança da plataforma, produzir estatísticas para o proprietário do cartão e apoiar auditoria administrativa.' },
        { id: 'bases-legais', title: 'Bases legais', body: 'O tratamento ocorre para viabilizar recursos institucionais relacionados à identificação profissional, comunicação corporativa, segurança, administração da plataforma e cumprimento de obrigações aplicáveis. A definição jurídica final das bases legais deve acompanhar as políticas institucionais vigentes.' },
        { id: 'compartilhamento', title: 'Compartilhamento', body: 'Dados do cartão podem ser compartilhados quando o usuário gera ou divulga vCards, QR Codes, assinaturas de e-mail ou materiais digitais. Serviços técnicos como Supabase, Vercel e provedores de e-mail podem processar dados estritamente para autenticação, armazenamento, funções server-side, entrega e operação da plataforma.' },
        { id: 'armazenamento-e-retencao', title: 'Armazenamento e retenção', body: 'Os cartões, perfis, eventos, branding, auditoria e páginas gerenciadas são armazenados no banco Supabase. Avatares e assets institucionais ficam no bucket de Storage da plataforma. Prazos de retenção devem considerar finalidade, segurança, auditoria, obrigações institucionais e eventual desativação ou bloqueio de usuários.' },
        { id: 'cookies-e-localstorage', title: 'Cookies e localStorage', body: 'A aplicação pode usar armazenamento local para preferências de idioma, identidade visual e cache de branding. Mecanismos de sessão, autenticação e recuperação de senha são gerenciados pelos serviços técnicos utilizados pela plataforma, com separação entre credenciais públicas e segredos server-side.' },
        { id: 'seguranca', title: 'Segurança', body: 'A plataforma utiliza autenticação, domínio institucional, controle de perfis e status, RLS no banco, validação defensiva, rate limit no fluxo de recuperação de senha, service role apenas no backend, auditoria administrativa e conteúdo gerenciado em JSON estruturado, sem HTML arbitrário ou scripts.' },
        { id: 'direitos-do-titular', title: 'Direitos do titular', body: 'Usuários podem solicitar revisão, correção ou orientação sobre seus dados profissionais pelos canais institucionais definidos pela Invest RS. Campos sob governança administrativa devem ser ajustados por responsáveis autorizados, preservando rastreabilidade e consistência institucional.' },
        { id: 'responsabilidades-do-usuario', title: 'Responsabilidades do usuário', body: 'O usuário deve proteger suas credenciais, utilizar e-mail institucional, manter dados profissionais corretos, respeitar direitos de terceiros, não contornar campos bloqueados e comunicar suspeitas de uso indevido, inconsistências cadastrais ou problemas de segurança.' },
        { id: 'disponibilidade-do-servico', title: 'Disponibilidade do serviço', body: 'A plataforma pode passar por manutenção, evolução, indisponibilidade técnica ou alterações de recursos. Funcionalidades como Apple Wallet e Google Wallet permanecem em standby até a conclusão dos requisitos técnicos, certificados, destino público adequado e validações institucionais.' },
        { id: 'canal-de-contato', title: 'Canal de contato', body: 'Dúvidas sobre uso do cartão, privacidade, dados profissionais, acesso ou incidentes devem ser encaminhadas aos canais institucionais de suporte e governança da Invest RS. Solicitações administrativas devem ser tratadas por usuários com permissão adequada.' },
      ],
    },
  },
  usage_guide: {
    id: null,
    page_key: 'usage_guide',
    route_path: '/guia-de-utilizacao',
    title: 'Guia de Utilização',
    subtitle: 'Aprenda a configurar, divulgar e acompanhar seu cartão digital.',
    visibility: 'public',
    is_published: true,
    version_label: '',
    updated_by: null,
    created_at: null,
    updated_at: null,
    content: {
      sections: [
        { id: "visao-geral", title: "Visão geral da plataforma", body: "A plataforma de cartões digitais da Invest RS reúne, em um único ambiente, seus dados profissionais, sua página institucional, o arquivo vCard, o QR Code, a assinatura de e-mail e as estatísticas de utilização. A Home, o Guia e os Termos podem ser consultados sem login; a edição e a gestão do cartão permanecem protegidas pela sua conta institucional.\n\nDepois de entrar, use o menu do colaborador para acessar Minha Página, Editar e as demais ferramentas. A página identificada pelo seu slug é exibida apenas ao proprietário autenticado nesta fase." },
        { id: "primeiro-cartao", title: "Criar o primeiro cartão", body: "Acesse Editar e revise os dados que já foram associados ao seu cadastro. Preencha as informações pessoais permitidas, como nome de exibição, cargo, área, telefones e links, observando os campos institucionais que permanecem bloqueados para edição pelo colaborador.\n\nO Link da página é sugerido automaticamente a partir do primeiro e do último nome e continua editável. Depois do primeiro salvamento válido, o sistema habilita Minha Página e passa a usar os dados do cartão nos arquivos, no QR Code e nas demais ferramentas." },
        { id: "slug", title: "Preencher e validar o link", body: "O Link da página corresponde à parte final do endereço do cartão. Em um cartão novo, o sistema cria uma sugestão com o primeiro e o último nome, remove acentos e substitui espaços ou caracteres especiais. O campo permanece editável, mas um link já salvo não é trocado automaticamente.\n\nO ícone de check verde indica disponibilidade; o X vermelho indica conflito ou falha de validação. Alterar o link posteriormente muda os endereços associados ao cartão, portanto evite a mudança depois de distribuir links, QR Codes ou materiais impressos." },
        { id: "editar", title: "Editar dados", body: "Na página Editar, atualize os campos profissionais disponibilizados para o colaborador. Os cargos e departamentos podem ter versões em português, espanhol e inglês, usadas conforme o idioma selecionado na página e no vCard.\n\nRevise telefones, e-mail, site, endereço e nome de exibição antes de salvar. Campos institucionais bloqueados continuam sob governança administrativa e não devem ser contornados." },
        { id: "foto", title: "Adicionar foto", body: "Selecione uma imagem atual, nítida e adequada ao uso profissional. O editor permite ajustar o recorte antes do envio para o Storage. Prefira enquadramento frontal, fundo simples e espaço suficiente ao redor do rosto.\n\nUse o controle de visibilidade para decidir se a foto será mostrada no cartão. A imagem pode permanecer armazenada para edição mesmo quando a exibição pública estiver desativada." },
        { id: "visual", title: "Escolher visual", body: "O sistema oferece seis variantes institucionais: três escuras e três claras. No formulário de edição, a variante salva no cartão se torna o padrão visual das páginas após cada novo login.\n\nDurante o acesso, o seletor visual do header permite experimentar outra variante sem mudar o padrão do cartão. Para tornar a mudança definitiva nos próximos logins, selecione a opção em Editar meu cartão e salve as alterações." },
        { id: "minha-pagina", title: "Abrir Minha Página", body: "Depois de salvar um cartão válido, use Minha Página no header para abrir a interface do proprietário. O sistema carrega somente o cartão vinculado à sessão e confirma que o slug da URL corresponde ao cartão autenticado.\n\nNesta fase, essa interface não funciona como catálogo público de colaboradores. Para compartilhar os dados com terceiros, utilize o vCard, o QR Code e as ferramentas de assinatura." },
        { id: "compartilhar", title: "Compartilhar vCard", body: "Em Minha Página, escolha Compartilhar contato. Quando o navegador suporta compartilhamento de arquivos, o sistema prepara o vCard no idioma selecionado e abre a folha nativa do dispositivo.\n\nSe o compartilhamento de arquivos não estiver disponível, o navegador usa o download como alternativa. O arquivo .vcf pode ser enviado por aplicativos de mensagem, e-mail ou outras ferramentas compatíveis." },
        { id: "copiar", title: "Copiar vCard", body: "A ação Copiar vCard copia o endereço técnico do arquivo de contato. Use esse link quando precisar inserir o vCard em uma mensagem, documento, botão ou material digital sem anexar manualmente o arquivo.\n\nO endereço pode incluir o idioma desejado. Antes de divulgar, abra o link e confira nome, cargo, telefones, e-mail e demais informações." },
        { id: "qr", title: "Baixar e utilizar o QR Code", body: "Use Baixar QR-Code para gerar a imagem vinculada ao fluxo rastreável do cartão. Quando escaneado, o QR registra a interação autorizada e redireciona para o vCard, que pode ser aberto por terceiros sem login.\n\nAntes de imprimir, teste o código em mais de um celular. Preserve margem branca, contraste e tamanho suficiente; evite deformar, recortar ou aplicar filtros sobre a imagem." },
        { id: "wallet", title: "Wallet", body: "Apple Wallet e Google Wallet permanecem em standby. A base técnica existe, mas a emissão real não deve ser ativada enquanto o destino público do passe e os requisitos de certificados e contas não estiverem concluídos.\n\nEnquanto a função pública estiver desabilitada, Adicionar à Wallet apresenta um aviso institucional e não inicia a emissão do passe." },
        { id: "gmail", title: "Gerar assinatura para e-mail", body: "Acesse Gerar Rodapé para E-mail, escolha o idioma e os campos que devem aparecer e revise a prévia. A assinatura pode incluir logo, dados profissionais, links, QR Code e o aviso opcional de confidencialidade e LGPD.\n\nCopie o HTML e cole no editor de assinatura do Gmail ou de outro cliente compatível. Envie uma mensagem de teste para conferir espaçamento, links e carregamento das imagens por HTTPS." },
        { id: "estatisticas", title: "Consultar estatísticas", body: "A página de Estatísticas de Compartilhamento apresenta períodos de 7, 30 e 90 dias, além de intervalo personalizado. Os indicadores incluem visualizações, vCards, compartilhamentos, QR Code e outras interações disponíveis.\n\nUse a comparação e o resumo textual para acompanhar a evolução da utilização. Os números representam eventos registrados pelo sistema e não identificam necessariamente a pessoa que recebeu ou salvou o contato." },
        { id: "faq", title: "Dúvidas frequentes", body: "Se Minha Página não estiver disponível, confirme que o formulário foi salvo e que o Link da página apresenta o check verde. Se uma alteração não aparecer, atualize a página e verifique se o salvamento terminou com sucesso.\n\nO QR Code continua ligado ao fluxo do cartão enquanto o link não for alterado. Cada colaborador autenticado acessa somente o próprio cartão. Em caso de inconsistência institucional, procure a equipe responsável antes de criar dados alternativos." },
      ],
    },
  },
}

export function normalizeSectionId(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
