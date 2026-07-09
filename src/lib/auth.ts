import { supabase } from './supabase'
import type { Session } from '@supabase/supabase-js'

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase não configurado. Verifique as variáveis de ambiente.')
  }

  return supabase
}

export function isInvestRsEmail(email?: string | null) {
  return Boolean(email && email.toLowerCase().endsWith('@investrs.org.br'))
}

export async function getCurrentSession() {
  const client = requireSupabase()

  const { data, error } = await client.auth.getSession()

  if (error) {
    throw error
  }

  return data.session
}

export async function signInWithMagicLink(email: string) {
  const client = requireSupabase()
  const normalizedEmail = email.trim().toLowerCase()

  if (!isInvestRsEmail(normalizedEmail)) {
    throw new Error('Use um e-mail institucional @investrs.org.br.')
  }

  const { error } = await client.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      emailRedirectTo: `${window.location.origin}/admin/cartoes`,
    },
  })

  if (error) {
    throw error
  }
}

export async function signOut() {
  const client = requireSupabase()
  const { error } = await client.auth.signOut()

  if (error) {
    throw error
  }
}

export function onAuthSessionChange(callback: (session: Session | null) => void) {
  const client = requireSupabase()

  const { data } = client.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })

  return data.subscription
}