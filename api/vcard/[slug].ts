import { createClient } from '@supabase/supabase-js'

type BusinessCard = {
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
}

type VercelRequest = {
  method?: string
  query: Record<string, string | string[] | undefined>
}

type VercelResponse = {
  setHeader: (name: string, value: string) => void
  status: (code: number) => VercelResponse
  send: (body: string | Buffer) => void
  json: (body: unknown) => void
  end: () => void
}

function getSlug(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

type VCardLanguage = 'pt' | 'es' | 'en'

function getLanguage(value: string | string[] | undefined): VCardLanguage {
  const language = getSlug(value)
  return language === 'es' || language === 'en' ? language : 'pt'
}

function escapeVCardValue(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\r\n|\r|\n/g, '\\n')
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

function getLocalizedValue(card: BusinessCard, field: 'job_title' | 'department', language: VCardLanguage) {
  return card[`${field}_${language}`] || card[`${field}_pt`] || card[field] || ''
}

function generateVCard(card: BusinessCard, language: VCardLanguage) {
  const name = card.display_name || card.full_name
  const company = card.company || 'Invest RS'

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN;CHARSET=UTF-8:${escapeVCardValue(name)}`,
    `N;CHARSET=UTF-8:${buildStructuredName(card.full_name)}`,
    `ORG;CHARSET=UTF-8:${escapeVCardValue(company)}`,
  ]

  const jobTitle = getLocalizedValue(card, 'job_title', language)
  const department = getLocalizedValue(card, 'department', language)

  if (jobTitle) {
    lines.push(`TITLE;CHARSET=UTF-8:${escapeVCardValue(jobTitle)}`)
  }

  if (department) {
    lines.push(`ROLE;CHARSET=UTF-8:${escapeVCardValue(department)}`)
  }

  if (card.mobile_phone) {
    lines.push(`TEL;TYPE=cell,voice:${escapeVCardValue(card.mobile_phone)}`)
  }

  if (card.work_phone) {
    lines.push(`TEL;TYPE=work,voice:${escapeVCardValue(card.work_phone)}`)
  }

  if (card.email) {
    lines.push(`EMAIL;TYPE=work:${escapeVCardValue(card.email)}`)
  }

  if (card.website) {
    lines.push(`URL:${escapeVCardValue(card.website)}`)
  }

  if (card.linkedin_url) {
    lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${escapeVCardValue(card.linkedin_url)}`)
  }

  if (card.instagram_url) {
    lines.push(`X-SOCIALPROFILE;TYPE=instagram:${escapeVCardValue(card.instagram_url)}`)
  }

  if (card.address_line || card.city || card.state || card.country) {
    lines.push(
      `ADR;CHARSET=UTF-8;TYPE=work:;;${escapeVCardValue(card.address_line || '')};${escapeVCardValue(
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

    const content = generateVCard(data as BusinessCard, getLanguage(req.query.lang))
    const fileName = `${slug}.vcf`

    res.setHeader('Content-Type', 'text/vcard; charset=utf-8')
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`)
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).send(Buffer.from(content, 'utf8'))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro desconhecido'
    res.status(500).json({ error: message })
  }
}
