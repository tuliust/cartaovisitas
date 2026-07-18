import { ArrowLeft, Contact, Home, LayoutDashboard, LogIn, LogOut, Pencil } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useInstallApp } from '../../hooks/useInstallApp'
import type { AdminBusinessCard } from '../../lib/adminCards'
import type { CollaboratorCardActions } from '../../lib/collaboratorCardActions'
import VisualModeSelector from '../VisualModeSelector'
import CollaboratorMoreMenu from './CollaboratorMoreMenu'
import CollaboratorAccountMenu from './CollaboratorAccountMenu'

type Props = { authenticated: boolean; isAdmin?: boolean; card: AdminBusinessCard | null; actions?: CollaboratorCardActions; onLogout?: () => void; useBackButton?: boolean }

export default function CollaboratorNavigation({ authenticated, isAdmin = false, card, actions, onLogout, useBackButton = false }: Props) {
  const navigate = useNavigate()
  const { openInstallModal } = useInstallApp()
  const backButton = <button className="collaborator-nav-item" type="button" onClick={() => window.history.state?.idx > 0 ? navigate(-1) : navigate('/')}><ArrowLeft aria-hidden="true" /><span>Voltar</span></button>
  if (useBackButton) return <nav className="collaborator-nav" aria-label="Navegação">{backButton}<VisualModeSelector variant="compact" />{authenticated ? <CollaboratorAccountMenu card={card} onLogout={onLogout} /> : <Link className="collaborator-nav-item" to="/entrar"><LogIn aria-hidden="true" /><span>Entrar</span></Link>}</nav>
  if (!authenticated) return <nav className="collaborator-nav" aria-label="Navegação"><NavLink className="collaborator-nav-item" to="/"><Home aria-hidden="true" /><span>Home</span></NavLink><VisualModeSelector variant="compact" /><Link className="collaborator-nav-item" to="/entrar"><LogIn aria-hidden="true" /><span>Entrar</span></Link></nav>
  const pagePath = card?.slug ? `/${card.slug}` : '/meu-cartao/editar'
  return <nav className="collaborator-nav" aria-label="Navegação do colaborador">
    <NavLink end className={({ isActive }) => `collaborator-nav-item${isActive ? ' active' : ''}`} to="/" title="Home"><Home aria-hidden="true" /><span>Home</span></NavLink>
    <NavLink className={({ isActive }) => `collaborator-nav-item${isActive && Boolean(card?.slug) ? ' active' : ''}`} to={pagePath} title="Minha Página"><Contact aria-hidden="true" /><span>Minha Página</span></NavLink>
    <NavLink className={({ isActive }) => `collaborator-nav-item${isActive ? ' active' : ''}`} to="/meu-cartao/editar" title="Editar"><Pencil aria-hidden="true" /><span>Editar</span></NavLink>
    {actions ? <CollaboratorMoreMenu
      disabled={!card}
      running={actions.running}
      onShareContact={() => { if (card?.slug) navigate(`/${card.slug}`, { state: { openShareMenu: true } }) }}
      onInstallApp={openInstallModal}
      onEmailFooter={() => navigate('/meu-cartao/assinatura-de-email')}
      onStatistics={() => navigate('/meu-cartao/estatisticas')}
      onWallet={actions.openWallet}
    /> : null}
    {isAdmin ? <NavLink className={({ isActive }) => `collaborator-nav-item${isActive ? ' active' : ''}`} to="/admin/cartoes" title="Admin"><LayoutDashboard aria-hidden="true" /><span>Admin</span></NavLink> : null}
    <VisualModeSelector variant="compact" />
    <button className="collaborator-nav-item collaborator-nav-logout" type="button" aria-label="Sair" title="Sair" onClick={onLogout}><LogOut aria-hidden="true" /><span>Sair</span></button>
  </nav>
}
