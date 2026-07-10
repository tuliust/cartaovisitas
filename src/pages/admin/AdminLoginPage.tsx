import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentSession, signInWithPassword, signOut } from '../../lib/auth'
import { getFriendlyErrorMessage } from '../../lib/errors'
import { buildInvestEmail, INVEST_EMAIL_DOMAIN, normalizeInvestEmailInput } from '../../lib/investEmail'
import { isCurrentUserAdmin } from '../../lib/roles'

export default function AdminLoginPage() {
  const navigate = useNavigate(); const [prefix, setPrefix] = useState(''); const [password, setPassword] = useState(''); const [checking, setChecking] = useState(true); const [loading, setLoading] = useState(false); const [error, setError] = useState('')
  useEffect(() => { void (async () => { if (await getCurrentSession() && await isCurrentUserAdmin()) navigate('/admin/cartoes', { replace: true }) })().catch(() => undefined).finally(() => setChecking(false)) }, [navigate])
  async function submit(e: FormEvent) { e.preventDefault(); setLoading(true); setError(''); try { await signInWithPassword(buildInvestEmail(prefix), password); if (!(await isCurrentUserAdmin())) { await signOut(); setError('Seu usuário não tem permissão para acessar a área restrita.'); return } navigate('/admin/cartoes', { replace: true }) } catch (err) { setError(getFriendlyErrorMessage(err)) } finally { setLoading(false) } }
  if (checking) return <main className="admin-login-shell"><div className="admin-login-card">Verificando sessão...</div></main>
  return <main className="admin-login-shell"><section className="admin-login-card"><p className="eyebrow">Invest RS</p><h1>Área Restrita</h1><p>Acesso administrativo aos cartões digitais da Invest RS.</p><form onSubmit={submit}><label>E-mail institucional<span className="email-suffix-field"><input required autoComplete="username" value={prefix} onChange={(e) => setPrefix(normalizeInvestEmailInput(e.target.value))} /><span className="email-suffix-label">{INVEST_EMAIL_DOMAIN}</span></span></label><label>Senha<input required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label><button className="primary-button" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button></form>{error ? <p className="admin-error">{error}</p> : null}<div className="auth-links"><Link to="/recuperar-senha">Esqueci minha senha</Link><Link to="/entrar">Acessar meu cartão</Link></div></section></main>
}
