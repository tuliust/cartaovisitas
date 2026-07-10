import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentSession } from '../lib/auth'
import { getMyCard } from '../lib/myCard'
export default function MyCardRedirectPage() { const navigate = useNavigate(); useEffect(() => { void (async () => { if (!(await getCurrentSession())) return navigate('/entrar', { replace: true }); const card = await getMyCard(); navigate(card ? `/${card.slug}` : '/meu-cartao/editar', { replace: true }) })().catch(() => navigate('/entrar', { replace: true })) }, [navigate]); return <main className="admin-login-shell"><div className="admin-login-card">Carregando seu cartão...</div></main> }
