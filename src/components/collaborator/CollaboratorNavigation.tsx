import { Contact, Home, LogIn, LogOut, Pencil } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import type { AdminBusinessCard } from '../../lib/adminCards'
import type { CollaboratorCardActions } from '../../lib/collaboratorCardActions'
import VisualModeSelector from '../VisualModeSelector'
import CollaboratorMoreMenu from './CollaboratorMoreMenu'

type Props = { authenticated: boolean; card: AdminBusinessCard | null; actions?: CollaboratorCardActions; onLogout?: () => void }

export default function CollaboratorNavigation({ authenticated, card, actions, onLogout }: Props) {
  if (!authenticated) return <nav className="collaborator-nav" aria-label="Navegação"><NavLink className="collaborator-nav-item" to="/"><Home aria-hidden="true" /><span>Home</span></NavLink><VisualModeSelector variant="compact" /><Link className="collaborator-nav-item" to="/entrar"><LogIn aria-hidden="true" /><span>Entrar</span></Link></nav>
  const pagePath = card?.slug ? `/${card.slug}` : '/meu-cartao/editar'
  return <nav className="collaborator-nav" aria-label="Navegação do colaborador">
    <NavLink end className={({ isActive }) => `collaborator-nav-item${isActive ? ' active' : ''}`} to="/" title="Home"><Home aria-hidden="true" /><span>Home</span></NavLink>
    <NavLink className={({ isActive }) => `collaborator-nav-item${isActive && Boolean(card?.slug) ? ' active' : ''}`} to={pagePath} title="Minha Página"><Contact aria-hidden="true" /><span>Minha Página</span></NavLink>
    <NavLink className={({ isActive }) => `collaborator-nav-item${isActive ? ' active' : ''}`} to="/meu-cartao/editar" title="Editar"><Pencil aria-hidden="true" /><span>Editar</span></NavLink>
    {actions ? <CollaboratorMoreMenu disabled={!card} running={actions.running} onCopyVCard={actions.copyVCard} onDownloadQr={actions.downloadQrCode} onWallet={actions.openWallet} /> : null}
    <VisualModeSelector variant="compact" />
    <button className="collaborator-nav-item collaborator-nav-logout" type="button" aria-label="Sair" title="Sair" onClick={onLogout}><LogOut aria-hidden="true" /><span>Sair</span></button>
  </nav>
}
