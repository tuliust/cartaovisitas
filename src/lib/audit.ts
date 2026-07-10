import { getCurrentUser } from './auth'
import { supabase } from './supabase'

export type AuditAction = 'card_created' | 'card_updated' | 'card_deleted' | 'card_activated' | 'card_deactivated' | 'user_invited' | 'user_promoted_admin' | 'user_removed_admin' | 'user_blocked' | 'user_unblocked' | 'brand_settings_updated' | 'brand_asset_uploaded' | 'bulk_import_started' | 'bulk_import_completed' | 'bulk_import_failed'
export type AuditLog = { id: string; actor_id: string | null; actor_email: string | null; action: AuditAction | string; target_type: string; target_id: string | null; target_label: string | null; before_data: unknown; after_data: unknown; metadata: Record<string, unknown>; created_at: string }

export async function recordAuditLog(input: { action: AuditAction; targetType: string; targetId?: string | null; targetLabel?: string | null; beforeData?: unknown; afterData?: unknown; metadata?: Record<string, unknown> }) {
  if (!supabase) return false
  try {
    const user = await getCurrentUser()
    if (!user?.email) return false
    const { error } = await supabase.from('audit_logs').insert({ actor_id: user.id, actor_email: user.email, action: input.action, target_type: input.targetType, target_id: input.targetId ?? null, target_label: input.targetLabel ?? null, before_data: input.beforeData ?? null, after_data: input.afterData ?? null, metadata: input.metadata ?? {} })
    if (error) throw error
    return true
  } catch (error) {
    console.warn('Não foi possível registrar auditoria.', error)
    return false
  }
}

export async function getAuditLogs() {
  if (!supabase) throw new Error('Supabase não configurado.')
  const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(1000)
  if (error) throw error
  return (data ?? []) as AuditLog[]
}
