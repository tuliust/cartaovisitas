export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function normalizeBrazilianPhone(value: string): string {
  const digits = onlyDigits(value)
  const national = digits.startsWith('55') ? digits.slice(2) : digits
  return national.slice(0, 11)
}

export function formatBrazilianPhone(value: string): string {
  const digits = normalizeBrazilianPhone(value)
  if (!digits) return ''

  const areaCode = digits.slice(0, 2)
  const number = digits.slice(2)
  const firstPartLength = number.length > 8 ? 5 : 4
  const firstPart = number.slice(0, firstPartLength)
  const lastPart = number.slice(firstPartLength, firstPartLength + 4)

  let formatted = '+55'
  if (areaCode) formatted += ` ${areaCode}`
  if (firstPart) formatted += ` ${firstPart}`
  if (lastPart) formatted += `-${lastPart}`
  return formatted
}
