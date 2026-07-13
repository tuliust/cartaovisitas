import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBrandSettings } from '../contexts/BrandSettingsContext'
import { useVisualMode } from '../contexts/VisualModeContext'
import { getCurrentSession } from '../lib/auth'
import { getVariantLogo } from '../lib/cardVisualVariants'
import { getMyCard } from '../lib/myCard'

export default function MyCardRedirectPage() {
  const navigate = useNavigate()
  const { settings } = useBrandSettings()
  const { visualMode } = useVisualMode()

  useEffect(() => {
    void (async () => {
      if (!(await getCurrentSession())) {
        navigate('/entrar', { replace: true })
        return
      }

      const card = await getMyCard()
      navigate(card ? `/${card.slug}` : '/meu-cartao/editar', { replace: true })
    })().catch(() => navigate('/entrar', { replace: true }))
  }, [navigate])

  return (
    <main className="admin-login-shell auth-page-shell admin-state-shell">
      <section className="admin-login-card auth-page-card auth-page-status admin-state-card" role="status" aria-live="polite">
        <img
          className="auth-logo auth-page-logo"
          src={getVariantLogo(settings, visualMode)}
          alt="Invest RS"
        />
        <p className="admin-state-message">Carregando seu cartão...</p>
      </section>
    </main>
  )
}
