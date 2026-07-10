import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { getCurrentSession } from '../../lib/auth'
import { requireAdmin } from '../../lib/roles'
import { deleteAdminCard, listAdminCards, setAdminCardActive, type AdminBusinessCard } from '../../lib/adminCards'
import { getFriendlyErrorMessage } from '../../lib/errors'
import { downloadQrCodePng } from '../../lib/qrcode'
import { emptyCardAnalytics, getAnalyticsForCards, type CardAnalyticsSummary } from '../../lib/adminAnalytics'
import { recordCardEvent } from '../../lib/cards'

function formatDate(value: string | null) {
  if (!value) {
    return '-'
  }

  return new Date(value).toLocaleDateString('pt-BR')
}

const countFormatter = new Intl.NumberFormat('pt-BR')

function formatCount(value: number) {
  return countFormatter.format(value)
}

function formatRelativeDate(value: string | null) {
  if (!value) return 'Nunca'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Nunca'

  const today = new Date()
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()

  if (isToday) {
    return `Hoje, ${new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(date)}`
  }

  return new Intl.DateTimeFormat('pt-BR').format(date)
}

type StatusFilter = 'all' | 'active' | 'inactive'
type SortOption = 'name-asc' | 'name-desc' | 'created-desc' | 'updated-desc' | 'status'

function normalizeSearchValue(value: string | null | undefined) {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
}

function getCardName(card: AdminBusinessCard) {
  return card.display_name || card.full_name
}

function getTimestamp(value: string | null) {
  if (!value) return 0
  const timestamp = new Date(value).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

export default function AdminCardsPage() {
  const navigate = useNavigate()
  const [booting, setBooting] = useState(true)
  const [loading, setLoading] = useState(false)
  const [cards, setCards] = useState<AdminBusinessCard[]>([])
  const [analytics, setAnalytics] = useState<Record<string, CardAnalyticsSummary>>({})
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortOption, setSortOption] = useState<SortOption>('updated-desc')
  const [deleteTarget, setDeleteTarget] = useState<AdminBusinessCard | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [deleting, setDeleting] = useState(false)

  const visibleCards = useMemo(() => {
    const term = normalizeSearchValue(search.trim())
    const filtered = cards.filter((card) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? card.is_active : !card.is_active)
      const searchableText = normalizeSearchValue([
        card.full_name,
        card.display_name,
        card.email,
        card.slug,
        card.job_title,
        card.department,
      ].filter(Boolean).join(' '))

      return matchesStatus && (!term || searchableText.includes(term))
    })

    return filtered.sort((first, second) => {
      const firstName = getCardName(first)
      const secondName = getCardName(second)

      switch (sortOption) {
        case 'name-asc':
          return firstName.localeCompare(secondName, 'pt-BR', { sensitivity: 'base' })
        case 'name-desc':
          return secondName.localeCompare(firstName, 'pt-BR', { sensitivity: 'base' })
        case 'created-desc':
          return getTimestamp(second.created_at) - getTimestamp(first.created_at)
        case 'status':
          return Number(second.is_active) - Number(first.is_active) || firstName.localeCompare(secondName, 'pt-BR', { sensitivity: 'base' })
        case 'updated-desc':
        default:
          return getTimestamp(second.updated_at ?? second.created_at) - getTimestamp(first.updated_at ?? first.created_at)
      }
    })
  }, [cards, search, sortOption, statusFilter])

  async function loadCards() {
    setLoading(true)
    setError('')

    try {
      const data = await listAdminCards()
      const summaries = await getAnalyticsForCards(data.map((card) => card.id))
      setCards(data)
      setAnalytics(summaries)
    } catch (err) {
      setError(getFriendlyErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function checkAccess() {
      try {
        const session = await getCurrentSession()

        if (!session) {
          navigate('/admin/login', { replace: true })
          return
        }
        await requireAdmin()

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
    if (
      card.is_active &&
      !window.confirm(
        `Tem certeza que deseja desativar o cartão de ${card.display_name || card.full_name}? A página pública, o QR Code e o vCard deixarão de funcionar enquanto ele estiver inativo.`,
      )
    ) {
      return
    }

    try {
      setError('')
      await setAdminCardActive(card.id, !card.is_active)
      await loadCards()
    } catch (err) {
      setError(getFriendlyErrorMessage(err))
    }
  }

  async function handleDownloadQrCode(card: AdminBusinessCard) {
    try {
      setError('')
      await downloadQrCodePng(`${window.location.origin}/api/vcard/${card.slug}`, `qr-code-${card.slug}.png`)
      if (await recordCardEvent(card.id, 'qr')) {
        setAnalytics((current) => ({
          ...current,
          [card.id]: {
            ...(current[card.id] ?? emptyCardAnalytics),
            qr_count: (current[card.id]?.qr_count ?? 0) + 1,
          },
        }))
      }
    } catch (err) {
      setError(getFriendlyErrorMessage(err))
    }
  }

  async function handleDelete() {
    if (!deleteTarget || deleteConfirmation !== deleteTarget.slug) return
    setDeleting(true)
    setError('')
    try {
      await deleteAdminCard(deleteTarget.id)
      setDeleteTarget(null)
      setDeleteConfirmation('')
      await loadCards()
    } catch (err) {
      setError(getFriendlyErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  function renderActions(card: AdminBusinessCard) {
    const publicUrl = `${window.location.origin}/${card.slug}`
    const vcardUrl = `${window.location.origin}/api/vcard/${card.slug}`

    return (
      <div className="admin-actions">
        <Link to={`/admin/cartoes/${card.id}/editar`}>Editar</Link>
        <a href={publicUrl} target="_blank" rel="noreferrer">
          Abrir
        </a>
        <button type="button" onClick={() => copyToClipboard(publicUrl, 'Link público copiado.')}>
          Copiar link
        </button>
        <button type="button" onClick={() => copyToClipboard(vcardUrl, 'Link do vCard copiado.')}>
          Copiar vCard
        </button>
        <button type="button" onClick={() => handleDownloadQrCode(card)}>
          Baixar QR Code
        </button>
        <button type="button" onClick={() => handleToggleActive(card)}>
          {card.is_active ? 'Desativar' : 'Ativar'}
        </button>
        <button className="danger-action" type="button" onClick={() => { setDeleteTarget(card); setDeleteConfirmation('') }}>
          Apagar
        </button>
      </div>
    )
  }

  function getAnalytics(cardId: string) {
    return analytics[cardId] ?? emptyCardAnalytics
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
          <strong>{visibleCards.length} de {cards.length} cartão(ões)</strong>
          <button className="secondary-button compact-button" type="button" onClick={loadCards}>
            Atualizar
          </button>
        </div>

        {cards.length > 0 ? (
          <div className="admin-list-controls" role="search" aria-label="Buscar e organizar cartões">
            <label className="admin-search-field">
              <span>Busca</span>
              <input
                className="admin-search-input"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nome, e-mail ou slug"
              />
            </label>
            <label>
              <span>Status</span>
              <select className="admin-filter-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}>
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </label>
            <label>
              <span>Ordenar por</span>
              <select className="admin-sort-select" value={sortOption} onChange={(event) => setSortOption(event.target.value as SortOption)}>
                <option value="name-asc">Nome A–Z</option>
                <option value="name-desc">Nome Z–A</option>
                <option value="created-desc">Mais recentes</option>
                <option value="updated-desc">Atualizados recentemente</option>
                <option value="status">Status</option>
              </select>
            </label>
          </div>
        ) : null}

        {loading ? <p>Carregando cartões...</p> : null}

        {!loading && cards.length === 0 ? (
          <div className="admin-empty">
            <p>Nenhum cartão cadastrado ainda.</p>
            <Link className="primary-button" to="/admin/cartoes/novo">
              Criar primeiro cartão
            </Link>
          </div>
        ) : null}

        {!loading && cards.length > 0 && visibleCards.length === 0 ? (
          <div className="admin-empty admin-filter-empty">
            <p>Nenhum cartão encontrado para os filtros selecionados.</p>
          </div>
        ) : null}

        {!loading && visibleCards.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Cargo</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Criado em</th>
                  <th>Views</th>
                  <th>vCard</th>
                  <th>Compart. / QR</th>
                  <th>Visto em</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {visibleCards.map((card) => (
                  <tr key={card.id}>
                    <td>
                      <strong>{card.display_name || card.full_name}</strong>
                      {card.email ? <small>{card.email}</small> : null}
                    </td>
                    <td>{card.job_title || '-'}</td>
                    <td className="admin-slug-cell" title={card.slug}>{card.slug}</td>
                    <td>
                      <span className={card.is_active ? 'status-pill active' : 'status-pill inactive'}>
                        {card.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>{formatDate(card.created_at)}</td>
                    <td>{formatCount(getAnalytics(card.id).view_count)}</td>
                    <td>{formatCount(getAnalytics(card.id).vcard_count)}</td>
                    <td>
                      <span className="admin-analytics-pair">
                        {formatCount(getAnalytics(card.id).share_count)} / {formatCount(getAnalytics(card.id).qr_count)}
                      </span>
                    </td>
                    <td>{formatRelativeDate(getAnalytics(card.id).last_view_at)}</td>
                    <td>{renderActions(card)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="admin-mobile-cards">
              {visibleCards.map((card) => (
                <article className="admin-mobile-card" key={card.id}>
                  <div className="admin-mobile-card-heading">
                    <strong>{card.display_name || card.full_name}</strong>
                    <span className={card.is_active ? 'status-pill active' : 'status-pill inactive'}>
                      {card.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p>{card.job_title || 'Cargo não informado'}</p>
                  <small className="admin-card-slug" title={card.slug}>/{card.slug}</small>
                  <div className="admin-mobile-analytics" aria-label="Métricas de uso">
                    <span><strong>{formatCount(getAnalytics(card.id).view_count)}</strong> views</span>
                    <span><strong>{formatCount(getAnalytics(card.id).vcard_count)}</strong> vCards</span>
                    <span><strong>{formatCount(getAnalytics(card.id).share_count)}</strong> compartilhamentos</span>
                    <span><strong>{formatCount(getAnalytics(card.id).qr_count)}</strong> QR Codes</span>
                    <span className="admin-mobile-last-view">Visto em: <strong>{formatRelativeDate(getAnalytics(card.id).last_view_at)}</strong></span>
                  </div>
                  {renderActions(card)}
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      {deleteTarget ? (
        <div className="confirmation-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !deleting) setDeleteTarget(null) }}>
          <section className="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="delete-card-title">
            <h2 id="delete-card-title">Apagar cartão permanentemente?</h2>
            <p>Esta ação é permanente e removerá os dados do cartão e seus eventos associados.</p>
            <label>Digite <strong>{deleteTarget.slug}</strong> para confirmar<input autoFocus value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)} /></label>
            <div className="confirmation-actions">
              <button className="secondary-button" type="button" disabled={deleting} onClick={() => setDeleteTarget(null)}>Cancelar</button>
              <button className="danger-button" type="button" disabled={deleting || deleteConfirmation !== deleteTarget.slug} onClick={() => void handleDelete()}>{deleting ? 'Apagando...' : 'Apagar'}</button>
            </div>
          </section>
        </div>
      ) : null}
    </AdminLayout>
  )
}
