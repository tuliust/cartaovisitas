import type { BusinessCard } from './cards'

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

export function buildVCardFileName(card: BusinessCard) {
  return `${card.slug || 'contato'}.vcf`
}

export function generateVCard(card: BusinessCard) {
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
