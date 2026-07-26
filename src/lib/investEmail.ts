export const INVEST_EMAIL_DOMAIN = '@investrs.org.br'

export type ParsedInvestEmailInput = {
  prefix: string
  error: string
}

export function normalizeInvestEmailInput(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '').split('@')[0] ?? ''
}

export function normalizeInvestEmailAddressInput(value: string): string {
  return value.toLowerCase().replace(/\s+/g, '')
}

export function parseInvestEmailInput(value: string): ParsedInvestEmailInput {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, '')
  const prefix = normalizeInvestEmailInput(normalized)
  const atIndex = normalized.indexOf('@')

  if (atIndex < 0) return { prefix, error: '' }

  const suppliedDomain = normalized.slice(atIndex)
  if (suppliedDomain !== INVEST_EMAIL_DOMAIN) {
    return {
      prefix,
      error: `Use seu e-mail institucional ${INVEST_EMAIL_DOMAIN}.`,
    }
  }

  return { prefix, error: '' }
}

export function getInvestEmailPrefix(email: string): string {
  return normalizeInvestEmailInput(email)
}

export function buildInvestEmail(prefixOrEmail: string): string {
  const normalizedPrefix = normalizeInvestEmailInput(prefixOrEmail)
  return normalizedPrefix ? `${normalizedPrefix}${INVEST_EMAIL_DOMAIN}` : ''
}
