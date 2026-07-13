import { useState, type FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { signUpWithPassword } from '../lib/auth'
import { getFriendlyErrorMessage } from '../lib/errors'
import { buildInvestEmail, INVEST_EMAIL_DOMAIN, normalizeInvestEmailInput } from '../lib/investEmail'
import { useBrandSettings } from '../contexts/BrandSettingsContext'
import { useVisualMode } from '../contexts/VisualModeContext'
import { getVariantLogo } from '../lib/cardVisualVariants'
import { useToast } from '../contexts/ToastContext'

export default function RegisterPage() {
  const { settings } = useBrandSettings()
  const { visualMode } = useVisualMode()
  const toast = useToast()
  const [prefix, setPrefix] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (password !== confirm) {
      const validationMessage = 'As senhas não coincidem.'
      toast.error(validationMessage)
      return
    }

    if (password.length < 6) {
      const validationMessage = 'Use uma senha mais segura.'
      toast.error(validationMessage)
      return
    }

    setLoading(true)

    try {
      await signUpWithPassword(buildInvestEmail(prefix), password)
      const successMessage = 'Enviamos um e-mail de confirmação. Confirme seu cadastro para continuar.'
      toast.success(successMessage)
    } catch (err) {
      const failureMessage = getFriendlyErrorMessage(err)
      toast.error(failureMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-login-shell auth-page-shell">
      <section className="admin-login-card auth-page-card">
        <img
          className="auth-logo auth-page-logo"
          src={getVariantLogo(settings, visualMode)}
          alt="Invest RS"
        />

        <h1 className="auth-page-title">Cadastro</h1>
        <p className="auth-page-description">
          Crie seu acesso com o e-mail institucional da Invest RS.
        </p>

        <form className="auth-page-form" onSubmit={submit}>
          <label>
            E-mail institucional
            <span className="email-suffix-field">
              <input
                required
                id="register-username"
                name="username"
                type="text"
                inputMode="email"
                value={prefix}
                autoComplete="username"
                onChange={(event) => setPrefix(normalizeInvestEmailInput(event.target.value))}
                placeholder="seu.nome"
              />
              <span className="email-suffix-label">{INVEST_EMAIL_DOMAIN}</span>
            </span>
          </label>

          <div className="auth-form-field">
            <label htmlFor="register-password">Senha</label>
            <span className="password-input-field">
              <input
                required
                id="register-password"
                name="password"
                minLength={6}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
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

          <div className="auth-form-field">
            <label htmlFor="register-password-confirmation">Confirmar senha</label>
            <span className="password-input-field">
              <input
                required
                id="register-password-confirmation"
                name="password-confirmation"
                minLength={6}
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
              />
              <button
                className="password-visibility-button"
                type="button"
                aria-label={showConfirmPassword ? 'Ocultar senha' : 'Exibir senha'}
                aria-pressed={showConfirmPassword}
                title={showConfirmPassword ? 'Ocultar senha' : 'Exibir senha'}
                onClick={() => setShowConfirmPassword((current) => !current)}
              >
                {showConfirmPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </button>
            </span>
          </div>

          <button className="primary-button auth-page-submit" disabled={loading}>
            {loading ? 'Criando...' : 'Criar cadastro'}
          </button>
        </form>


        <div className="auth-links auth-page-links">
          <Link to="/">Voltar</Link>
        </div>
      </section>
    </main>
  )
}
