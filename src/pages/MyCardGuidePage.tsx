import { Link } from 'react-router-dom'
import CollaboratorLayout from '../components/collaborator/CollaboratorLayout'
import { useCollaborator } from '../contexts/CollaboratorContext'

const sections = [
  ['visao-geral', 'Visão geral da plataforma'], ['primeiro-cartao', 'Criar o primeiro cartão'], ['slug', 'Preencher e validar o slug'],
  ['editar', 'Editar dados'], ['foto', 'Adicionar foto'], ['visual', 'Escolher visual'], ['minha-pagina', 'Abrir Minha Página'],
  ['compartilhar', 'Compartilhar vCard'], ['copiar', 'Copiar vCard'], ['qr', 'Baixar e utilizar o QR Code'], ['wallet', 'Wallet'],
  ['gmail', 'Gerar assinatura para Gmail'], ['estatisticas', 'Consultar estatísticas'], ['faq', 'Dúvidas frequentes'],
] as const

export default function MyCardGuidePage() {
  const { card } = useCollaborator()
  return <CollaboratorLayout title="Guia de Utilização" subtitle="Aprenda a configurar, divulgar e acompanhar seu cartão digital.">
    <div className="guide-layout"><nav className="guide-index" aria-label="Índice do guia"><h2>Neste guia</h2><ol>{sections.map(([id, title]) => <li key={id}><a href={`#${id}`}>{title}</a></li>)}</ol></nav>
      <article className="guide-content">
        <section id="visao-geral"><h2>Visão geral da plataforma</h2><p>A plataforma reúne seus dados profissionais, arquivo vCard, QR Code, assinatura de e-mail e métricas em uma área autenticada.</p></section>
        <section id="primeiro-cartao"><h2>Criar o primeiro cartão</h2><p>Acesse <Link to="/meu-cartao/editar">Editar</Link>, revise os dados institucionais, preencha os campos pessoais e salve. O menu Minha Página será habilitado após o primeiro salvamento.</p></section>
        <section id="slug"><h2>Preencher e validar o slug</h2><p>O slug identifica o endereço da sua página. Use uma forma curta do nome, sem espaços ou acentos. Aguarde a mensagem “Endereço disponível.” antes de salvar.</p></section>
        <section id="editar"><h2>Editar dados</h2><p>Na página <Link to="/meu-cartao/editar">Editar</Link>, atualize nome de exibição, cargo, departamento, telefones e links. Os dados institucionais bloqueados são mantidos pela administração.</p></section>
        <section id="foto"><h2>Adicionar foto</h2><p>Selecione uma imagem no formulário, ajuste o recorte e confirme. Use o controle de visibilidade para decidir se a foto aparece na sua página.</p></section>
        <section id="visual"><h2>Escolher visual</h2><p>Use o botão circular no header para escolher uma das seis variantes. Essa escolha altera apenas sua preferência de interface e não salva silenciosamente um novo visual no cartão.</p></section>
        <section id="minha-pagina"><h2>Abrir Minha Página</h2><p>{card ? <>Use o item <Link to={`/${card.slug}`}>Minha Página</Link> para abrir seu cartão.</> : <>Salve seu cartão primeiro; depois o item Minha Página apontará para o endereço correto.</>}</p></section>
        <section id="compartilhar"><h2>Compartilhar vCard</h2><p>Em Minha Página, escolha “Compartilhar meu cartão”. Em navegadores compatíveis, o arquivo vCard será encaminhado pelo compartilhamento nativo; nos demais, será baixado.</p></section>
        <section id="copiar"><h2>Copiar vCard</h2><p>Abra “Mais” no header e selecione “Copiar vCard” para copiar o endereço do arquivo de contato.</p></section>
        <section id="qr"><h2>Baixar e utilizar o QR Code</h2><p>No menu “Mais”, selecione “Baixar QR-Code”. Ao escanear a imagem, o dispositivo abre o arquivo vCard para salvar o contato; o QR não depende de login.</p></section>
        <section id="wallet"><h2>Wallet</h2><p>“Adicionar à Wallet” usa a integração disponível para o dispositivo. Enquanto a função estiver desabilitada, o sistema apresenta o aviso institucional de desenvolvimento.</p></section>
        <section id="gmail"><h2>Gerar assinatura para Gmail</h2><p>Acesse <Link to="/meu-cartao/assinatura-de-email">Gerar Rodapé para E-mail</Link>, escolha os campos, copie a assinatura e cole em Gmail → Configurações → Assinatura.</p></section>
        <section id="estatisticas"><h2>Consultar estatísticas</h2><p>A página de <Link to="/meu-cartao/estatisticas">Estatísticas de Compartilhamento</Link> mostra visualizações, vCards, compartilhamentos e interações com QR Code por período.</p></section>
        <section id="faq"><h2>Dúvidas frequentes</h2><h3>Minha alteração não apareceu?</h3><p>Confirme que o formulário foi salvo e atualize a página.</p><h3>O QR Code muda quando edito meus dados?</h3><p>Não. Ele continua apontando para o mesmo slug e entrega o vCard atualizado.</p><h3>Posso acessar o cartão de outra pessoa?</h3><p>Não pela área do colaborador. Cada usuário autenticado acessa somente o próprio cartão.</p></section>
      </article>
    </div>
  </CollaboratorLayout>
}
