import { Link, NavLink, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ClipboardList, CreditCard, LogOut, Settings, Users } from 'lucide-react'
import { signOut } from '../../lib/auth'
import { useBrandSettings } from '../../contexts/BrandSettingsContext'
import { useVisualMode } from '../../contexts/VisualModeContext'
import { getVariantLogo } from '../../lib/cardVisualVariants'
import { useOptionalCollaborator } from '../../contexts/CollaboratorContext'
import { getAuthenticatedLogoDestination } from '../../lib/navigation'

type AdminLayoutProps = {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
}

export default function AdminLayout({ title, subtitle, action, children }: AdminLayoutProps) {
  const navigate = useNavigate()
  const { settings } = useBrandSettings()
  const { visualMode, clearAuthenticatedDefault } = useVisualMode()
  const collaborator = useOptionalCollaborator()
  const logoDestination = getAuthenticatedLogoDestination(Boolean(collaborator?.authenticated), collaborator?.card ?? null)

  async function handleSignOut() {
    clearAuthenticatedDefault()
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <main className="admin-shell">
      <header className="collaborator-topbar admin-topbar">
        <Link className="collaborator-brand admin-brand" to={logoDestination} aria-label={logoDestination === '/' ? 'Ir para a página inicial' : 'Ir para o meu cartão'}>
          <img className="collaborator-logo admin-logo" src={getVariantLogo(settings, visualMode)} alt="Invest RS" />
        </Link>

        <nav className="collaborator-nav admin-nav" aria-label="Navegação administrativa">
          <NavLink
            className={({ isActive }) => `collaborator-nav-item admin-nav-link${isActive ? ' active' : ''}`}
            to="/admin/cartoes"
            aria-label="Cartões"
            title="Cartões"
          >
            <CreditCard aria-hidden="true" />
            <span className="admin-nav-label">Cartões</span>
          </NavLink>

          <NavLink
            className={({ isActive }) => `collaborator-nav-item admin-nav-link${isActive ? ' active' : ''}`}
            to="/admin/usuarios"
            aria-label="Usuários"
            title="Usuários"
          >
            <Users aria-hidden="true" />
            <span className="admin-nav-label">Usuários</span>
          </NavLink>

          <NavLink
            className={({ isActive }) => `collaborator-nav-item admin-nav-link${isActive ? ' active' : ''}`}
            to="/admin/auditoria"
            aria-label="Auditoria"
            title="Auditoria"
          >
            <ClipboardList aria-hidden="true" />
            <span className="admin-nav-label">Auditoria</span>
          </NavLink>

          <NavLink
            className={({ isActive }) => `collaborator-nav-item admin-nav-link${isActive ? ' active' : ''}`}
            to="/admin/configuracoes"
            aria-label="Configurações"
            title="Configurações"
          >
            <Settings aria-hidden="true" />
            <span className="admin-nav-label">Configurações</span>
          </NavLink>

          <button
            className="collaborator-nav-item collaborator-nav-logout admin-nav-logout"
            type="button"
            aria-label="Sair"
            title="Sair"
            onClick={handleSignOut}
          >
            <LogOut aria-hidden="true" />
            <span className="admin-nav-label">Sair</span>
          </button>
        </nav>
      </header>

      <section className="admin-page">
        <div className="admin-page-header">
          <div>
            <p className="eyebrow">Painel administrativo</p>
            <h1>{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>

          {action ? <div className="admin-page-action">{action}</div> : null}
        </div>

        {children}
      </section>
    </main>
  )
}
