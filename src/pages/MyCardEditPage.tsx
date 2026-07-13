import { useEffect, useState } from 'react'
import CardForm from '../components/admin/CardForm'
import CardPreview from '../components/admin/CardPreview'
import CollaboratorLayout from '../components/collaborator/CollaboratorLayout'
import { useCollaborator } from '../contexts/CollaboratorContext'
import { useToast } from '../contexts/ToastContext'
import { defaultCardFormValues, type CardFormValues } from '../lib/adminCards'
import { getFriendlyErrorMessage } from '../lib/errors'
import { createMyCardDraft, toMyCardFormValues, upsertMyCard } from '../lib/myCard'

export default function MyCardEditPage() {
  const { card, refreshCard } = useCollaborator()
  const toast = useToast()
  const [booting, setBooting] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [cardId, setCardId] = useState(card?.id ?? '')
  const [values, setValues] = useState<CardFormValues>({ ...defaultCardFormValues })
  const [preview, setPreview] = useState<CardFormValues>({ ...defaultCardFormValues })

  useEffect(() => {
    let mounted = true
    void (async () => {
      const initial = card ? toMyCardFormValues(card) : await createMyCardDraft()
      if (!mounted) return
      setValues(initial); setPreview(initial); setCardId(card?.id ?? ''); setBooting(false)
    })().catch((error) => { if (mounted) { const message = getFriendlyErrorMessage(error); setError(message); toast.error(message); setBooting(false) } })
    return () => { mounted = false }
  }, [card, toast])

  async function save(form: CardFormValues) {
    setSaving(true); setError('')
    try {
      const saved = await upsertMyCard(form)
      const current = toMyCardFormValues(saved)
      setValues(current); setPreview(current); setCardId(saved.id)
      await refreshCard()
      toast.success('Cartão salvo com sucesso.')
    } catch (error) { const message = getFriendlyErrorMessage(error); setError(message); toast.error(message) }
    finally { setSaving(false) }
  }

  return <CollaboratorLayout title="Editar meu cartão" subtitle="Atualize os dados exibidos em sua página e nos arquivos de contato.">
    {booting ? <div className="state-card" role="status">Carregando formulário...</div> : <>
      {error ? <p className="admin-error" role="alert">{error}</p> : null}
      <div className="admin-form-preview-layout collaborator-card-layout">
        <CardForm initialValues={values} submitLabel="Salvar alterações" loading={saving} currentCardId={cardId || undefined} onChange={setPreview} onSubmit={save} mode="employee" lockedEmail={values.email} allowStatusEdit={false} allowLogoUpload={false} allowAvatarUpload lockInstitutionalFields />
        <CardPreview values={preview} />
      </div>
    </>}
  </CollaboratorLayout>
}
