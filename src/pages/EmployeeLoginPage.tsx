import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import InstitutionalEmailField from '../components/auth/InstitutionalEmailField'
import { getCurrentSession, signInWithPassword, signOut } from '../lib/auth'
import { getFriendlyErrorMessage } from '../lib/errors'
import { buildInvestEmail } from '../lib/investEmail'
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
  const [emailPrefix, setEmailPrefix] = useState('')
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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const credentialEmail = buildInvestEmail(emailPrefix)
    setLoading(true)

    try {
      await signInWithPassword(credentialEmail, password)
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

        <form className="auth-page-form" autoComplete="on" method="post" onSubmit={submit}>
          <InstitutionalEmailField
            id="employee-login-username"
            value={emailPrefix}
            onChange={setEmailPrefix}
          />

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

          <button className="primary-button auth-page-submit" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-links auth-page-links auth-page-links--three">
          <Link className="auth-link-back" to="/" aria-label="Voltar">
            <ArrowLeft className="auth-link-back-icon" aria-hidden="true" />
            <span className="auth-link-back-text">Voltar</span>
          </Link>
          <Link className="auth-link-recovery" to="/recuperar-senha">Recuperar senha</Link>
          <Link className="auth-link-register" to="/cadastro">Cadastre-se</Link>
        </div>
      </section>
    </main>
  )
}
