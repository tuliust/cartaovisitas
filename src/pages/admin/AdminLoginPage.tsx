import { useEffect, useState, type FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentSession, signInWithPassword, signOut } from '../../lib/auth'
import { getFriendlyErrorMessage } from '../../lib/errors'
import { buildInvestEmail, normalizeInvestEmailAddressInput } from '../../lib/investEmail'
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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [checking, setChecking] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    void (async () => {
      if (await getCurrentSession() && await isCurrentUserAdmin()) {
        navigate('/admin/cartoes', { replace: true })
      }
    })()
      .catch(() => undefined)
      .finally(() => setChecking(false))
  }, [navigate])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const credentialEmail = buildInvestEmail(email)
    setEmail(credentialEmail)
    setLoading(true)

    try {
      await signInWithPassword(credentialEmail, password)

      if (!(await isCurrentUserAdmin())) {
        await signOut()
        toast.error('Seu usuário não tem permissão para acessar a área restrita.')
        return
      }

      toast.success('Login administrativo realizado com sucesso.')
      navigate('/admin/cartoes', { replace: true })
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <main className="admin-login-shell auth-page-shell">
        <div className="admin-login-card auth-page-card auth-page-status">
          Verificando sessão...
        </div>
      </main>
    )
  }

  return (
    <main className="admin-login-shell auth-page-shell">
      <section className="admin-login-card auth-page-card">
        <img
          className="auth-logo auth-page-logo"
          src={getVariantLogo(settings, visualMode)}
          alt="Invest RS"
        />

        <h1 className="auth-page-title">Área Restrita</h1>
        <p className="auth-page-description">
          Acesso administrativo aos cartões digitais da Invest RS.
        </p>

        <form className="auth-page-form" autoComplete="on" method="post" onSubmit={submit}>
          <label>
            E-mail institucional
            <span className="email-suffix-field email-full-field">
              <input
                required
                id="admin-login-username"
                name="username"
                type="email"
                inputMode="email"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={email}
                onChange={(event) => setEmail(normalizeInvestEmailAddressInput(event.target.value))}
                onBlur={() => setEmail((current) => buildInvestEmail(current))}
                placeholder="seu.nome@investrs.org.br"
              />
            </span>
          </label>

          <div className="auth-form-field">
            <label htmlFor="admin-login-password">Senha</label>
            <span className="password-input-field">
              <input
                required
                id="admin-login-password"
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

        <div className="auth-links auth-page-links">
          <Link to="/recuperar-senha">Recuperar senha</Link>
          <Link to="/">Voltar</Link>
        </div>
      </section>
    </main>
  )
}
