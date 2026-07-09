import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentSession, isInvestRsEmail, signInWithMagicLink } from '../../lib/auth'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
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
      await signInWithMagicLink(email)
      setMessage('Enviamos um link de acesso para o seu e-mail institucional.')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Não foi possível enviar o link.'
      setError(errorMessage)
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
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu.nome@investrs.org.br"
            />
          </label>

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar link de acesso'}
          </button>
        </form>

        {message ? <p className="admin-success">{message}</p> : null}
        {error ? <p className="admin-error">{error}</p> : null}
      </section>
    </main>
  )
}