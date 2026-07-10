import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordReset } from '../lib/auth'
import { getFriendlyErrorMessage } from '../lib/errors'
import { buildInvestEmail, INVEST_EMAIL_DOMAIN, normalizeInvestEmailInput } from '../lib/investEmail'

export default function PasswordResetRequestPage() {
  const [prefix, setPrefix] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      await sendPasswordReset(buildInvestEmail(prefix))
      setMessage('Enviamos um link para você definir uma nova senha.')
    } catch (err) {
      setError(getFriendlyErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card">
        <img
          className="home-logo"
          src="/invest-rs-logo.png"
          alt="Invest RS"
          style={{ width: '180px', marginBottom: '28px' }}
        />

        <h1>Recuperar senha</h1>
        <p style={{ marginTop: '12px' }}>
          Informe seu e-mail institucional para receber o link de recuperação.
        </p>

        <form onSubmit={submit}>
          <label>
            E-mail institucional
            <span className="email-suffix-field">
              <input
                required
                value={prefix}
                onChange={(event) => setPrefix(normalizeInvestEmailInput(event.target.value))}
                placeholder="seu.nome"
              />
              <span className="email-suffix-label">{INVEST_EMAIL_DOMAIN}</span>
            </span>
          </label>

          <button className="primary-button" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar link de recuperação'}
          </button>
        </form>

        {message ? <p className="admin-success">{message}</p> : null}
        {error ? <p className="admin-error">{error}</p> : null}

        <div className="auth-links">
          <Link to="/">Voltar</Link>
          <Link to="/entrar">Voltar para entrar</Link>
        </div>
      </section>
    </main>
  )
}