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
    text.startsWith('asset de marca:') ||
    text.includes('use um e-mail institucional')
  ) {
    return rawText
  }

  if (text.includes('invalid login credentials')) return 'E-mail ou senha incorretos.'
  if (text.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar.'
  if (text.includes('password') && (text.includes('weak') || text.includes('least'))) return 'Use uma senha mais segura.'
  if (text.includes('already registered') || text.includes('user already exists')) {
    return 'Este e-mail já possui cadastro. Tente entrar ou recuperar a senha.'
  }
  if (text.includes('não tem permissão para acessar a área restrita')) return rawText

  if (
    text.includes('duplicate key') ||
    text.includes('unique constraint') ||
    text.includes('business_cards_slug_key') ||
    text.includes('23505')
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
