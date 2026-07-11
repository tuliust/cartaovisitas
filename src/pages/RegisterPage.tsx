import { useState, type FormEvent } from 'react'
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (password !== confirm) {
      const validationMessage = 'As senhas não coincidem.'
      setError(validationMessage)
      toast.error(validationMessage)
      return
    }

    if (password.length < 6) {
      const validationMessage = 'Use uma senha mais segura.'
      setError(validationMessage)
      toast.error(validationMessage)
      return
    }

    setLoading(true)

    try {
      await signUpWithPassword(buildInvestEmail(prefix), password)
      const successMessage = 'Enviamos um e-mail de confirmação. Confirme seu cadastro para continuar.'
      setMessage(successMessage)
      toast.success(successMessage)
    } catch (err) {
      const failureMessage = getFriendlyErrorMessage(err)
      setError(failureMessage)
      toast.error(failureMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card">
        <img
          className="auth-logo"
          src={getVariantLogo(settings, visualMode)}
          alt="Invest RS"
          style={{ width: '180px', marginBottom: '28px' }}
        />

        <h1>Cadastro</h1>
        <p style={{ marginTop: '12px' }}>
          Crie seu acesso com o e-mail institucional da Invest RS.
        </p>

        <form onSubmit={submit}>
          <label>
            E-mail institucional
            <span className="email-suffix-field">
              <input
                required
                value={prefix}
                autoComplete="username"
                onChange={(event) => setPrefix(normalizeInvestEmailInput(event.target.value))}
                placeholder="seu.nome"
              />
              <span className="email-suffix-label">{INVEST_EMAIL_DOMAIN}</span>
            </span>
          </label>

          <label>
            Senha
            <input
              required
              minLength={6}
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <label>
            Confirmar senha
            <input
              required
              minLength={6}
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
            />
          </label>

          <button className="primary-button" disabled={loading}>
            {loading ? 'Criando...' : 'Criar cadastro'}
          </button>
        </form>

        {message ? <p className="admin-success">{message}</p> : null}
        {error ? <p className="admin-error">{error}</p> : null}

        <div className="auth-links">
          <Link to="/">Voltar</Link>
          <Link to="/entrar">Já tenho cadastro</Link>
        </div>
      </section>
    </main>
  )
}
