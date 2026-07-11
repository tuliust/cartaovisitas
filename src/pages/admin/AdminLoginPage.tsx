import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentSession, signInWithPassword, signOut } from '../../lib/auth'
import { getFriendlyErrorMessage } from '../../lib/errors'
import { buildInvestEmail, INVEST_EMAIL_DOMAIN, normalizeInvestEmailInput } from '../../lib/investEmail'
import { isCurrentUserAdmin } from '../../lib/roles'
import { useBrandSettings } from '../../contexts/BrandSettingsContext'
import { useVisualMode } from '../../contexts/VisualModeContext'
import { getVariantLogo } from '../../lib/cardVisualVariants'
import { useToast } from '../../contexts/ToastContext'

export default function AdminLoginPage() {
  const { settings } = useBrandSettings()
  const { visualMode } = useVisualMode()
  const toast = useToast()
  const navigate = useNavigate()
  const [prefix, setPrefix] = useState('')
  const [password, setPassword] = useState('')
  const [checking, setChecking] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    void (async () => {
      if (await getCurrentSession() && await isCurrentUserAdmin()) {
        navigate('/admin/cartoes', { replace: true })
      }
    })()
      .catch(() => undefined)
      .finally(() => setChecking(false))
  }, [navigate])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signInWithPassword(buildInvestEmail(prefix), password)
      if (!(await isCurrentUserAdmin())) {
        await signOut()
        const message = 'Seu usuário não tem permissão para acessar a área restrita.'
        setError(message)
        toast.error(message)
        return
      }
      toast.success('Login administrativo realizado com sucesso.')
      navigate('/admin/cartoes', { replace: true })
    } catch (err) {
      const message = getFriendlyErrorMessage(err)
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return <main className="admin-login-shell"><div className="admin-login-card">Verificando sessão...</div></main>
  }

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card">
        <img className="auth-logo" src={getVariantLogo(settings, visualMode)} alt="Invest RS" />
        <h1>Área Restrita</h1>
        <p>Acesso administrativo aos cartões digitais da Invest RS.</p>
        <form onSubmit={submit}>
          <label>
            E-mail institucional
            <span className="email-suffix-field">
              <input required autoComplete="username" value={prefix} onChange={(event) => setPrefix(normalizeInvestEmailInput(event.target.value))} />
              <span className="email-suffix-label">{INVEST_EMAIL_DOMAIN}</span>
            </span>
          </label>
          <label>
            Senha
            <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <button className="primary-button" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
        </form>
        {error ? <p className="admin-error" role="alert">{error}</p> : null}
        <div className="auth-links">
          <Link to="/recuperar-senha">Esqueci minha senha</Link>
          <Link to="/">Voltar</Link>
        </div>
      </section>
    </main>
  )
}
