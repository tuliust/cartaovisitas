import { getCurrentUser } from './auth'
import { buildCardPayload, defaultCardFormValues, normalizeSlug, type AdminBusinessCard, type CardFormValues } from './adminCards'
import { getInvestEmailPrefix } from './investEmail'
import { supabase } from './supabase'

function client() {
  if (!supabase) throw new Error('Supabase não configurado.')
  return supabase
}

async function identity() {
  const user = await getCurrentUser()
  if (!user?.email) throw new Error('Sua sessão expirou. Faça login novamente.')
  return { id: user.id, email: user.email.toLowerCase() }
}

export async function getMyCard() {
  const user = await identity()
  const byOwner = await client().from('business_cards').select('*').eq('created_by', user.id).limit(1).maybeSingle()
  if (byOwner.error) throw byOwner.error
  if (byOwner.data) return byOwner.data as AdminBusinessCard
  const byEmail = await client().from('business_cards').select('*').ilike('email', user.email).limit(1).maybeSingle()
  if (byEmail.error) throw byEmail.error
  return byEmail.data as AdminBusinessCard | null
}

export async function createMyCardDraft(): Promise<CardFormValues> {
  const user = await identity()
  const prefix = getInvestEmailPrefix(user.email)
  return { ...defaultCardFormValues, email: user.email, slug: normalizeSlug(prefix), company: 'Invest RS', website: 'https://investrs.org.br', country: 'Brasil', is_active: true }
}

export async function upsertMyCard(values: CardFormValues) {
  const user = await identity()
  const existing = await getMyCard()
  const safeValues = { ...values, email: user.email, company: 'Invest RS', is_active: existing?.is_active ?? true }
  const payload = buildCardPayload(safeValues)
  if (existing) {
    const { data, error } = await client().from('business_cards').update(payload).eq('id', existing.id).select('*').single()
    if (error) throw error
    return data as AdminBusinessCard
  }
  const { data, error } = await client().from('business_cards').insert({ ...payload, created_by: user.id, email: user.email }).select('*').single()
  if (error) throw error
  return data as AdminBusinessCard
}

export async function getMyCardOrCreateDraft() {
  const card = await getMyCard()
  return card ?? createMyCardDraft()
}
