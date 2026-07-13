import type { AuditLog } from './audit'

export type AuditEventPresentation = {
  title: string
  context: string
}

const actionLabels: Record<string, string> = {
  card_created: 'Cartão cadastrado',
  card_updated: 'Cartão atualizado',
  card_deleted: 'Cartão excluído',
  card_activated: 'Cartão ativado',
  card_deactivated: 'Cartão desativado',
  employee_card_created: 'Cartão cadastrado pelo colaborador',
  employee_card_updated: 'Dados do cartão atualizados',
  profile_photo_updated: 'Atualização da foto do perfil',
  user_registered: 'Cadastro realizado',
  user_invited: 'Convite enviado',
  user_promoted_admin: 'Usuário promovido a administrador',
  user_removed_admin: 'Acesso de administrador removido',
  user_blocked: 'Usuário bloqueado',
  user_unblocked: 'Usuário desbloqueado',
  brand_settings_updated: 'Identidade visual atualizada',
  brand_asset_uploaded: 'Upload de asset institucional',
  managed_page_updated: 'Conteúdo de página atualizado',
  managed_page_published: 'Página publicada',
  managed_page_unpublished: 'Página despublicada',
  managed_page_restored: 'Conteúdo padrão restaurado',
  bulk_import_started: 'Importação de cartões iniciada',
  bulk_import_completed: 'Importação de cartões concluída',
  bulk_import_failed: 'Falha na importação de cartões',
}

const targetTypeLabels: Record<string, string> = {
  auth_user: 'Cadastro',
  brand_settings: 'Identidade visual',
  managed_page: 'Página gerenciada',
  business_card: 'Cartão',
  bulk_import: 'Importação em lote',
  profile: 'Perfil',
  user: 'Usuário',
  user_profile: 'Perfil de usuário',
}

const assetLabels: Record<string, string> = {
  logo: 'logo institucional',
  favicon: 'favicon',
  'og-image': 'imagem de compartilhamento',
  background: 'imagem de fundo',
  'apple-touch-icon': 'ícone Apple Touch',
  'logo-on-dark': 'logo para fundo escuro',
  'logo-on-light': 'logo para fundo claro',
  'card-bg-dark-1': 'imagem escura 1',
  'card-bg-dark-2': 'imagem escura 2',
  'card-bg-light-3': 'imagem clara 1',
  'card-bg-light-4': 'imagem clara 2',
}

const changedFieldLabels: Record<string, string> = {
  primary_color: 'Alteração da cor primária',
  secondary_color: 'Alteração da cor de destaque e dos botões',
  background_color: 'Alteração da cor de fundo',
  surface_color: 'Alteração da cor das superfícies',
  text_color: 'Alteração da cor dos textos',
  visual_variant_settings: 'Configurações das variantes visuais atualizadas',
  browser_title: 'Título das janelas do navegador atualizado',
  apple_touch_title: 'Título do Apple Touch atualizado',
  favicon_url: 'Atualização do favicon',
  og_image_url: 'Atualização da imagem de compartilhamento',
  background_image_url: 'Atualização da imagem de fundo',
  apple_touch_icon_url: 'Atualização do ícone Apple Touch',
  logo_on_dark_url: 'Atualização do logo para fundo escuro',
  logo_on_light_url: 'Atualização do logo para fundo claro',
  card_bg_dark_image_1_url: 'Atualização da imagem escura 1',
  card_bg_dark_image_2_url: 'Atualização da imagem escura 2',
  card_bg_light_image_3_url: 'Atualização da imagem clara 1',
  card_bg_light_image_4_url: 'Atualização da imagem clara 2',
  avatar_url: 'Atualização da foto do perfil',
  show_avatar_public: 'Visibilidade da foto do perfil atualizada',
}

const colorFields = new Set([
  'primary_color',
  'secondary_color',
  'background_color',
  'surface_color',
  'text_color',
  'visual_variant_settings',
])

const assetFields = new Set([
  'favicon_url',
  'og_image_url',
  'background_image_url',
  'apple_touch_icon_url',
  'logo_on_dark_url',
  'logo_on_light_url',
  'card_bg_dark_image_1_url',
  'card_bg_dark_image_2_url',
  'card_bg_light_image_3_url',
  'card_bg_light_image_4_url',
])

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function humanizeCode(value: string) {
  const normalized = value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!normalized) return 'Evento administrativo'
  return normalized.charAt(0).toLocaleUpperCase('pt-BR') + normalized.slice(1)
}

function readChangedFields(log: AuditLog): string[] {
  const metadata = isRecord(log.metadata) ? log.metadata : {}
  const fromMetadata = metadata.changed_fields

  if (Array.isArray(fromMetadata)) {
    return fromMetadata.filter((item): item is string => typeof item === 'string')
  }

  const beforeData = log.before_data
  const afterData = log.after_data

  if (!isRecord(beforeData) || !isRecord(afterData)) {
    return []
  }

  const keys = new Set([
    ...Object.keys(beforeData),
    ...Object.keys(afterData),
  ])

  return Array.from(keys).filter(
    (key) => JSON.stringify(beforeData[key]) !== JSON.stringify(afterData[key]),
  )
}

function getBrandSettingsTitle(log: AuditLog) {
  const changedFields = readChangedFields(log)

  if (changedFields.length === 1) {
    return changedFieldLabels[changedFields[0]] ?? 'Identidade visual atualizada'
  }

  if (changedFields.length > 1 && changedFields.every((field) => colorFields.has(field))) {
    return 'Cores da identidade visual atualizadas'
  }

  if (changedFields.length > 1 && changedFields.every((field) => assetFields.has(field))) {
    return 'Assets da identidade visual atualizados'
  }

  return 'Identidade visual atualizada'
}

function getEmployeeCardTitle(log: AuditLog) {
  const changedFields = readChangedFields(log)

  if (changedFields.length === 1) {
    return changedFieldLabels[changedFields[0]] ?? 'Dados do cartão atualizados'
  }

  if (changedFields.includes('avatar_url')) {
    return 'Foto e dados do perfil atualizados'
  }

  return 'Dados do cartão atualizados'
}

function getAssetUploadTitle(log: AuditLog) {
  const metadata = isRecord(log.metadata) ? log.metadata : {}
  const afterData = isRecord(log.after_data) ? log.after_data : {}
  const assetType = [
    log.target_label,
    typeof metadata.asset_type === 'string' ? metadata.asset_type : null,
    typeof afterData.type === 'string' ? afterData.type : null,
  ].find((value): value is string => Boolean(value))

  return assetType && assetLabels[assetType]
    ? `Upload de ${assetLabels[assetType]}`
    : 'Upload de asset institucional'
}

export function getAuditActionLabel(action: string) {
  return actionLabels[action] ?? humanizeCode(action)
}

export function getAuditTargetTypeLabel(targetType: string) {
  return targetTypeLabels[targetType] ?? humanizeCode(targetType)
}

export function getAuditChangedFields(log: AuditLog) {
  return readChangedFields(log)
}

export function getAuditEventPresentation(log: AuditLog): AuditEventPresentation {
  let title = getAuditActionLabel(log.action)

  if (log.action === 'brand_asset_uploaded') {
    title = getAssetUploadTitle(log)
  } else if (log.action === 'brand_settings_updated') {
    title = getBrandSettingsTitle(log)
  } else if (log.action === 'employee_card_updated' || log.action === 'card_updated') {
    title = getEmployeeCardTitle(log)
  }

  const defaultContext = getAuditTargetTypeLabel(log.target_type)
  let context = log.target_label || log.target_id || defaultContext

  if (log.target_type === 'business_card' && context && !context.startsWith('/') && !context.includes('@')) {
    context = `/${context}`
  }

  if (log.target_type === 'brand_settings') {
    context = 'Identidade visual'
  }

  return { title, context }
}

export function getAuditSearchText(log: AuditLog) {
  const presentation = getAuditEventPresentation(log)

  return [
    log.actor_email,
    log.action,
    log.target_type,
    log.target_label,
    log.target_id,
    presentation.title,
    presentation.context,
    getAuditActionLabel(log.action),
    getAuditTargetTypeLabel(log.target_type),
  ]
    .filter(Boolean)
    .join(' ')
}

export function formatAuditDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(date)
}

export function hasAuditData(value: unknown) {
  if (value === null || value === undefined) return false
  if (Array.isArray(value)) return value.length > 0
  if (isRecord(value)) return Object.keys(value).length > 0
  return true
}

export function formatAuditJson(value: unknown) {
  return JSON.stringify(value, null, 2)
}
