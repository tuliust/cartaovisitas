import { normalizeSlug } from './adminCards'
import { supabase } from './supabase'

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase não configurado. Verifique as variáveis de ambiente.')
  }

  return supabase
}

export async function checkSlugAvailability(slug: string, currentCardId?: string): Promise<boolean> {
  const normalizedSlug = normalizeSlug(slug)
  if (!normalizedSlug) return false

  const { data, error } = await requireSupabase()
    .from('business_cards')
    .select('id')
    .eq('slug', normalizedSlug)
    .maybeSingle()

  if (error) throw error
  return !data || data.id === currentCardId
}
