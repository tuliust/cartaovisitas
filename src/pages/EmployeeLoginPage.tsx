import { useEffect, useState, type FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentSession, signInWithPassword, signOut } from '../lib/auth'
import { getFriendlyErrorMessage } from '../lib/errors'
import { buildInvestEmail, INVEST_EMAIL_DOMAIN, normalizeInvestEmailInput } from '../lib/investEmail'
import { getMyCard } from '../lib/myCard'
import { requireActiveUser } from '../lib/roles'
import { useBrandSettings } from '../contexts/BrandSettingsContext'
import { useVisualMode } from '../contexts/VisualModeContext'
import { getVariantLogo } from '../lib/cardVisualVariants'
import { useToast } from '../contexts/ToastContext'

export default function EmployeeLoginPage() {
  const { settings } = useBrandSettings()
  const { visualMode } = useVisualMode()
  const toast = useToast()
  const navigate = useNavigate()
  const [prefix, setPrefix] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    void getCurrentSession().then(async (session) => {
      if (!session) return
      try { await requireActiveUser(); navigate('/meu-cartao', { replace: true }) }
      catch (error) { await signOut().catch(() => undefined); toast.error(getFriendlyErrorMessage(error)) }
    }).catch(() => undefined)
  }, [navigate, toast])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    try {
      await signInWithPassword(buildInvestEmail(prefix), password)
      await requireActiveUser()
      const card = await getMyCard()
      toast.success('Login realizado com sucesso.')
      navigate(card ? `/${card.slug}` : '/meu-cartao/editar', { replace: true })
    } catch (err) {
      const message = getFriendlyErrorMessage(err)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-login-shell auth-page-shell auth-logo-shift-page">
      <section className="admin-login-card auth-page-card">
        <img
          className="auth-logo auth-page-logo"
          src={getVariantLogo(settings, visualMode)}
          alt="Invest RS"
        />

        <h1 className="auth-page-title">Acessar meu cartão</h1>
        <p className="auth-page-description">
          Entre com seu e-mail institucional para acessar seu cartão digital.
        </p>

        <form className="auth-page-form" autoComplete="on" onSubmit={submit}>
          <label>
            E-mail institucional
            <span className="email-suffix-field">
              <input
                required
                id="employee-login-username"
                name="username"
                type="text"
                inputMode="email"
                autoComplete="username"
                value={prefix}
                onChange={(event) => setPrefix(normalizeInvestEmailInput(event.target.value))}
                placeholder="seu.nome"
              />
              <span className="email-suffix-label">{INVEST_EMAIL_DOMAIN}</span>
            </span>
          </label>

          <div className="auth-form-field">
            <label htmlFor="employee-login-password">Senha</label>
            <span className="password-input-field">
              <input
                required
                id="employee-login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                className="password-visibility-button"
                type="button"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                aria-pressed={showPassword}
                title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </button>
            </span>
          </div>

          <button className="primary-button auth-page-submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-links auth-page-links">
          <Link to="/">Voltar</Link>
          <Link to="/cadastro">Cadastre-se</Link>
          <Link to="/recuperar-senha">Recuperar senha</Link>
        </div>
      </section>
    </main>
  )
}
