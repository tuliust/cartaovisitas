import { supabase } from './supabase'
import type { BusinessCard } from './cards'

export type AdminBusinessCard = BusinessCard & {
  created_at: string | null
  updated_at: string | null
  created_by: string | null
}

export type CardFormValues = {
  slug: string
  full_name: string
  display_name: string
  job_title: string
  department: string
  company: string
  mobile_phone: string
  work_phone: string
  email: string
  website: string
  address_line: string
  city: string
  state: string
  country: string
  linkedin_url: string
  instagram_url: string
  avatar_url: string
  logo_url: string
  is_active: boolean
}

export const defaultCardFormValues: CardFormValues = {
  slug: '',
  full_name: '',
  display_name: '',
  job_title: '',
  department: '',
  company: 'Invest RS',
  mobile_phone: '',
  work_phone: '',
  email: '',
  website: 'https://investrs.org.br',
  address_line: '',
  city: 'Porto Alegre',
  state: 'RS',
  country: 'Brasil',
  linkedin_url: '',
  instagram_url: '',
  avatar_url: '',
  logo_url: '',
  is_active: true,
}

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase não configurado. Verifique as variáveis de ambiente.')
  }

  return supabase
}

function stringOrNull(value: string) {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

export function normalizeSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function toCardFormValues(card: AdminBusinessCard): CardFormValues {
  return {
    slug: card.slug ?? '',
    full_name: card.full_name ?? '',
    display_name: card.display_name ?? '',
    job_title: card.job_title ?? '',
    department: card.department ?? '',
    company: card.company ?? 'Invest RS',
    mobile_phone: card.mobile_phone ?? '',
    work_phone: card.work_phone ?? '',
    email: card.email ?? '',
    website: card.website ?? '',
    address_line: card.address_line ?? '',
    city: card.city ?? '',
    state: card.state ?? '',
    country: card.country ?? 'Brasil',
    linkedin_url: card.linkedin_url ?? '',
    instagram_url: card.instagram_url ?? '',
    avatar_url: card.avatar_url ?? '',
    logo_url: card.logo_url ?? '',
    is_active: card.is_active,
  }
}

export function buildCardPayload(values: CardFormValues) {
  const slug = normalizeSlug(values.slug)

  if (!slug) {
    throw new Error('Informe um slug válido.')
  }

  if (!values.full_name.trim()) {
    throw new Error('Informe o nome completo.')
  }

  return {
    slug,
    full_name: values.full_name.trim(),
    display_name: stringOrNull(values.display_name),
    job_title: stringOrNull(values.job_title),
    department: stringOrNull(values.department),
    company: stringOrNull(values.company) || 'Invest RS',
    mobile_phone: stringOrNull(values.mobile_phone),
    work_phone: stringOrNull(values.work_phone),
    email: stringOrNull(values.email),
    website: stringOrNull(values.website),
    address_line: stringOrNull(values.address_line),
    city: stringOrNull(values.city),
    state: stringOrNull(values.state),
    country: stringOrNull(values.country) || 'Brasil',
    linkedin_url: stringOrNull(values.linkedin_url),
    instagram_url: stringOrNull(values.instagram_url),
    avatar_url: stringOrNull(values.avatar_url),
    logo_url: stringOrNull(values.logo_url),
    theme: 'invest_black',
    is_active: values.is_active,
    updated_at: new Date().toISOString(),
  }
}

export async function listAdminCards() {
  const client = requireSupabase()

  const { data, error } = await client
    .from('business_cards')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []) as AdminBusinessCard[]
}

export async function getAdminCardById(id: string) {
  const client = requireSupabase()

  const { data, error } = await client
    .from('business_cards')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data as AdminBusinessCard | null
}

export async function createAdminCard(values: CardFormValues) {
  const client = requireSupabase()

  const {
    data: { user },
  } = await client.auth.getUser()

  const payload = {
    ...buildCardPayload(values),
    created_by: user?.id ?? null,
  }

  const { data, error } = await client
    .from('business_cards')
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data as AdminBusinessCard
}

export async function updateAdminCard(id: string, values: CardFormValues) {
  const client = requireSupabase()
  const payload = buildCardPayload(values)

  const { data, error } = await client
    .from('business_cards')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data as AdminBusinessCard
}

export async function setAdminCardActive(id: string, isActive: boolean) {
  const client = requireSupabase()

  const { error } = await client
    .from('business_cards')
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    throw error
  }
}
