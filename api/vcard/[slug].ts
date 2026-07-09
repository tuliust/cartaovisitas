import { createClient } from '@supabase/supabase-js'
import { buildVCardFileName, generateVCard } from '../../src/lib/vcard'

type VercelRequest = {
  method?: string
  query: Record<string, string | string[] | undefined>
}

type VercelResponse = {
  setHeader: (name: string, value: string) => void
  status: (code: number) => VercelResponse
  send: (body: string) => void
  json: (body: unknown) => void
  end: () => void
}

type RuntimeProcess = {
  env?: Record<string, string | undefined>
}

const runtimeProcess = (globalThis as unknown as { process?: RuntimeProcess }).process

function getEnv(name: string) {
  return runtimeProcess?.env?.[name]
}

function getSlug(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method && req.method !== 'GET') {
    res.status(405).end()
    return
  }

  const slug = getSlug(req.query.slug)

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    res.status(400).json({ error: 'Slug inválido.' })
    return
  }

  const supabaseUrl = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL')
  const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_ANON_KEY')

  if (!supabaseUrl || !supabaseAnonKey) {
    res.status(500).json({ error: 'Supabase não configurado.' })
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const { data, error } = await supabase
    .from('business_cards')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  if (!data) {
    res.status(404).json({ error: 'Cartão não encontrado.' })
    return
  }

  const content = generateVCard(data)
  const fileName = buildVCardFileName(data)

  res.setHeader('Content-Type', 'text/vcard; charset=utf-8')
  res.setHeader('Content-Disposition', `inline; filename="${fileName}"`)
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).send(content)
}
