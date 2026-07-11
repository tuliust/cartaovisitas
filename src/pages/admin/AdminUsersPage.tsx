import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { useToast } from '../../contexts/ToastContext'
import { getCurrentSession } from '../../lib/auth'
import {
  blockUser,
  getAdminUsers,
  inviteAdminUser,
  unblockUser,
  updateUserRole,
  type AdminUser,
  type AdminUserStatus,
} from '../../lib/adminUsers'
import { getFriendlyErrorMessage } from '../../lib/errors'
import { requireAdmin } from '../../lib/roles'
import {
  Ban,
  ExternalLink,
  IdCard,
  LockOpen,
  Mail,
  MoreVertical,
  ShieldCheck,
  ShieldOff,
} from 'lucide-react'

type RoleFilter = 'all' | 'admin' | 'user'
type StatusFilter = 'all' | AdminUserStatus

function getUserDisplayName(user: AdminUser) {
  return user.full_name?.trim() || 'Nome não informado'
}

function getUserRoleLabel(user: AdminUser) {
  return user.role === 'admin' ? 'Admin' : 'Colaborador'
}

function getUserStatusLabel(status: AdminUserStatus) {
  if (status === 'active') return 'Ativo'
  if (status === 'blocked') return 'Bloqueado'
  return 'Pendente'
}

export default function AdminUsersPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<RoleFilter>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [openActionsMenu, setOpenActionsMenu] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)

    try {
      setUsers(await getAdminUsers())
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    void (async () => {
      if (!(await getCurrentSession())) {
        navigate('/admin/login', { replace: true })
        return
      }

      await requireAdmin()
      await load()
    })().catch(() => navigate('/admin/login', { replace: true }))
  }, [load, navigate])

  useEffect(() => {
    if (!openActionsMenu) return

    function closeOnOutsideClick(event: MouseEvent) {
      const target = event.target
      if (target instanceof Element && !target.closest('[data-admin-actions-root]')) {
        setOpenActionsMenu(null)
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenActionsMenu(null)
      }
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [openActionsMenu])

  const visibleUsers = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR')

    return users.filter((user) => {
      const matchesRole = role === 'all' || user.role === role
      const matchesStatus = status === 'all' || user.status === status
      const searchableText = `${user.full_name ?? ''} ${user.email}`.toLocaleLowerCase('pt-BR')

      return matchesRole && matchesStatus && (!term || searchableText.includes(term))
    })
  }, [role, search, status, users])

  async function changeRole(user: AdminUser) {
    try {
      await updateUserRole(user, user.role === 'admin' ? 'user' : 'admin', users)
      toast.success(user.role === 'admin' ? 'Acesso admin removido.' : 'Usuário promovido a admin.')
      await load()
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error))
    }
  }

  async function changeBlock(user: AdminUser) {
    try {
      if (user.status === 'blocked') {
        await unblockUser(user)
        toast.success('Usuário desbloqueado.')
      } else {
        await blockUser(user)
        toast.success('Usuário bloqueado.')
      }

      await load()
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error))
    }
  }

  async function sendInvite(email = inviteEmail) {
    setSending(true)

    try {
      toast.success(await inviteAdminUser(email))
      setInviteOpen(false)
      setInviteEmail('')
      await load()
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error))
    } finally {
      setSending(false)
    }
  }

  function renderActions(user: AdminUser, placement: 'desktop' | 'mobile') {
    const menuKey = `${placement}-${user.id}`
    const menuId = `user-actions-menu-${placement}-${user.id}`
    const isOpen = openActionsMenu === menuKey
    const userName = getUserDisplayName(user)

    return (
      <div
        className={`admin-actions-menu-root${isOpen ? ' is-open' : ''}`}
        data-admin-actions-root
      >
        <button
          className="admin-actions-trigger"
          type="button"
          aria-label={`Abrir ações do usuário ${userName}`}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls={menuId}
          title="Ações"
          onClick={() => setOpenActionsMenu((current) => current === menuKey ? null : menuKey)}
        >
          <MoreVertical aria-hidden="true" />
        </button>

        {isOpen ? (
          <div
            className="admin-actions-popover"
            id={menuId}
            role="menu"
            aria-label={`Ações do usuário ${userName}`}
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpenActionsMenu(null)
                void changeRole(user)
              }}
            >
              {user.role === 'admin' ? <ShieldOff aria-hidden="true" /> : <ShieldCheck aria-hidden="true" />}
              <span>{user.role === 'admin' ? 'Remover admin' : 'Promover a admin'}</span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpenActionsMenu(null)
                void changeBlock(user)
              }}
            >
              {user.status === 'blocked' ? <LockOpen aria-hidden="true" /> : <Ban aria-hidden="true" />}
              <span>{user.status === 'blocked' ? 'Desbloquear' : 'Bloquear'}</span>
            </button>

            {user.card ? (
              <Link
                to={`/${user.card.slug}`}
                target="_blank"
                rel="noreferrer"
                role="menuitem"
                onClick={() => setOpenActionsMenu(null)}
              >
                <ExternalLink aria-hidden="true" />
                <span>Abrir cartão</span>
              </Link>
            ) : (
              <Link
                to={`/admin/cartoes/novo?email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.full_name || '')}`}
                role="menuitem"
                onClick={() => setOpenActionsMenu(null)}
              >
                <IdCard aria-hidden="true" />
                <span>Criar cartão</span>
              </Link>
            )}

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpenActionsMenu(null)
                void sendInvite(user.email)
              }}
            >
              <Mail aria-hidden="true" />
              <span>{user.status === 'pending' ? 'Reenviar convite' : 'Enviar convite'}</span>
            </button>
          </div>
        ) : null}
      </div>
    )
  }

  const userCountLabel = users.length === 1 ? 'usuário' : 'usuários'

  return (
    <AdminLayout
      title="Usuários"
      subtitle="Gerencie acessos, perfis, bloqueios e convites."
      action={
        <button className="primary-button" type="button" onClick={() => setInviteOpen(true)}>
          Convidar usuário
        </button>
      }
    >
      <div className="admin-card">
        <div className="admin-table-header">
          <strong>{visibleUsers.length} de {users.length} {userCountLabel}</strong>
          <button className="secondary-button compact-button" type="button" onClick={load}>
            Atualizar
          </button>
        </div>

        {users.length > 0 ? (
          <div className="admin-list-controls" role="search" aria-label="Buscar e filtrar usuários">
            <label className="admin-search-field">
              <span>Busca</span>
              <input
                className="admin-search-input"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nome ou e-mail"
              />
            </label>

            <label>
              <span>Perfil</span>
              <select
                className="admin-filter-select"
                value={role}
                onChange={(event) => setRole(event.target.value as RoleFilter)}
              >
                <option value="all">Todos</option>
                <option value="admin">Admin</option>
                <option value="user">Colaborador</option>
              </select>
            </label>

            <label>
              <span>Status</span>
              <select
                className="admin-filter-select"
                value={status}
                onChange={(event) => setStatus(event.target.value as StatusFilter)}
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="blocked">Bloqueados</option>
                <option value="pending">Pendentes</option>
              </select>
            </label>
          </div>
        ) : null}

        {loading ? <p>Carregando usuários...</p> : null}

        {!loading && users.length === 0 ? (
          <div className="admin-empty">
            <p>Nenhum usuário cadastrado ainda.</p>
            <button className="primary-button" type="button" onClick={() => setInviteOpen(true)}>
              Convidar primeiro usuário
            </button>
          </div>
        ) : null}

        {!loading && users.length > 0 && visibleUsers.length === 0 ? (
          <div className="admin-empty admin-filter-empty">
            <p>Nenhum usuário encontrado para os filtros selecionados.</p>
          </div>
        ) : null}

        {!loading && visibleUsers.length > 0 ? (
          <div className="admin-table-wrap">
            <table className="admin-table admin-users-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Perfil</th>
                  <th>Status</th>
                  <th>Cartão</th>
                  <th className="admin-actions-heading">Ações</th>
                </tr>
              </thead>

              <tbody>
                {visibleUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="admin-user-name-cell">
                      <strong>{getUserDisplayName(user)}</strong>
                      <small>{user.email}</small>
                    </td>
                    <td>
                      <span className="status-pill">{getUserRoleLabel(user)}</span>
                    </td>
                    <td>
                      <span className={`status-pill ${user.status === 'active' ? 'active' : 'inactive'}`}>
                        {getUserStatusLabel(user.status)}
                      </span>
                    </td>
                    <td className="admin-user-card-cell">
                      {user.card ? (
                        <Link
                          className="admin-user-card-link"
                          to={`/${user.card.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          title={`Abrir cartão /${user.card.slug}`}
                        >
                          /{user.card.slug}
                        </Link>
                      ) : (
                        <span className="admin-muted">Sem cartão</span>
                      )}
                    </td>
                    <td className="admin-actions-cell">{renderActions(user, 'desktop')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="admin-mobile-cards admin-users-mobile-cards">
              {visibleUsers.map((user) => (
                <article className="admin-mobile-card admin-user-mobile-card" key={user.id}>
                  <div className="admin-mobile-card-heading">
                    <div className="admin-user-identity">
                      <strong>{getUserDisplayName(user)}</strong>
                      <small>{user.email}</small>
                    </div>
                    {renderActions(user, 'mobile')}
                  </div>

                  <div className="admin-user-mobile-meta">
                    <span className="status-pill">{getUserRoleLabel(user)}</span>
                    <span className={`status-pill ${user.status === 'active' ? 'active' : 'inactive'}`}>
                      {getUserStatusLabel(user.status)}
                    </span>
                  </div>

                  <div className="admin-user-mobile-card-link">
                    <span>Cartão</span>
                    {user.card ? (
                      <Link to={`/${user.card.slug}`} target="_blank" rel="noreferrer">
                        /{user.card.slug}
                      </Link>
                    ) : (
                      <strong>Sem cartão</strong>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {inviteOpen ? (
        <div
          className="confirmation-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !sending) {
              setInviteOpen(false)
            }
          }}
        >
          <section
            className="confirmation-modal invite-user-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-title"
          >
            <h2 id="invite-title">Convidar usuário</h2>
            <p>O convite será enviado pelo Supabase para o e-mail institucional.</p>
            <label>
              E-mail institucional
              <input
                autoFocus
                type="email"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="nome@investrs.org.br"
              />
            </label>
            <div className="confirmation-actions">
              <button
                className="secondary-button"
                type="button"
                disabled={sending}
                onClick={() => setInviteOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="primary-button"
                type="button"
                disabled={sending || !inviteEmail}
                onClick={() => void sendInvite()}
              >
                {sending ? 'Enviando...' : 'Enviar convite'}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </AdminLayout>
  )
}
