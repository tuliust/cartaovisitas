import { getCurrentUser } from './auth'
import { recordAuditLog } from './audit'
import { supabase } from './supabase'

export type AdminUserStatus = 'active' | 'blocked' | 'pending' | 'inactive'
export type AdminUserDraft = { email: string; full_name?: string; job_title?: string; department?: string }
export type AdminUser = { id: string; email: string; full_name: string | null; job_title: string | null; department: string | null; role: 'admin' | 'user'; status: AdminUserStatus; blocked_at: string | null; invited_at: string | null; last_seen_at: string | null; staged: boolean; card: { id: string; slug: string; full_name: string } | null }

function client() { if (!supabase) throw new Error('Supabase não configurado.'); return supabase }

export async function getAdminUsers() {
  const [{ data: profiles, error }, { data: cards, error: cardsError }, { data: registrations, error: registrationsError }] = await Promise.all([
    client().from('user_profiles').select('id,email,full_name,role,status,blocked_at,invited_at,last_seen_at').order('email'),
    client().from('business_cards').select('id,slug,full_name,email,created_by'),
    client().from('user_pre_registrations').select('id,email,full_name,job_title,department,status,auth_user_id').order('email'),
  ])
  if (error) throw error
  if (cardsError) throw cardsError
  if (registrationsError) throw registrationsError
  const draftsByEmail = new Map((registrations ?? []).map((registration) => [registration.email.toLowerCase(), registration]))
  const profileUsers = (profiles ?? []).map((profile) => {
    const draft = draftsByEmail.get(profile.email.toLowerCase())
    return { ...profile, job_title: draft?.job_title ?? null, department: draft?.department ?? null, staged: false, card: (cards ?? []).find((card) => card.created_by === profile.id || card.email?.toLowerCase() === profile.email.toLowerCase()) ?? null }
  }) as AdminUser[]
  const profileEmails = new Set(profileUsers.map((profile) => profile.email.toLowerCase()))
  const stagedUsers = (registrations ?? []).filter((registration) => !profileEmails.has(registration.email.toLowerCase())).map((registration) => ({ id: `staged:${registration.id}`, email: registration.email, full_name: registration.full_name, job_title: registration.job_title, department: registration.department, role: 'user' as const, status: registration.status as AdminUserStatus, blocked_at: null, invited_at: null, last_seen_at: null, staged: true, card: null }))
  return [...profileUsers, ...stagedUsers].sort((a, b) => a.email.localeCompare(b.email, 'pt-BR'))
}

export async function updateUserRole(user: AdminUser, role: 'admin' | 'user', users: AdminUser[]) {
  const current = await getCurrentUser()
  if (user.id === current?.id && role === 'user' && users.filter((item) => item.role === 'admin').length === 1) throw new Error('O único administrador não pode remover o próprio acesso.')
  const { error } = await client().from('user_profiles').update({ role, updated_at: new Date().toISOString() }).eq('id', user.id)
  if (error) throw error
  await recordAuditLog({ action: role === 'admin' ? 'user_promoted_admin' : 'user_removed_admin', targetType: 'user', targetId: user.id, targetLabel: user.email, beforeData: { role: user.role }, afterData: { role } })
}

export async function blockUser(user: AdminUser) {
  const current = await getCurrentUser()
  if (user.id === current?.id) throw new Error('Você não pode bloquear o próprio usuário.')
  const blockedAt = new Date().toISOString()
  const { error } = await client().from('user_profiles').update({ status: 'blocked', blocked_at: blockedAt, updated_at: blockedAt }).eq('id', user.id)
  if (error) throw error
  await recordAuditLog({ action: 'user_blocked', targetType: 'user', targetId: user.id, targetLabel: user.email })
}

export async function unblockUser(user: AdminUser) {
  const { error } = await client().from('user_profiles').update({ status: 'active', blocked_at: null, updated_at: new Date().toISOString() }).eq('id', user.id)
  if (error) throw error
  await recordAuditLog({ action: 'user_unblocked', targetType: 'user', targetId: user.id, targetLabel: user.email })
}

export function getUserLinkedCard(user: AdminUser) { return user.card }

export async function inviteAdminUsers(users: AdminUserDraft[], sendInvite: boolean) {
  const session = (await client().auth.getSession()).data.session
  if (!session) throw new Error('Sua sessão expirou. Faça login novamente.')
  const response = await fetch('/api/admin/invite-user', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ users, sendInvite }) })
  const payload = await response.json() as { message?: string; error?: string }
  if (!response.ok) throw new Error(payload.error || 'Não foi possível cadastrar os usuários.')
  return payload.message || 'Usuários cadastrados com sucesso.'
}

export async function inviteAdminUser(email: string, full_name?: string | null, job_title?: string | null, department?: string | null) {
  return inviteAdminUsers([{ email, full_name: full_name || undefined, job_title: job_title || undefined, department: department || undefined }], true)
}
