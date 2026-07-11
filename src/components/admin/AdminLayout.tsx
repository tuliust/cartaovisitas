import { Link, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { signOut } from '../../lib/auth'
import { useBrandSettings } from '../../contexts/BrandSettingsContext'

type AdminLayoutProps = {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
}

export default function AdminLayout({ title, subtitle, action, children }: AdminLayoutProps) {
  const navigate = useNavigate()
  const { settings } = useBrandSettings()

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <Link className="admin-brand" to="/admin/cartoes">
          <img className="admin-logo" src={settings.logo_on_dark_url || settings.logo_url} alt="Invest RS" />
        </Link>

        <nav className="admin-nav">
          <Link to="/admin/cartoes">Cartões</Link>
          <Link to="/admin/usuarios">Usuários</Link>
          <Link to="/admin/auditoria">Auditoria</Link>
          <Link to="/admin/configuracoes">Configurações</Link>
          <button type="button" onClick={handleSignOut}>
            Sair
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
