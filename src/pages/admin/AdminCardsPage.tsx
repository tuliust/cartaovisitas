import { useCallback, useEffect, useMemo, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { getCurrentSession } from '../../lib/auth'
import { requireAdmin } from '../../lib/roles'
import { deleteAdminCard, listAdminCards, setAdminCardActive, type AdminBusinessCard } from '../../lib/adminCards'
import { getFriendlyErrorMessage } from '../../lib/errors'
import { downloadQrCodePng } from '../../lib/qrcode'
import { emptyCardAnalytics, getAnalyticsForCards, type CardAnalyticsSummary } from '../../lib/adminAnalytics'
import { useToast } from '../../contexts/ToastContext'
import { recordAuditLog } from '../../lib/audit'
import CardImportModal from '../../components/admin/CardImportModal'
import { downloadCardImportTemplate } from '../../lib/cardImport'
import { Ban, CheckCircle2, Copy, ExternalLink, Link as LinkIcon, MoreVertical, Pencil, QrCode, Trash2 } from 'lucide-react'

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
  const toast = useToast()
  const [booting, setBooting] = useState(true)
  const [loading, setLoading] = useState(false)
  const [cards, setCards] = useState<AdminBusinessCard[]>([])
  const [analytics, setAnalytics] = useState<Record<string, CardAnalyticsSummary>>({})
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sortOption, setSortOption] = useState<SortOption>('updated-desc')
  const [deleteTarget, setDeleteTarget] = useState<AdminBusinessCard | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [openActionsMenu, setOpenActionsMenu] = useState<string | null>(null)
  const [upwardActionsMenu, setUpwardActionsMenu] = useState<string | null>(null)
  const [actionsMenuStyle, setActionsMenuStyle] = useState<CSSProperties>({})

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

  const loadCards = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const data = await listAdminCards()
      const summaries = await getAnalyticsForCards(data.map((card) => card.id))
      setCards(data)
      setAnalytics(summaries)
    } catch (err) {
      const message = getFriendlyErrorMessage(err)
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [toast])

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
  }, [loadCards, navigate])

  useEffect(() => {
    if (!openActionsMenu) return

    function closeActionsMenu() {
      setOpenActionsMenu(null)
      setUpwardActionsMenu(null)
      setActionsMenuStyle({})
    }

    function closeOnOutsideClick(event: MouseEvent) {
      const target = event.target
      if (target instanceof Element && !target.closest('[data-admin-actions-root]')) {
        closeActionsMenu()
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeActionsMenu()
      }
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    window.addEventListener('resize', closeActionsMenu)
    window.addEventListener('scroll', closeActionsMenu, true)

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('resize', closeActionsMenu)
      window.removeEventListener('scroll', closeActionsMenu, true)
    }
  }, [openActionsMenu])

  function toggleActionsMenu(event: ReactMouseEvent<HTMLButtonElement>, menuKey: string) {
    if (openActionsMenu === menuKey) {
      setOpenActionsMenu(null)
      setUpwardActionsMenu(null)
      setActionsMenuStyle({})
      return
    }

    const triggerRect = event.currentTarget.getBoundingClientRect()
    const estimatedMenuHeight = 320
    const menuWidth = 220
    const spaceBelow = window.innerHeight - triggerRect.bottom
    const spaceAbove = triggerRect.top
    const shouldOpenUpward = spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow
    const left = Math.min(window.innerWidth - menuWidth - 12, Math.max(12, triggerRect.right - menuWidth))
    const top = shouldOpenUpward ? Math.max(12, triggerRect.top - estimatedMenuHeight - 8) : Math.min(window.innerHeight - 12, triggerRect.bottom + 8)

    setUpwardActionsMenu(shouldOpenUpward ? menuKey : null)
    setActionsMenuStyle({ position: 'fixed', top, left, right: 'auto' })
    setOpenActionsMenu(menuKey)
  }

  async function copyToClipboard(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(label)
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err))
    }
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
      await recordAuditLog({ action: card.is_active ? 'card_deactivated' : 'card_activated', targetType: 'business_card', targetId: card.id, targetLabel: card.slug, beforeData: { is_active: card.is_active }, afterData: { is_active: !card.is_active } })
      await loadCards()
      toast.success(card.is_active ? 'Cartão desativado com sucesso.' : 'Cartão ativado com sucesso.')
    } catch (err) {
      const message = getFriendlyErrorMessage(err)
      setError(message)
      toast.error(message)
    }
  }

  async function handleDownloadQrCode(card: AdminBusinessCard) {
    try {
      setError('')
      await downloadQrCodePng(`${window.location.origin}/qr/${card.slug}?lang=pt`, `qr-code-${card.slug}.png`)
      toast.success('QR Code baixado com sucesso.')
    } catch (err) {
      const message = getFriendlyErrorMessage(err)
      setError(message)
      toast.error(message)
    }
  }

  async function handleDelete() {
    if (!deleteTarget || deleteConfirmation !== deleteTarget.slug) return
    setDeleting(true)
    setError('')
    try {
      await deleteAdminCard(deleteTarget.id)
      await recordAuditLog({ action: 'card_deleted', targetType: 'business_card', targetId: deleteTarget.id, targetLabel: deleteTarget.slug, beforeData: deleteTarget })
      setDeleteTarget(null)
      setDeleteConfirmation('')
      await loadCards()
      toast.success('Cartão apagado com sucesso.')
    } catch (err) {
      const message = getFriendlyErrorMessage(err)
      setError(message)
      toast.error(message)
    } finally {
      setDeleting(false)
    }
  }

  function renderActions(card: AdminBusinessCard, placement: 'desktop' | 'mobile') {
    const publicUrl = `${window.location.origin}/${card.slug}`
    const vcardUrl = `${window.location.origin}/api/vcard/${card.slug}`
    const menuKey = `${placement}-${card.id}`
    const menuId = `card-actions-menu-${placement}-${card.id}`
    const isOpen = openActionsMenu === menuKey
    const cardName = card.display_name || card.full_name

    return (
      <div
        className={`admin-actions-menu-root${isOpen ? ' is-open' : ''}${upwardActionsMenu === menuKey ? ' opens-upward' : ''}`}
        data-admin-actions-root
      >
        <button
          className="admin-actions-trigger"
          type="button"
          aria-label={`Abrir ações do cartão de ${cardName}`}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls={menuId}
          title="Ações"
          onClick={(event) => toggleActionsMenu(event, menuKey)}
        >
          <MoreVertical aria-hidden="true" />
        </button>

        {isOpen ? createPortal(
          <div
            className="admin-actions-popover"
            style={actionsMenuStyle}
            data-admin-actions-root
            id={menuId}
            role="menu"
            aria-label={`Ações do cartão de ${cardName}`}
          >
            <Link
              to={`/admin/cartoes/${card.id}/editar`}
              role="menuitem"
              onClick={() => {
                setOpenActionsMenu(null)
                setUpwardActionsMenu(null)
              }}
            >
              <Pencil aria-hidden="true" />
              <span>Editar</span>
            </Link>

            <Link
              to={`/admin/cartoes/${card.id}/visualizar`}
              target="_blank"
              rel="noreferrer"
              role="menuitem"
              onClick={() => {
                setOpenActionsMenu(null)
                setUpwardActionsMenu(null)
              }}
            >
              <ExternalLink aria-hidden="true" />
              <span>Abrir</span>
            </Link>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpenActionsMenu(null)
                setUpwardActionsMenu(null)
                void copyToClipboard(publicUrl, 'Link público copiado.')
              }}
            >
              <LinkIcon aria-hidden="true" />
              <span>Copiar link</span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpenActionsMenu(null)
                setUpwardActionsMenu(null)
                void copyToClipboard(vcardUrl, 'Link do vCard copiado.')
              }}
            >
              <Copy aria-hidden="true" />
              <span>Copiar vCard</span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpenActionsMenu(null)
                setUpwardActionsMenu(null)
                void handleDownloadQrCode(card)
              }}
            >
              <QrCode aria-hidden="true" />
              <span>Baixar QR Code</span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpenActionsMenu(null)
                setUpwardActionsMenu(null)
                void handleToggleActive(card)
              }}
            >
              {card.is_active ? <Ban aria-hidden="true" /> : <CheckCircle2 aria-hidden="true" />}
              <span>{card.is_active ? 'Desativar' : 'Ativar'}</span>
            </button>

            <button
              className="danger-action"
              type="button"
              role="menuitem"
              onClick={() => {
                setOpenActionsMenu(null)
                setUpwardActionsMenu(null)
                setDeleteTarget(card)
                setDeleteConfirmation('')
              }}
            >
              <Trash2 aria-hidden="true" />
              <span>Apagar</span>
            </button>
          </div>,
          document.body,
        ) : null}
      </div>
    )
  }

  function getAnalytics(cardId: string) {
    return analytics[cardId] ?? emptyCardAnalytics
  }

  if (booting) {
    return (
      <main className="admin-login-shell admin-state-shell">
        <div className="admin-login-card admin-state-card" role="status" aria-live="polite">
          <p className="admin-state-message">Verificando acesso...</p>
        </div>
      </main>
    )
  }

  const cardCountLabel = cards.length === 1 ? 'cartão' : 'cartões'

  return (
    <AdminLayout
      title="Cartões digitais"
      subtitle="Crie, edite e gerencie os cartões institucionais da Invest RS."
      action={
        <div className="admin-header-actions">
          <button className="secondary-button" type="button" onClick={downloadCardImportTemplate}>Baixar modelo</button>
          <button className="secondary-button" type="button" onClick={() => setImportOpen(true)}>Importar planilha</button>
          <Link className="primary-button" to="/admin/cartoes/novo">Novo cartão</Link>
        </div>
      }
    >
      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-card">
        <div className="admin-table-header">
          <strong>{visibleCards.length} de {cards.length} {cardCountLabel}</strong>
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
                  <th>Visto em</th>
                  <th className="admin-actions-heading">Ações</th>
                </tr>
              </thead>

              <tbody>
                {visibleCards.map((card) => (
                  <tr key={card.id}>
                    <td className="admin-name-email-cell">
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
                    <td>{formatRelativeDate(getAnalytics(card.id).last_view_at)}</td>
                    <td className="admin-actions-cell">{renderActions(card, 'desktop')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="admin-mobile-cards">
              {visibleCards.map((card) => (
                <article className="admin-mobile-card" key={card.id}>
                  <div className="admin-mobile-card-heading">
                    <div className="admin-card-mobile-identity">
                      <strong>{card.display_name || card.full_name}</strong>
                      {card.email ? <small>{card.email}</small> : null}
                    </div>
                    <div className="admin-mobile-card-controls">
                      <span className={card.is_active ? 'status-pill active' : 'status-pill inactive'}>
                        {card.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                      {renderActions(card, 'mobile')}
                    </div>
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
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      {deleteTarget ? (
        <div className="confirmation-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !deleting) setDeleteTarget(null) }}>
          <section className="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="delete-card-title" aria-describedby="delete-card-description">
            <h2 id="delete-card-title">Apagar cartão permanentemente?</h2>
            <p id="delete-card-description">Esta ação é permanente e removerá os dados do cartão e seus eventos associados.</p>
            <label htmlFor="delete-card-confirmation">Digite <strong>{deleteTarget.slug}</strong> para confirmar<input id="delete-card-confirmation" autoFocus autoComplete="off" value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)} /></label>
            <div className="confirmation-actions">
              <button className="secondary-button" type="button" disabled={deleting} onClick={() => setDeleteTarget(null)}>Cancelar</button>
              <button className="danger-button" type="button" disabled={deleting || deleteConfirmation !== deleteTarget.slug} onClick={() => void handleDelete()}>{deleting ? 'Apagando...' : 'Apagar'}</button>
            </div>
          </section>
        </div>
      ) : null}
      {importOpen ? <CardImportModal onClose={() => setImportOpen(false)} onImported={loadCards} /> : null}
    </AdminLayout>
  )
}
