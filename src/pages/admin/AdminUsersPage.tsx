import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { useToast } from '../../contexts/ToastContext'
import { getCurrentSession } from '../../lib/auth'
import { blockUser, getAdminUsers, inviteAdminUser, unblockUser, updateUserRole, type AdminUser, type AdminUserStatus } from '../../lib/adminUsers'
import { getFriendlyErrorMessage } from '../../lib/errors'
import { requireAdmin } from '../../lib/roles'

type RoleFilter = 'all' | 'admin' | 'user'
type StatusFilter = 'all' | AdminUserStatus

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

  const load = useCallback(async () => { setLoading(true); try { setUsers(await getAdminUsers()) } catch (error) { toast.error(getFriendlyErrorMessage(error)) } finally { setLoading(false) } }, [toast])

  useEffect(() => { void (async () => { if (!(await getCurrentSession())) return navigate('/admin/login', { replace: true }); await requireAdmin(); await load() })().catch(() => navigate('/admin/login', { replace: true })) }, [load, navigate])

  const visible = useMemo(() => users.filter((user) => {
    const term = search.trim().toLowerCase()
    return (role === 'all' || user.role === role) && (status === 'all' || user.status === status) && (!term || `${user.full_name ?? ''} ${user.email}`.toLowerCase().includes(term))
  }), [role, search, status, users])

  async function changeRole(user: AdminUser) { try { await updateUserRole(user, user.role === 'admin' ? 'user' : 'admin', users); toast.success(user.role === 'admin' ? 'Acesso admin removido.' : 'Usuário promovido a admin.'); await load() } catch (error) { toast.error(getFriendlyErrorMessage(error)) } }
  async function changeBlock(user: AdminUser) { try { if (user.status === 'blocked') { await unblockUser(user); toast.success('Usuário desbloqueado.') } else { await blockUser(user); toast.success('Usuário bloqueado.') } await load() } catch (error) { toast.error(getFriendlyErrorMessage(error)) } }
  async function sendInvite(email = inviteEmail) { setSending(true); try { toast.success(await inviteAdminUser(email)); setInviteOpen(false); setInviteEmail(''); await load() } catch (error) { toast.error(getFriendlyErrorMessage(error)) } finally { setSending(false) } }

  return <AdminLayout title="Usuários" subtitle="Gerencie acessos, perfis, bloqueios e convites." action={<button className="primary-button" type="button" onClick={() => setInviteOpen(true)}>Convidar usuário</button>}>
    <div className="admin-card">
      <div className="admin-list-controls">
        <label className="admin-search-field"><span>Busca</span><input className="admin-search-input" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nome ou e-mail" /></label>
        <label><span>Perfil</span><select value={role} onChange={(event) => setRole(event.target.value as RoleFilter)}><option value="all">Todos</option><option value="admin">Admin</option><option value="user">Colaborador</option></select></label>
        <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}><option value="all">Todos</option><option value="active">Ativo</option><option value="blocked">Bloqueado</option><option value="pending">Pendente</option></select></label>
      </div>
      {loading ? <p>Carregando usuários...</p> : <div className="governance-list">{visible.map((user) => <article className="governance-row" key={user.id}>
        <div><strong>{user.full_name || user.email}</strong><small>{user.email}</small></div>
        <span className="status-pill">{user.role === 'admin' ? 'Admin' : 'Colaborador'}</span>
        <span className={`status-pill ${user.status === 'active' ? 'active' : 'inactive'}`}>{user.status === 'active' ? 'Ativo' : user.status === 'blocked' ? 'Bloqueado' : 'Pendente'}</span>
        <div>{user.card ? <Link to={`/${user.card.slug}`} target="_blank">/{user.card.slug}</Link> : <span>Sem cartão</span>}</div>
        <div className="admin-actions governance-actions"><button type="button" onClick={() => void changeRole(user)}>{user.role === 'admin' ? 'Remover admin' : 'Promover a admin'}</button><button type="button" onClick={() => void changeBlock(user)}>{user.status === 'blocked' ? 'Desbloquear' : 'Bloquear'}</button>{user.card ? <Link to={`/${user.card.slug}`} target="_blank">Abrir cartão</Link> : <Link to={`/admin/cartoes/novo?email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.full_name || '')}`}>Criar cartão</Link>}<button type="button" onClick={() => void sendInvite(user.email)}>{user.status === 'pending' ? 'Reenviar convite' : 'Enviar convite'}</button></div>
      </article>)}</div>}
    </div>
    {inviteOpen ? <div className="confirmation-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setInviteOpen(false) }}><section className="confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="invite-title"><h2 id="invite-title">Convidar usuário</h2><p>O convite será enviado pelo Supabase para o e-mail institucional.</p><label>E-mail institucional<input autoFocus type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="nome@investrs.org.br" /></label><div className="confirmation-actions"><button className="secondary-button" type="button" onClick={() => setInviteOpen(false)}>Cancelar</button><button className="primary-button" type="button" disabled={sending || !inviteEmail} onClick={() => void sendInvite()}>{sending ? 'Enviando...' : 'Enviar convite'}</button></div></section></div> : null}
  </AdminLayout>
}
