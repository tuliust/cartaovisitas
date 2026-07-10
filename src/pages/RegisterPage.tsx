import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { signUpWithPassword } from '../lib/auth'
import { getFriendlyErrorMessage } from '../lib/errors'
import { buildInvestEmail, INVEST_EMAIL_DOMAIN, normalizeInvestEmailInput } from '../lib/investEmail'

export default function RegisterPage() {
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
      setError('As senhas não coincidem.')
      return
    }

    if (password.length < 6) {
      setError('Use uma senha mais segura.')
      return
    }

    setLoading(true)

    try {
      await signUpWithPassword(buildInvestEmail(prefix), password)
      setMessage('Enviamos um e-mail de confirmação. Confirme seu cadastro para continuar.')
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