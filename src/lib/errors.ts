function readErrorText(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object') {
    const maybeError = error as { message?: unknown; details?: unknown; code?: unknown }
    return [maybeError.message, maybeError.details, maybeError.code].filter(Boolean).join(' ')
  }

  return ''
}

export function getFriendlyErrorMessage(error: unknown): string {
  const rawText = readErrorText(error)
  const text = rawText.toLowerCase()

  if (
    text.startsWith('avatar:') ||
    text.startsWith('logo:') ||
    text.includes('use um e-mail institucional')
  ) {
    return rawText
  }

  if (
    text.includes('duplicate key') ||
    text.includes('unique constraint') ||
    text.includes('business_cards_slug_key')
  ) {
    return 'Já existe um cartão com esse slug. Escolha outro endereço.'
  }

  if (text.includes('permission denied') || text.includes('row-level security') || text.includes('rls')) {
    return 'Seu usuário não tem permissão para executar esta ação.'
  }

  if (text.includes('jwt') || text.includes('session') || text.includes('auth')) {
    return 'Sua sessão expirou. Faça login novamente.'
  }

  if (text.includes('network') || text.includes('fetch failed') || text.includes('failed to fetch')) {
    return 'Não foi possível conectar ao servidor. Tente novamente em instantes.'
  }

  if (text.includes('supabase') && (text.includes('não configurado') || text.includes('nao configurado'))) {
    return 'Configuração do Supabase não encontrada.'
  }

  return 'Não foi possível concluir a operação. Tente novamente.'
}
