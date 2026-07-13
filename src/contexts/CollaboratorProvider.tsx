import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { getCurrentSession, signOut } from '../lib/auth'
import type { AdminBusinessCard } from '../lib/adminCards'
import { getFriendlyErrorMessage } from '../lib/errors'
import { getMyCard } from '../lib/myCard'
import { requireActiveUser } from '../lib/roles'
import { useToast } from './ToastContext'
import { CollaboratorContext } from './CollaboratorContext'

type CollaboratorProviderProps = { children: ReactNode; required?: boolean }

export function CollaboratorProvider({ children, required = true }: CollaboratorProviderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const [card, setCard] = useState<AdminBusinessCard | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [redirect, setRedirect] = useState('')

  const refreshCard = useCallback(async () => {
    const nextCard = await getMyCard()
    setCard(nextCard)
    return nextCard
  }, [])

  const logout = useCallback(async () => {
    await signOut().catch(() => undefined)
    navigate('/entrar', { replace: true })
  }, [navigate])

  useEffect(() => {
    let mounted = true
    void (async () => {
      const session = await getCurrentSession()
      if (!session) {
        if (mounted) { setAuthenticated(false); setLoading(false); if (required) setRedirect('/entrar') }
        return
      }
      await requireActiveUser()
      const ownCard = await getMyCard()
      if (mounted) { setAuthenticated(true); setCard(ownCard); setLoading(false) }
    })().catch(async (error) => {
      if (!mounted) return
      const message = getFriendlyErrorMessage(error)
      toast.error(message)
      await signOut().catch(() => undefined)
      setAuthenticated(false)
      setLoading(false)
      if (required) setRedirect('/entrar')
    })
    return () => { mounted = false }
  }, [required, toast])

  const value = useMemo(() => ({ card, loading, authenticated, refreshCard, logout }), [authenticated, card, loading, logout, refreshCard])

  if (redirect) return <Navigate to={redirect} replace state={{ from: location.pathname }} />
  if (loading) return <main className="admin-login-shell admin-state-shell"><div className="admin-login-card admin-state-card" role="status" aria-live="polite"><p className="admin-state-message">Verificando acesso...</p></div></main>
  return <CollaboratorContext.Provider value={value}>{children}</CollaboratorContext.Provider>
}
