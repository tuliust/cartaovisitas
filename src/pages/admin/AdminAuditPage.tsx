import { useCallback, useEffect, useMemo, useState } from 'react'
import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { useToast } from '../../contexts/ToastContext'
import { getCurrentSession } from '../../lib/auth'
import { getAuditLogs, type AuditLog } from '../../lib/audit'
import {
  formatAuditDate,
  formatAuditJson,
  getAuditActionLabel,
  getAuditChangedFields,
  getAuditEventPresentation,
  getAuditSearchText,
  getAuditTargetTypeLabel,
  hasAuditData,
} from '../../lib/auditPresentation'
import { getFriendlyErrorMessage } from '../../lib/errors'
import { requireAdmin } from '../../lib/roles'

function normalizeSearchValue(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
}

function AuditDataBlock({ title, value }: { title: string; value: unknown }) {
  if (!hasAuditData(value)) return null

  return (
    <section className="audit-detail-data-block">
      <h3>{title}</h3>
      <pre>{formatAuditJson(value)}</pre>
    </section>
  )
}

export default function AdminAuditPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [booting, setBooting] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [action, setAction] = useState('all')
  const [target, setTarget] = useState('all')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [detail, setDetail] = useState<AuditLog | null>(null)

  const loadLogs = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      setLogs(await getAuditLogs())
    } catch (loadError) {
      const message = getFriendlyErrorMessage(loadError)
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    async function checkAccess() {
      try {
        if (!(await getCurrentSession())) {
          navigate('/admin/login', { replace: true })
          return
        }

        await requireAdmin()
        setBooting(false)
        await loadLogs()
      } catch {
        navigate('/admin/login', { replace: true })
      }
    }

    void checkAccess()
  }, [loadLogs, navigate])

  useEffect(() => {
    if (!detail) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDetail(null)
      }
    }

    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [detail])

  const actions = useMemo(
    () => [...new Set(logs.map((log) => log.action))]
      .sort((first, second) => getAuditActionLabel(first).localeCompare(getAuditActionLabel(second), 'pt-BR')),
    [logs],
  )

  const targets = useMemo(
    () => [...new Set(logs.map((log) => log.target_type))]
      .sort((first, second) => getAuditTargetTypeLabel(first).localeCompare(getAuditTargetTypeLabel(second), 'pt-BR')),
    [logs],
  )

  const visibleLogs = useMemo(() => {
    const term = normalizeSearchValue(search.trim())

    return logs.filter((log) => {
      const searchableText = normalizeSearchValue(getAuditSearchText(log))
      const date = log.created_at.slice(0, 10)

      return (
        (!term || searchableText.includes(term)) &&
        (action === 'all' || log.action === action) &&
        (target === 'all' || log.target_type === target) &&
        (!start || date >= start) &&
        (!end || date <= end)
      )
    })
  }, [action, end, logs, search, start, target])

  if (booting) {
    return (
      <main className="admin-login-shell admin-state-shell">
        <div className="admin-login-card admin-state-card" role="status">Verificando acesso...</div>
      </main>
    )
  }

  const recordCountLabel = logs.length === 1 ? 'registro' : 'registros'
  const detailPresentation = detail ? getAuditEventPresentation(detail) : null
  const detailChangedFields = detail ? getAuditChangedFields(detail) : []

  return (
    <AdminLayout title="Auditoria" subtitle="Histórico das alterações administrativas.">
      {error ? <p className="admin-error" role="alert">{error}</p> : null}

      <div className="admin-card">
        <div className="admin-table-header">
          <strong>{visibleLogs.length} de {logs.length} {recordCountLabel}</strong>
          <button className="secondary-button compact-button" type="button" onClick={loadLogs} disabled={loading}>
            {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>

        {logs.length > 0 ? (
          <div className="admin-list-controls audit-list-controls" role="search" aria-label="Buscar e filtrar registros de auditoria">
            <label className="admin-search-field">
              <span>Busca</span>
              <input
                className="admin-search-input"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Responsável, evento ou alvo"
              />
            </label>

            <label>
              <span>Ação</span>
              <select
                className="admin-filter-select"
                value={action}
                onChange={(event) => setAction(event.target.value)}
              >
                <option value="all">Todas</option>
                {actions.map((item) => (
                  <option value={item} key={item}>{getAuditActionLabel(item)}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Alvo</span>
              <select
                className="admin-filter-select"
                value={target}
                onChange={(event) => setTarget(event.target.value)}
              >
                <option value="all">Todos</option>
                {targets.map((item) => (
                  <option value={item} key={item}>{getAuditTargetTypeLabel(item)}</option>
                ))}
              </select>
            </label>

            <label>
              <span>De</span>
              <input
                className="admin-filter-select"
                type="date"
                value={start}
                onChange={(event) => setStart(event.target.value)}
              />
            </label>

            <label>
              <span>Até</span>
              <input
                className="admin-filter-select"
                type="date"
                value={end}
                onChange={(event) => setEnd(event.target.value)}
              />
            </label>
          </div>
        ) : null}

        {loading && logs.length === 0 ? <p>Carregando registros de auditoria...</p> : null}

        {!loading && logs.length === 0 ? (
          <div className="admin-empty">
            <p>Nenhum registro de auditoria encontrado.</p>
          </div>
        ) : null}

        {!loading && logs.length > 0 && visibleLogs.length === 0 ? (
          <div className="admin-empty admin-filter-empty">
            <p>Nenhum registro encontrado para os filtros selecionados.</p>
          </div>
        ) : null}

        {!loading && visibleLogs.length > 0 ? (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table admin-audit-table">
                <thead>
                  <tr>
                    <th>Data e hora</th>
                    <th>Responsável</th>
                    <th>Evento</th>
                    <th className="admin-actions-heading">Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleLogs.map((log) => {
                    const presentation = getAuditEventPresentation(log)

                    return (
                      <tr key={log.id}>
                        <td>
                          <time dateTime={log.created_at}>{formatAuditDate(log.created_at)}</time>
                        </td>
                        <td className="admin-audit-actor-cell">
                          <strong>{log.actor_email || 'Sistema'}</strong>
                        </td>
                        <td className="admin-audit-event-cell">
                          <strong>{presentation.title}</strong>
                          <small>{presentation.context}</small>
                        </td>
                        <td className="admin-actions-cell">
                          <button
                            className="secondary-button compact-button audit-detail-button"
                            type="button"
                            onClick={() => setDetail(log)}
                            aria-label={`Ver detalhes de ${presentation.title}`}
                            title="Ver detalhes"
                          >
                            <Eye aria-hidden="true" />
                            <span>Ver detalhes</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="admin-mobile-cards admin-audit-mobile-cards">
              {visibleLogs.map((log) => {
                const presentation = getAuditEventPresentation(log)

                return (
                  <article className="admin-mobile-card admin-audit-mobile-card" key={log.id}>
                    <div className="admin-mobile-card-heading">
                      <div className="admin-audit-event-cell">
                        <strong>{presentation.title}</strong>
                        <small>{presentation.context}</small>
                      </div>

                      <button
                        className="admin-actions-trigger"
                        type="button"
                        onClick={() => setDetail(log)}
                        aria-label={`Ver detalhes de ${presentation.title}`}
                        title="Ver detalhes"
                      >
                        <Eye aria-hidden="true" />
                      </button>
                    </div>

                    <dl className="admin-audit-mobile-meta">
                      <div>
                        <dt>Data e hora</dt>
                        <dd><time dateTime={log.created_at}>{formatAuditDate(log.created_at)}</time></dd>
                      </div>
                      <div>
                        <dt>Responsável</dt>
                        <dd>{log.actor_email || 'Sistema'}</dd>
                      </div>
                    </dl>
                  </article>
                )
              })}
            </div>
          </>
        ) : null}
      </div>

      {detail && detailPresentation ? (
        <div
          className="confirmation-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDetail(null)
          }}
        >
          <section
            className="confirmation-modal audit-detail"
            role="dialog"
            aria-modal="true"
            aria-labelledby="audit-title"
          >
            <h2 id="audit-title">Detalhes da auditoria</h2>

            <dl className="audit-detail-summary">
              <div>
                <dt>Evento</dt>
                <dd><strong>{detailPresentation.title}</strong></dd>
              </div>
              <div>
                <dt>Contexto</dt>
                <dd>{detailPresentation.context}</dd>
              </div>
              <div>
                <dt>Data e hora</dt>
                <dd><time dateTime={detail.created_at}>{formatAuditDate(detail.created_at)}</time></dd>
              </div>
              <div>
                <dt>Responsável</dt>
                <dd>{detail.actor_email || 'Sistema'}</dd>
              </div>
              <div>
                <dt>Ação técnica</dt>
                <dd><code>{detail.action}</code></dd>
              </div>
              <div>
                <dt>Tipo de alvo</dt>
                <dd>{getAuditTargetTypeLabel(detail.target_type)}</dd>
              </div>
            </dl>

            {detailChangedFields.length > 0 ? (
              <section className="audit-detail-changes">
                <h3>Campos alterados</h3>
                <ul>
                  {detailChangedFields.map((field) => <li key={field}><code>{field}</code></li>)}
                </ul>
              </section>
            ) : null}

            <AuditDataBlock title="Dados anteriores" value={detail.before_data} />
            <AuditDataBlock title="Dados posteriores" value={detail.after_data} />
            <AuditDataBlock title="Metadados" value={detail.metadata} />

            <details className="audit-detail-technical">
              <summary>Registro técnico completo</summary>
              <pre>{formatAuditJson(detail)}</pre>
            </details>

            <div className="confirmation-actions audit-detail-actions">
              <button className="secondary-button" type="button" onClick={() => setDetail(null)}>
                Fechar
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </AdminLayout>
  )
}
