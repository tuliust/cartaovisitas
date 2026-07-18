import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import PublicCardVisual, { PublicCardLanguageToggle } from '../../components/PublicCardVisual'
import { useToast } from '../../contexts/ToastContext'
import { getAdminCardById, type AdminBusinessCard } from '../../lib/adminCards'
import { getCurrentSession } from '../../lib/auth'
import { getFriendlyErrorMessage } from '../../lib/errors'
import { getStoredPublicCardLanguage, storePublicCardLanguage, type PublicCardLanguage } from '../../lib/publicCardLocale'
import { requireAdmin } from '../../lib/roles'
import { generateVCard } from '../../lib/vcard'

export default function AdminCardViewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [card, setCard] = useState<AdminBusinessCard | null>(null)
  const [language, setLanguage] = useState<PublicCardLanguage>(getStoredPublicCardLanguage)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [booting, setBooting] = useState(true)
  const [error, setError] = useState('')
  const qrValue = useMemo(() => card ? generateVCard(card) : '', [card])

  useEffect(() => {
    let mounted = true
    let accessValidated = false

    void (async () => {
      if (!(await getCurrentSession())) {
        navigate('/admin/login', { replace: true })
        return
      }
      await requireAdmin()
      accessValidated = true
      if (!id) throw new Error('Cartão não informado.')
      const selectedCard = await getAdminCardById(id)
      if (!selectedCard) throw new Error('Cartão não encontrado.')
      if (mounted) setCard(selectedCard)
    })().catch((reason) => {
      if (!mounted) return
      if (!accessValidated) {
        navigate('/admin/login', { replace: true })
        return
      }
      const message = getFriendlyErrorMessage(reason)
      setError(message)
      toast.error(message)
    }).finally(() => {
      if (mounted) setBooting(false)
    })

    return () => { mounted = false }
  }, [id, navigate, toast])

  useEffect(() => {
    if (!qrValue) return
    void QRCode.toDataURL(qrValue, { width: 360, margin: 1, errorCorrectionLevel: 'M' })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(''))
  }, [qrValue])

  function changeLanguage(nextLanguage: PublicCardLanguage) {
    setLanguage(nextLanguage)
    storePublicCardLanguage(nextLanguage)
  }

  if (booting) return <main className="admin-login-shell admin-state-shell"><div className="admin-login-card admin-state-card" role="status" aria-live="polite"><p className="admin-state-message">Verificando acesso...</p></div></main>

  return <AdminLayout
    title={card ? `Visualizar cartão de ${card.display_name || card.full_name}` : 'Visualizar cartão'}
    subtitle="Prévia administrativa somente para consulta."
    action={<button className="secondary-button" type="button" onClick={() => window.history.state?.idx > 0 ? navigate(-1) : navigate('/admin/usuarios')}>Voltar</button>}
  >
    {error ? <p className="admin-error" role="alert">{error}</p> : null}
    {card ? <section className="admin-card-view" aria-label={`Cartão de ${card.display_name || card.full_name}`}>
      <div className="admin-card-view-toolbar">
        <PublicCardLanguageToggle language={language} onChange={changeLanguage} />
      </div>
      <div className="digital-card collaborator-own-card admin-card-view-canvas">
        <PublicCardVisual
          card={card}
          language={language}
          variant={card.public_visual_variant ?? 'dark_black'}
          qrDataUrl={qrDataUrl}
        />
      </div>
    </section> : null}
  </AdminLayout>
}
