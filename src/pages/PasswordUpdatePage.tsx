import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { updatePassword } from '../lib/auth'
import { getFriendlyErrorMessage } from '../lib/errors'
export default function PasswordUpdatePage() {
  const navigate = useNavigate(); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [loading, setLoading] = useState(false); const [error, setError] = useState('')
  async function submit(e: FormEvent) { e.preventDefault(); if (password !== confirm) return setError('As senhas não coincidem.'); if (password.length < 6) return setError('Use uma senha mais segura.'); setLoading(true); setError(''); try { await updatePassword(password); navigate('/meu-cartao', { replace: true }) } catch (err) { setError(getFriendlyErrorMessage(err)) } finally { setLoading(false) } }
  return <main className="admin-login-shell"><section className="admin-login-card"><p className="eyebrow">Invest RS</p><h1>Definir senha</h1><p>Escolha sua nova senha de acesso.</p><form onSubmit={submit}><label>Nova senha<input required minLength={6} type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label><label>Confirmar nova senha<input required minLength={6} type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></label><button className="primary-button" disabled={loading}>{loading ? 'Salvando...' : 'Definir nova senha'}</button></form>{error ? <p className="admin-error">{error}</p> : null}</section></main>
}
