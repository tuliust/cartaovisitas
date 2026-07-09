import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { getCurrentSession, isInvestRsEmail } from '../../lib/auth'
import { listAdminCards, setAdminCardActive, type AdminBusinessCard } from '../../lib/adminCards'

function formatDate(value: string | null) {
  if (!value) {
    return '-'
  }

  return new Date(value).toLocaleDateString('pt-BR')
}

export default function AdminCardsPage() {
  const navigate = useNavigate()
  const [booting, setBooting] = useState(true)
  const [loading, setLoading] = useState(false)
  const [cards, setCards] = useState<AdminBusinessCard[]>([])
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  async function loadCards() {
    setLoading(true)
    setError('')

    try {
      const data = await listAdminCards()
      setCards(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Não foi possível carregar os cartões.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function checkAccess() {
      try {
        const session = await getCurrentSession()

        if (!session || !isInvestRsEmail(session.user.email)) {
          navigate('/admin/login', { replace: true })
          return
        }

        setBooting(false)
        await loadCards()
      } catch {
        navigate('/admin/login', { replace: true })
      }
    }

    void checkAccess()
  }, [navigate])

  async function copyToClipboard(text: string, label: string) {
    await navigator.clipboard.writeText(text)
    setCopied(label)

    window.setTimeout(() => {
      setCopied('')
    }, 2000)
  }

  async function handleToggleActive(card: AdminBusinessCard) {
    await setAdminCardActive(card.id, !card.is_active)
    await loadCards()
  }

  if (booting) {
    return (
      <main className="admin-login-shell">
        <div className="admin-login-card">Verificando acesso...</div>
      </main>
    )
  }

  return (
    <AdminLayout
      title="Cartões digitais"
      subtitle="Crie, edite e gerencie os cartões institucionais da Invest RS."
      action={
        <Link className="primary-button" to="/admin/cartoes/novo">
          Novo cartão
        </Link>
      }
    >
      {error ? <p className="admin-error">{error}</p> : null}
      {copied ? <p className="admin-success">{copied}</p> : null}

      <div className="admin-card">
        <div className="admin-table-header">
          <strong>{cards.length} cartão(ões)</strong>
          <button className="secondary-button compact-button" type="button" onClick={loadCards}>
            Atualizar
          </button>
        </div>

        {loading ? <p>Carregando cartões...</p> : null}

        {!loading && cards.length === 0 ? (
          <div className="admin-empty">
            <p>Nenhum cartão cadastrado ainda.</p>
            <Link className="primary-button" to="/admin/cartoes/novo">
              Criar primeiro cartão
            </Link>
          </div>
        ) : null}

        {!loading && cards.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cargo</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Criado em</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {cards.map((card) => {
                  const publicUrl = `${window.location.origin}/${card.slug}`
                  const vcardUrl = `${window.location.origin}/api/vcard/${card.slug}`

                  return (
                    <tr key={card.id}>
                      <td>
                        <strong>{card.display_name || card.full_name}</strong>
                        {card.email ? <small>{card.email}</small> : null}
                      </td>
                      <td>{card.job_title || '-'}</td>
                      <td>{card.slug}</td>
                      <td>
                        <span className={card.is_active ? 'status-pill active' : 'status-pill inactive'}>
                          {card.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>{formatDate(card.created_at)}</td>
                      <td>
                        <div className="admin-actions">
                          <Link to={`/admin/cartoes/${card.id}/editar`}>Editar</Link>
                          <a href={publicUrl} target="_blank" rel="noreferrer">
                            Abrir
                          </a>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(publicUrl, 'Link público copiado.')}
                          >
                            Copiar link
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(vcardUrl, 'Link do vCard copiado.')}
                          >
                            Copiar vCard
                          </button>
                          <button type="button" onClick={() => handleToggleActive(card)}>
                            {card.is_active ? 'Desativar' : 'Ativar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </AdminLayout>
  )
}