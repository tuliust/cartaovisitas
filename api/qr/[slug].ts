import { createClient } from '@supabase/supabase-js'

type Request = { method?: string; query: Record<string, string | string[] | undefined>; headers?: Record<string, string | string[] | undefined> }
type Response = { setHeader: (name: string, value: string) => void; status: (code: number) => Response; json: (body: unknown) => void; end: () => void }

function first(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value }
function language(value: string | string[] | undefined) { const lang = first(value); return lang === 'es' || lang === 'en' ? lang : 'pt' }

export default async function handler(req: Request, res: Response) {
  if (req.method && req.method !== 'GET') { res.status(405).json({ error: 'Método não permitido.' }); return }
  const slug = first(req.query.slug)
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) { res.status(400).json({ error: 'Slug inválido.' }); return }

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) { res.status(503).json({ error: 'Serviço temporariamente indisponível.' }); return }

  const supabase = createClient(url, key)
  const { data, error } = await supabase.from('business_cards').select('id,slug').eq('slug', slug).eq('is_active', true).maybeSingle()
  if (error) { res.status(500).json({ error: 'Não foi possível abrir este QR Code.' }); return }
  if (!data) { res.status(404).json({ error: 'Cartão não encontrado.' }); return }

  const event = await supabase.from('card_scan_events').insert({ card_id: data.id, event_type: 'qr', user_agent: first(req.headers?.['user-agent']) || null, referrer: first(req.headers?.referer) || null })
  if (event.error) console.warn('Não foi possível registrar o scan do QR Code.')

  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Location', `/api/vcard/${encodeURIComponent(slug)}?lang=${language(req.query.lang)}`)
  res.status(302).end()
}
