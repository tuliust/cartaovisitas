import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentSession, signInWithPassword } from '../lib/auth'
import { getFriendlyErrorMessage } from '../lib/errors'
import { buildInvestEmail, INVEST_EMAIL_DOMAIN, normalizeInvestEmailInput } from '../lib/investEmail'
import { getMyCard } from '../lib/myCard'
import { ensureUserProfile } from '../lib/roles'

export default function EmployeeLoginPage() {
  const navigate = useNavigate()
  const [prefix, setPrefix] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { void getCurrentSession().then((s) => { if (s) navigate('/meu-cartao', { replace: true }) }).catch(() => undefined) }, [navigate])
  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError('')
    try { await signInWithPassword(buildInvestEmail(prefix), password); await ensureUserProfile(); const card = await getMyCard(); navigate(card ? `/${card.slug}` : '/meu-cartao/editar', { replace: true }) }
    catch (err) { setError(getFriendlyErrorMessage(err)) } finally { setLoading(false) }
  }
  return <main className="admin-login-shell"><section className="admin-login-card">
    <p className="eyebrow">Invest RS</p><h1>Acessar meu cartão</h1><p>Entre com seu e-mail institucional para acessar seu cartão digital.</p>
    <form onSubmit={submit}><label>E-mail institucional<span className="email-suffix-field"><input required autoComplete="username" value={prefix} onChange={(e) => setPrefix(normalizeInvestEmailInput(e.target.value))} placeholder="seu.nome" /><span className="email-suffix-label">{INVEST_EMAIL_DOMAIN}</span></span></label>
    <label>Senha<input required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label><button className="primary-button" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button></form>
    {error ? <p className="admin-error">{error}</p> : null}<div className="auth-links"><Link to="/cadastro">Ainda não tenho cadastro</Link><Link to="/recuperar-senha">Esqueci minha senha</Link></div>
  </section></main>
}
