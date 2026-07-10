import { supabase } from './supabase'

export type BusinessCard = {
  id: string
  slug: string
  full_name: string
  display_name: string | null
  job_title: string | null
  department: string | null
  job_title_pt?: string | null
  job_title_es?: string | null
  job_title_en?: string | null
  department_pt?: string | null
  department_es?: string | null
  department_en?: string | null
  company: string | null
  mobile_phone: string | null
  work_phone: string | null
  email: string | null
  website: string | null
  address_line: string | null
  city: string | null
  state: string | null
  country: string | null
  linkedin_url: string | null
  instagram_url: string | null
  avatar_url: string | null
  logo_url: string | null
  theme: string | null
  is_active: boolean
  expires_at: string | null
}

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase não configurado. Verifique o arquivo .env.local.')
  }

  return supabase
}

export async function getPublicCardBySlug(slug: string) {
  const client = requireSupabase()

  const { data, error } = await client
    .from('business_cards')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data as BusinessCard | null
}

export async function recordCardEvent(cardId: string, eventType: 'view' | 'vcard' | 'qr') {
  const client = requireSupabase()

  const { error } = await client.from('card_scan_events').insert({
    card_id: cardId,
    event_type: eventType,
    user_agent: window.navigator.userAgent,
    referrer: document.referrer || null,
  })

  if (error) {
    console.warn('Não foi possível registrar evento do cartão:', error.message)
  }
}
