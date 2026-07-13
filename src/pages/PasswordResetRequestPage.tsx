import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordReset } from '../lib/auth'
import { getFriendlyErrorMessage } from '../lib/errors'
import { buildInvestEmail, INVEST_EMAIL_DOMAIN, normalizeInvestEmailInput } from '../lib/investEmail'
import { useBrandSettings } from '../contexts/BrandSettingsContext'
import { useVisualMode } from '../contexts/VisualModeContext'
import { getVariantLogo } from '../lib/cardVisualVariants'
import { useToast } from '../contexts/ToastContext'

export default function PasswordResetRequestPage() {
  const { settings } = useBrandSettings()
  const { visualMode } = useVisualMode()
  const toast = useToast()
  const [prefix, setPrefix] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)

    try {
      await sendPasswordReset(buildInvestEmail(prefix))
      toast.success('Enviamos um link para você definir uma nova senha.')
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err))
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

        <h1 className="auth-page-title">Recuperar senha</h1>
        <p className="auth-page-description">
          Informe seu e-mail institucional para receber o link de recuperação.
        </p>

        <form className="auth-page-form" onSubmit={submit}>
          <label>
            E-mail institucional
            <span className="email-suffix-field">
              <input
                required
                id="password-reset-username"
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

          <button className="primary-button auth-page-submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar link de recuperação'}
          </button>
        </form>

        <div className="auth-links auth-page-links">
          <Link to="/">Voltar</Link>
        </div>
      </section>
    </main>
  )
}
