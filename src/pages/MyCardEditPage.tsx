import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CardForm from '../components/admin/CardForm'
import CardPreview from '../components/admin/CardPreview'
import { getCurrentSession, signOut } from '../lib/auth'
import { defaultCardFormValues, type CardFormValues } from '../lib/adminCards'
import { getFriendlyErrorMessage } from '../lib/errors'
import { createMyCardDraft, getMyCard, toMyCardFormValues, upsertMyCard } from '../lib/myCard'
import { useToast } from '../contexts/ToastContext'
import { requireActiveUser } from '../lib/roles'

export default function MyCardEditPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [booting, setBooting] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedSlug, setSavedSlug] = useState('')
  const [cardId, setCardId] = useState('')
  const [values, setValues] = useState<CardFormValues>({ ...defaultCardFormValues })
  const [preview, setPreview] = useState<CardFormValues>({ ...defaultCardFormValues })

  useEffect(() => {
    void (async () => {
      const session = await getCurrentSession()
      if (!session) return navigate('/entrar', { replace: true })
      await requireActiveUser()
      const card = await getMyCard()
      const initial = card ? toMyCardFormValues(card) : await createMyCardDraft()
      setValues(initial)
      setPreview(initial)
      setSavedSlug(card?.slug ?? '')
      setCardId(card?.id ?? '')
      setBooting(false)
    })().catch(async (err) => { const message = getFriendlyErrorMessage(err); setError(message); toast.error(message); await signOut().catch(() => undefined); navigate('/entrar', { replace: true }); setBooting(false) })
  }, [navigate, toast])

  async function save(form: CardFormValues) {
    setSaving(true); setError('')
    try {
      const card = await upsertMyCard(form)
      const current = toMyCardFormValues(card)
      setValues(current); setPreview(current); setSavedSlug(card.slug); setCardId(card.id)
      toast.success('Cartão salvo com sucesso.')
    } catch (err) { const message = getFriendlyErrorMessage(err); setError(message); toast.error(message) } finally { setSaving(false) }
  }

  async function logout() { await signOut(); navigate('/entrar', { replace: true }) }

  if (booting) return <main className="admin-login-shell"><div className="admin-login-card">Carregando formulário...</div></main>

  return <main className="admin-shell">
    <header className="admin-topbar"><Link className="admin-brand" to="/">Invest RS</Link><nav className="admin-nav">{savedSlug ? <Link to={`/${savedSlug}`}>Ver meu cartão</Link> : null}<button type="button" onClick={() => void logout()}>Sair</button></nav></header>
    <section className="admin-page">
      <div className="admin-page-header"><div><p className="eyebrow">Área do colaborador</p><h1>Meu cartão</h1><p>Atualize os dados do seu cartão digital.</p></div>{savedSlug ? <Link className="secondary-button" to={`/${savedSlug}`}>Ver meu cartão</Link> : null}</div>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-form-preview-layout">
        <CardForm initialValues={values} submitLabel="Salvar alterações" loading={saving} currentCardId={cardId || undefined} onChange={setPreview} onSubmit={save} mode="employee" lockedEmail={values.email} allowStatusEdit={false} allowLogoUpload={false} allowAvatarUpload lockInstitutionalFields />
        <CardPreview values={preview} />
      </div>
    </section>
  </main>
}
