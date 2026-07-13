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
