export const INVEST_EMAIL_DOMAIN = '@investrs.org.br'

export function normalizeInvestEmailInput(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '').split('@')[0] ?? ''
}

export function getInvestEmailPrefix(email: string): string {
  return normalizeInvestEmailInput(email)
}

export function buildInvestEmail(prefix: string): string {
  const normalizedPrefix = normalizeInvestEmailInput(prefix)
  return normalizedPrefix ? `${normalizedPrefix}${INVEST_EMAIL_DOMAIN}` : ''
}
