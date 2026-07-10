import { supabase } from './supabase'

export type CardAnalyticsSummary = {
  view_count: number
  vcard_count: number
  share_count: number
  qr_count: number
  last_view_at: string | null
}

type CardEventRow = {
  card_id: string
  event_type: string
  created_at: string | null
}

export const emptyCardAnalytics: CardAnalyticsSummary = {
  view_count: 0,
  vcard_count: 0,
  share_count: 0,
  qr_count: 0,
  last_view_at: null,
}

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase não configurado. Verifique as variáveis de ambiente.')
  }

  return supabase
}

export async function getAnalyticsForCards(cardIds: string[]) {
  const summaries: Record<string, CardAnalyticsSummary> = Object.fromEntries(
    cardIds.map((cardId) => [cardId, { ...emptyCardAnalytics }]),
  )

  if (cardIds.length === 0) return summaries

  const client = requireSupabase()
  const { data, error } = await client
    .from('card_scan_events')
    .select('card_id,event_type,created_at')
    .in('card_id', cardIds)

  if (error) throw error

  for (const event of (data ?? []) as CardEventRow[]) {
    const summary = summaries[event.card_id]
    if (!summary) continue

    if (event.event_type === 'view') {
      summary.view_count += 1
      if (event.created_at && (!summary.last_view_at || event.created_at > summary.last_view_at)) {
        summary.last_view_at = event.created_at
      }
    } else if (event.event_type === 'vcard') {
      summary.vcard_count += 1
    } else if (event.event_type === 'share') {
      summary.share_count += 1
    } else if (event.event_type === 'qr') {
      summary.qr_count += 1
    }
  }

  return summaries
}

export async function getCardAnalyticsSummary() {
  const client = requireSupabase()
  const { data, error } = await client.from('card_scan_events').select('card_id')
  if (error) throw error

  const cardIds = [...new Set((data ?? []).map((event) => event.card_id as string))]
  return getAnalyticsForCards(cardIds)
}
