import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import CardForm from '../../components/admin/CardForm'
import CardPreview from '../../components/admin/CardPreview'
import { getCurrentSession, isInvestRsEmail } from '../../lib/auth'
import { getFriendlyErrorMessage } from '../../lib/errors'
import {
  createAdminCard,
  defaultCardFormValues,
  getAdminCardById,
  toCardFormValues,
  updateAdminCard,
  type CardFormValues,
} from '../../lib/adminCards'

export default function AdminCardFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
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

  useEffect(() => {
    async function checkAccessAndLoadCard() {
      try {
        const session = await getCurrentSession()

        if (!session || !isInvestRsEmail(session.user.email)) {
          navigate('/admin/login', { replace: true })
          return
        }

        if (id) {
          const card = await getAdminCardById(id)

          if (!card) {
            throw new Error('Cartão não encontrado.')
          }

          const values = toCardFormValues(card)
          setInitialValues(values)
          setPreviewValues(values)
        }

        setBooting(false)
      } catch (err) {
        setError(getFriendlyErrorMessage(err))
        setBooting(false)
      }
    }

    void checkAccessAndLoadCard()
  }, [id, navigate])

  async function handleSubmit(values: CardFormValues) {
    setSaving(true)
    setError('')

    try {
      if (isEditing && id) {
        await updateAdminCard(id, values)
      } else {
        await createAdminCard(values)
      }

      navigate('/admin/cartoes')
    } catch (err) {
      setError(getFriendlyErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (booting) {
    return (
      <main className="admin-login-shell">
        <div className="admin-login-card">Carregando formulário...</div>
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

      <div className="admin-form-preview-layout">
        <CardForm
          initialValues={initialValues}
          submitLabel={isEditing ? 'Salvar alterações' : 'Criar cartão'}
          loading={saving}
          onChange={setPreviewValues}
          onSubmit={handleSubmit}
        />
        <CardPreview values={previewValues} />
      </div>
    </AdminLayout>
  )
}
