import { createClient } from '@supabase/supabase-js'
import { AppleWalletConfigurationError, generateAppleWalletPass, type WalletCard } from '../../_lib/appleWallet.js'

type VercelRequest = { method?: string; query: Record<string, string | string[] | undefined> }
type VercelResponse = {
  setHeader: (name: string, value: string) => void
  status: (code: number) => VercelResponse
  send: (body: string | Buffer) => void
  json: (body: unknown) => void
}

function slugFrom(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function hexToRgb(value: string | null | undefined, fallback: string) {
  const match = value?.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  return match ? `rgb(${Number.parseInt(match[1], 16)}, ${Number.parseInt(match[2], 16)}, ${Number.parseInt(match[3], 16)})` : fallback
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method && req.method !== 'GET') { res.status(405).json({ error: 'Método não permitido.' }); return }
  const slug = slugFrom(req.query.slug)
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) { res.status(400).json({ error: 'Slug inválido.' }); return }

  if (process.env.APPLE_WALLET_ENABLED !== 'true') {
    res.status(503).json({ error: 'Apple Wallet ainda não está configurado para este ambiente.' })
    return
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseAnonKey) { res.status(503).json({ error: 'Serviço temporariamente indisponível.' }); return }
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabase.from('business_cards').select('*').eq('slug', slug).eq('is_active', true).maybeSingle()
    if (error) throw error
    if (!data) { res.status(404).json({ error: 'Cartão não encontrado.' }); return }

    const { data: brand } = await supabase.from('brand_settings').select('background_color,text_color,secondary_color').limit(1).maybeSingle()
    const baseUrl = (process.env.PUBLIC_SITE_URL || 'https://cartaovisitas.vercel.app').replace(/\/$/, '')
    const buffer = await generateAppleWalletPass(data as WalletCard, baseUrl, {
      backgroundColor: hexToRgb(brand?.background_color, 'rgb(5, 5, 5)'),
      foregroundColor: hexToRgb(brand?.text_color, 'rgb(255, 255, 255)'),
      labelColor: hexToRgb(brand?.secondary_color, 'rgb(190, 190, 190)'),
    })

    const eventResult = await supabase.from('card_scan_events').insert({ card_id: data.id, event_type: 'wallet_apple', user_agent: null, referrer: null })
    if (eventResult.error) console.warn('Não foi possível registrar o evento Apple Wallet.')
    res.setHeader('Content-Type', 'application/vnd.apple.pkpass')
    res.setHeader('Content-Disposition', `attachment; filename="invest-rs-${slug}.pkpass"`)
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).send(buffer)
  } catch (error) {
    if (error instanceof AppleWalletConfigurationError) { res.status(503).json({ error: error.message }); return }
    console.error('Falha ao gerar passe Apple Wallet.')
    res.status(500).json({ error: 'Não foi possível gerar o passe Apple Wallet agora.' })
  }
}
