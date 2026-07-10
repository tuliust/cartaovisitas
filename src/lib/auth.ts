import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

function requireSupabase() {
  if (!supabase) throw new Error('Supabase não configurado. Verifique as variáveis de ambiente.')
  return supabase
}

export function isInvestRsEmail(email?: string | null) {
  return Boolean(email && email.toLowerCase().endsWith('@investrs.org.br'))
}

export async function getCurrentSession() {
  const { data, error } = await requireSupabase().auth.getSession()
  if (error) throw error
  return data.session
}

export async function getCurrentUser() {
  const { data, error } = await requireSupabase().auth.getUser()
  if (error) throw error
  return data.user
}

export async function signInWithPassword(email: string, password: string) {
  if (!isInvestRsEmail(email)) throw new Error('Use um e-mail institucional @investrs.org.br.')
  const { data, error } = await requireSupabase().auth.signInWithPassword({ email: email.toLowerCase(), password })
  if (error) throw error
  return data
}

export async function signUpWithPassword(email: string, password: string) {
  if (!isInvestRsEmail(email)) throw new Error('Use um e-mail institucional @investrs.org.br.')
  const { data, error } = await requireSupabase().auth.signUp({
    email: email.toLowerCase(), password,
    options: { emailRedirectTo: `${window.location.origin}/meu-cartao/editar` },
  })
  if (error) throw error
  return data
}

export async function sendPasswordReset(email: string) {
  if (!isInvestRsEmail(email)) throw new Error('Use um e-mail institucional @investrs.org.br.')
  const { error } = await requireSupabase().auth.resetPasswordForEmail(email.toLowerCase(), {
    redirectTo: `${window.location.origin}/definir-senha`,
  })
  if (error) throw error
}

export async function updatePassword(password: string) {
  const { error } = await requireSupabase().auth.updateUser({ password })
  if (error) throw error
}

export async function signOut() {
  const { error } = await requireSupabase().auth.signOut()
  if (error) throw error
}

export function onAuthSessionChange(callback: (session: Session | null) => void) {
  const { data } = requireSupabase().auth.onAuthStateChange((_event, session) => callback(session))
  return data.subscription
}
