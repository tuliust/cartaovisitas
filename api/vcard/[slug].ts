import { createClient } from '@supabase/supabase-js'

type BusinessCard = {
  slug: string
  full_name: string
  display_name: string | null
  job_title: string | null
  department: string | null
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
}

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

function getSlug(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function escapeVCardValue(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n')
}

function buildStructuredName(fullName: string) {
  const parts = fullName.trim().split(/\s+/)

  if (parts.length <= 1) {
    return `${escapeVCardValue(fullName)};;;;`
  }

  const lastName = parts.pop() ?? ''
  const firstNames = parts.join(' ')

  return `${escapeVCardValue(lastName)};${escapeVCardValue(firstNames)};;;`
}

function generateVCard(card: BusinessCard) {
  const name = card.display_name || card.full_name
  const company = card.company || 'Invest RS'

  const lines = [
    'BEGIN:VCARD',
    'VERSION:4.0',
    `FN:${escapeVCardValue(name)}`,
    `N:${buildStructuredName(card.full_name)}`,
    `ORG:${escapeVCardValue(company)}`,
  ]

  if (card.job_title) {
    lines.push(`TITLE:${escapeVCardValue(card.job_title)}`)
  }

  if (card.department) {
    lines.push(`ROLE:${escapeVCardValue(card.department)}`)
  }

  if (card.mobile_phone) {
    lines.push(`TEL;TYPE=cell,voice:${card.mobile_phone}`)
  }

  if (card.work_phone) {
    lines.push(`TEL;TYPE=work,voice:${card.work_phone}`)
  }

  if (card.email) {
    lines.push(`EMAIL;TYPE=work:${card.email}`)
  }

  if (card.website) {
    lines.push(`URL:${card.website}`)
  }

  if (card.linkedin_url) {
    lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${card.linkedin_url}`)
  }

  if (card.instagram_url) {
    lines.push(`X-SOCIALPROFILE;TYPE=instagram:${card.instagram_url}`)
  }

  if (card.address_line || card.city || card.state || card.country) {
    lines.push(
      `ADR;TYPE=work:;;${escapeVCardValue(card.address_line || '')};${escapeVCardValue(
        card.city || '',
      )};${escapeVCardValue(card.state || '')};;${escapeVCardValue(card.country || '')}`,
    )
  }

  lines.push(`REV:${new Date().toISOString()}`)
  lines.push('END:VCARD')

  return lines.join('\r\n')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method && req.method !== 'GET') {
      res.status(405).send('Method not allowed')
      return
    }

    const slug = getSlug(req.query.slug)

    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      res.status(400).json({ error: 'Slug inválido.' })
      return
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      res.status(500).json({
        error: 'Supabase não configurado.',
        missing: {
          SUPABASE_URL: !supabaseUrl,
          SUPABASE_ANON_KEY: !supabaseAnonKey,
        },
      })
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

    const content = generateVCard(data as BusinessCard)
    const fileName = `${slug}.vcf`

    res.setHeader('Content-Type', 'text/vcard; charset=utf-8')
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`)
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).send(content)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido'
    res.status(500).json({ error: message })
  }
}
