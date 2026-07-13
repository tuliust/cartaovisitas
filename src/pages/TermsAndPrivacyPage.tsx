import CollaboratorLayout from '../components/collaborator/CollaboratorLayout'

const pending = 'Conteúdo sujeito à validação institucional e jurídica.'

export default function TermsAndPrivacyPage() {
  return <CollaboratorLayout title="Termos de Uso e Privacidade" subtitle="Minuta informativa da plataforma de cartões digitais.">
    <article className="legal-document"><aside role="note"><strong>Minuta em revisão</strong><p>Este documento é uma versão inicial e não deve ser interpretado como parecer jurídico definitivo. {pending}</p></aside>
      <section><h2>Termos de Uso</h2><p>A plataforma oferece recursos para criação, manutenção e compartilhamento de cartões profissionais institucionais. O acesso à área do colaborador é pessoal e depende de credenciais válidas.</p></section>
      <section><h2>Controlador</h2><p>A identificação formal do controlador e de seus representantes será confirmada na revisão institucional. {pending}</p></section>
      <section><h2>Dados coletados</h2><p>Podem ser tratados dados profissionais informados no cartão, identificadores de conta, imagem de perfil e eventos técnicos de interação, como visualizações, vCards, compartilhamentos e QR Code.</p></section>
      <section><h2>Finalidades</h2><p>Os dados são utilizados para autenticar usuários, apresentar o cartão profissional, gerar arquivos solicitados, operar recursos da plataforma, proteger o acesso e produzir estatísticas para o proprietário.</p></section>
      <section><h2>Bases legais</h2><p>As bases legais aplicáveis a cada operação serão definidas e documentadas após análise jurídica e institucional. {pending}</p></section>
      <section><h2>Compartilhamento</h2><p>Dados do cartão podem integrar arquivos vCard, QR Code e Wallet quando o usuário aciona essas funcionalidades. Fornecedores de infraestrutura podem processar dados estritamente para operar o serviço. A relação definitiva de operadores depende de validação institucional.</p></section>
      <section><h2>Armazenamento e retenção</h2><p>Os critérios e prazos de retenção ainda serão formalizados considerando finalidade, obrigações aplicáveis e segurança. {pending}</p></section>
      <section><h2>Cookies e localStorage</h2><p>A aplicação utiliza armazenamento local para preferências públicas de identidade visual e cache de branding. Eventuais cookies de autenticação ou recursos equivalentes são gerenciados pelos serviços técnicos utilizados pela plataforma.</p></section>
      <section><h2>Segurança</h2><p>São aplicadas medidas técnicas como autenticação, controle de acesso, políticas de banco e separação entre credenciais públicas e server-side. Nenhum mecanismo elimina integralmente os riscos inerentes a serviços conectados.</p></section>
      <section><h2>Direitos do titular</h2><p>Os procedimentos, prazos e canal responsável pelo atendimento dos direitos do titular serão publicados após validação institucional e jurídica. {pending}</p></section>
      <section><h2>Responsabilidades do usuário</h2><p>O usuário deve proteger suas credenciais, manter informações profissionais corretas, respeitar direitos de terceiros e comunicar suspeitas de uso indevido.</p></section>
      <section><h2>Disponibilidade do serviço</h2><p>A plataforma pode passar por manutenção, evolução ou indisponibilidade técnica. Condições formais de nível de serviço não estão estabelecidas nesta minuta.</p></section>
      <section><h2>Canal de contato</h2><p>O canal oficial para privacidade e suporte será inserido após confirmação institucional. {pending}</p></section>
      <footer><h2>Data e versão do documento</h2><p>Versão preliminar 0.1 — 12 de julho de 2026. Pendente de aprovação institucional e jurídica.</p></footer>
    </article>
  </CollaboratorLayout>
}
