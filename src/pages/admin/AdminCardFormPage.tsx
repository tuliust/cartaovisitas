import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import CardForm from '../../components/admin/CardForm'
import CardPreview from '../../components/admin/CardPreview'
import { getCurrentSession } from '../../lib/auth'
import { requireAdmin } from '../../lib/roles'
import { getFriendlyErrorMessage } from '../../lib/errors'
import {
  createAdminCard,
  defaultCardFormValues,
  getAdminCardById,
  toCardFormValues,
  updateAdminCard,
  type CardFormValues,
} from '../../lib/adminCards'
import { useToast } from '../../contexts/ToastContext'
import { recordAuditLog } from '../../lib/audit'

export default function AdminCardFormPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const isEditing = Boolean(id)

  const [booting, setBooting] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [initialValues, setInitialValues] = useState<CardFormValues>({
    ...defaultCardFormValues,
  })
  const [previewValues, setPreviewValues] = useState<CardFormValues>({
    ...defaultCardFormValues,
  })
  const [desktopActionsTarget, setDesktopActionsTarget] = useState<HTMLDivElement | null>(null)
  const formId = 'admin-card-form'

  useEffect(() => {
    async function checkAccessAndLoadCard() {
      try {
        const session = await getCurrentSession()

        if (!session) {
          navigate('/admin/login', { replace: true })
          return
        }
        await requireAdmin()

        if (id) {
          const card = await getAdminCardById(id)

          if (!card) {
            throw new Error('Cartão não encontrado.')
          }

          const values = toCardFormValues(card)
          setInitialValues(values)
          setPreviewValues(values)
        }

        if (!id) {
          const email = searchParams.get('email') || ''
          const fullName = searchParams.get('name') || ''
          if (email || fullName) {
            const values = { ...defaultCardFormValues, email, full_name: fullName }
            setInitialValues(values)
            setPreviewValues(values)
          }
        }
        setBooting(false)
      } catch {
        navigate('/admin/login', { replace: true })
      }
    }

    void checkAccessAndLoadCard()
  }, [id, navigate, searchParams])

  async function handleSubmit(values: CardFormValues) {
    setSaving(true)
    setError('')

    try {
      if (isEditing && id) {
        const card = await updateAdminCard(id, values)
        await recordAuditLog({ action: 'card_updated', targetType: 'business_card', targetId: card.id, targetLabel: card.slug, afterData: card })
      } else {
        const card = await createAdminCard(values)
        await recordAuditLog({ action: 'card_created', targetType: 'business_card', targetId: card.id, targetLabel: card.slug, afterData: card })
      }

      toast.success(isEditing ? 'Cartão atualizado com sucesso.' : 'Cartão criado com sucesso.')
      navigate('/admin/cartoes')
    } catch (err) {
      const message = getFriendlyErrorMessage(err)
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  if (booting) {
    return (
      <main className="admin-login-shell admin-state-shell">
        <div className="admin-login-card admin-state-card" role="status">Carregando formulário...</div>
      </main>
    )
  }

  return (
    <AdminLayout
      title={isEditing ? 'Editar cartão' : 'Novo cartão'}
      subtitle={isEditing ? 'Atualize os dados do cartão digital.' : 'Preencha os dados para criar um novo cartão digital.'}
      action={
        <Link className="secondary-button" to="/admin/cartoes">
          Voltar
        </Link>
      }
    >
      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-form-preview-layout admin-card-form-layout">
        <CardForm
          initialValues={initialValues}
          submitLabel={isEditing ? 'Salvar alterações' : 'Criar cartão'}
          loading={saving}
          currentCardId={id}
          onChange={setPreviewValues}
          onSubmit={handleSubmit}
          allowLogoUpload={isEditing}
          formId={formId}
          desktopActionsTarget={desktopActionsTarget}
        />
        <div className="desktop-card-preview">
          <div className="desktop-card-preview-sticky">
            <CardPreview values={previewValues} showStatus={isEditing} />
            <div ref={setDesktopActionsTarget} />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
