import { useEffect, useRef, useState } from 'react'
import CardForm from '../components/admin/CardForm'
import CardPreview from '../components/admin/CardPreview'
import CardPreviewModal from '../components/admin/CardPreviewModal'
import CollaboratorLayout from '../components/collaborator/CollaboratorLayout'
import { useCollaborator } from '../contexts/CollaboratorContext'
import { useToast } from '../contexts/ToastContext'
import { useVisualMode } from '../contexts/VisualModeContext'
import { defaultCardFormValues, type CardFormValues } from '../lib/adminCards'
import { getFriendlyErrorMessage } from '../lib/errors'
import { createMyCardDraft, toMyCardFormValues, upsertMyCard } from '../lib/myCard'

export default function MyCardEditPage() {
  const { card, refreshCard } = useCollaborator()
  const toast = useToast()
  const { setVisualMode } = useVisualMode()
  const [booting, setBooting] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [cardId, setCardId] = useState(card?.id ?? '')
  const [values, setValues] = useState<CardFormValues>({ ...defaultCardFormValues })
  const [preview, setPreview] = useState<CardFormValues>({ ...defaultCardFormValues })
  const [previewOpen, setPreviewOpen] = useState(false)
  const [desktopActionsTarget, setDesktopActionsTarget] = useState<HTMLDivElement | null>(null)
  const previewButtonRef = useRef<HTMLButtonElement>(null)
  const formId = 'employee-card-edit-form'

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
      setVisualMode(current.public_visual_variant)
      await refreshCard()
      toast.success('Cartão salvo com sucesso.')
    } catch (error) { const message = getFriendlyErrorMessage(error); setError(message); toast.error(message) }
    finally { setSaving(false) }
  }

  return <CollaboratorLayout title="Editar meu cartão" subtitle="Atualize os dados exibidos em sua página e nos arquivos de contato.">
    {booting ? <div className="state-card" role="status">Carregando formulário...</div> : <>
      {error ? <p className="admin-error" role="alert">{error}</p> : null}
      <div className="admin-form-preview-layout collaborator-card-layout">
        <CardForm initialValues={values} submitLabel="Salvar alterações" loading={saving} currentCardId={cardId || undefined} onChange={setPreview} onSubmit={save} mode="employee" lockedEmail={values.email} allowStatusEdit={false} allowLogoUpload={false} allowAvatarUpload lockInstitutionalFields onPreview={() => setPreviewOpen(true)} previewButtonRef={previewButtonRef} formId={formId} autoGenerateSlug={!cardId} desktopActionsTarget={desktopActionsTarget} />
        <div className="desktop-card-preview">
          <div className="desktop-card-preview-sticky">
            <CardPreview values={preview} showStatus={false} />
            <div ref={setDesktopActionsTarget} />
          </div>
        </div>
      </div>
      {previewOpen ? <CardPreviewModal values={preview} showStatus={false} onClose={() => setPreviewOpen(false)} returnFocusRef={previewButtonRef} /> : null}
    </>}
  </CollaboratorLayout>
}
