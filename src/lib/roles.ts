import { getCurrentUser } from './auth'
import { supabase } from './supabase'

export type UserRole = 'admin' | 'user'
export type UserProfileStatus = 'active' | 'blocked' | 'pending'
export type UserProfile = { id: string; email: string; role: UserRole; full_name: string | null; status: UserProfileStatus }

function client() {
  if (!supabase) throw new Error('Supabase não configurado.')
  return supabase
}

export async function getCurrentUserProfile() {
  const user = await getCurrentUser()
  if (!user) return null
  const { data, error } = await client().from('user_profiles').select('id,email,role,full_name,status').eq('id', user.id).maybeSingle()
  if (error) throw error
  return data as UserProfile | null
}

export async function ensureUserProfile() {
  const user = await getCurrentUser()
  if (!user?.email) throw new Error('Sua sessão expirou. Faça login novamente.')
  const current = await getCurrentUserProfile()
  if (current) return current
  const { data, error } = await client().from('user_profiles').insert({ id: user.id, email: user.email, role: 'user', status: 'active' }).select('id,email,role,full_name,status').single()
  if (error) throw error
  return data as UserProfile
}

export async function isCurrentUserAdmin() {
  const profile = await getCurrentUserProfile()
  return profile?.role === 'admin' && profile.status !== 'blocked'
}

export async function requireActiveUser() {
  const profile = await ensureUserProfile()
  if (profile.status === 'blocked') throw new Error('Seu acesso está bloqueado. Entre em contato com um administrador.')
  return profile
}

export async function requireAdmin() {
  if (!(await isCurrentUserAdmin())) throw new Error('Seu usuário não tem permissão para acessar a área restrita.')
}
