import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentSession, isInvestRsEmail, signInWithMagicLink } from '../../lib/auth'
import { getFriendlyErrorMessage } from '../../lib/errors'
import { buildInvestEmail, INVEST_EMAIL_DOMAIN, normalizeInvestEmailInput } from '../../lib/investEmail'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [emailPrefix, setEmailPrefix] = useState('')
  const [checking, setChecking] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function checkSession() {
      try {
        const session = await getCurrentSession()

        if (session && isInvestRsEmail(session.user.email)) {
          navigate('/admin/cartoes', { replace: true })
          return
        }
      } catch {
        // Mantém o usuário na tela de login.
      } finally {
        setChecking(false)
      }
    }

    void checkSession()
  }, [navigate])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const email = buildInvestEmail(emailPrefix)
      await signInWithMagicLink(email)
      setMessage(`Enviamos um link de acesso para ${email}.`)
    } catch (err) {
      setError(getFriendlyErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <main className="admin-login-shell">
        <div className="admin-login-card">Verificando sessão...</div>
      </main>
    )
  }

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card">
        <p className="eyebrow">Invest RS</p>
        <h1>Painel de cartões digitais</h1>
        <p>Entre com seu e-mail institucional para gerenciar cartões de visitas digitais.</p>

        <form onSubmit={handleSubmit}>
          <label>
            E-mail institucional
            <span className="email-suffix-field">
              <input
                className="email-suffix-input"
                required
                type="text"
                autoComplete="username"
                value={emailPrefix}
                onChange={(event) => setEmailPrefix(normalizeInvestEmailInput(event.target.value))}
                placeholder="seu.nome"
              />
              <span className="email-suffix-label">{INVEST_EMAIL_DOMAIN}</span>
            </span>
          </label>

          <button className="primary-button" type="submit" disabled={loading || !emailPrefix}>
            {loading ? 'Enviando...' : 'Enviar link de acesso'}
          </button>
        </form>

        {message ? <p className="admin-success">{message}</p> : null}
        {error ? <p className="admin-error">{error}</p> : null}
      </section>
    </main>
  )
}
