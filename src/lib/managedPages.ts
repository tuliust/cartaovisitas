import { getCurrentUser } from './auth'
import { managedPageDefaults, normalizeSectionId, type ManagedPage, type ManagedPageContent, type ManagedPageKey } from './managedPageDefaults'
import { supabase } from './supabase'

function record(value: unknown): value is Record<string, unknown> { return Boolean(value) && typeof value === 'object' && !Array.isArray(value) }
function text(value: unknown) { return typeof value === 'string' ? value.trim() : '' }
function requireSupabase() { if (!supabase) throw new Error('Supabase não configurado. Verifique as variáveis de ambiente.'); return supabase }

export function containsMojibake(value: unknown): boolean {
  if (typeof value === 'string') return /Ã|Â|â€|â€œ|â€|â€“|â€”|â€™|�|ConteÃ|VersÃ|revisÃ|jurÃ|UtilizaÃ|VisÃ|reÃº|mÃ©|cartÃ/i.test(value)
  if (Array.isArray(value)) return value.some((item) => containsMojibake(item))
  if (record(value)) return Object.values(value).some((item) => containsMojibake(item))
  return false
}

export function normalizeManagedPageContent(value: unknown): ManagedPageContent | null {
  if (!record(value) || !Array.isArray(value.sections)) return null
  const sections = value.sections.map((item) => {
    if (!record(item)) return null
    const id = normalizeSectionId(text(item.id))
    const title = text(item.title)
    const body = text(item.body)
    return id && title && body ? { id, title, body } : null
  }).filter((item): item is NonNullable<typeof item> => Boolean(item))
  if (!sections.length || new Set(sections.map(({ id }) => id)).size !== sections.length) return null
  const noticeValue = value.notice
  const notice = record(noticeValue) && text(noticeValue.title) && text(noticeValue.body) ? { title: text(noticeValue.title), body: text(noticeValue.body) } : undefined
  return { ...(notice ? { notice } : {}), sections }
}

function applyPagePresentationRules(key: ManagedPageKey, page: ManagedPage): ManagedPage {
  if (key !== 'terms_and_privacy') return page
  const fallback = managedPageDefaults.terms_and_privacy
  return {
    ...page,
    subtitle: '',
    version_label: fallback.version_label,
    content: fallback.content,
  }
}

function normalizeRow(key: ManagedPageKey, row: unknown): ManagedPage | null {
  if (!record(row)) return null
  if (containsMojibake({ title: row.title, subtitle: row.subtitle, version_label: row.version_label, content: row.content })) return null
  const content = normalizeManagedPageContent(row.content)
  const visibility = row.visibility === 'public' || row.visibility === 'authenticated' ? row.visibility : null
  if (!content || !visibility || !text(row.title)) return null
  return applyPagePresentationRules(key, { ...managedPageDefaults[key], ...row, page_key: key, title: text(row.title), subtitle: text(row.subtitle), version_label: text(row.version_label), visibility, content } as ManagedPage)
}

export async function getManagedPage(key: ManagedPageKey): Promise<ManagedPage> {
  try {
    const { data, error } = await requireSupabase().from('managed_pages').select('*').eq('page_key', key).maybeSingle()
    if (error) throw error
    return normalizeRow(key, data) ?? managedPageDefaults[key]
  } catch {
    return managedPageDefaults[key]
  }
}

export async function getManagedPagesForAdmin(): Promise<ManagedPage[]> {
  const { data, error } = await requireSupabase().from('managed_pages').select('*').in('page_key', Object.keys(managedPageDefaults)).order('page_key')
  if (error) throw error
  return (Object.keys(managedPageDefaults) as ManagedPageKey[]).map((key) => normalizeRow(key, data?.find((row: { page_key?: string }) => row.page_key === key)) ?? managedPageDefaults[key])
}

export async function saveManagedPage(page: ManagedPage): Promise<ManagedPage> {
  const user = await getCurrentUser()
  if (!user) throw new Error('Sessão expirada.')
  const payload = { page_key: page.page_key, route_path: page.route_path, title: page.title.trim(), subtitle: page.subtitle.trim() || null, content: page.content, visibility: page.visibility, is_published: page.is_published, version_label: page.version_label.trim() || null, updated_by: user.id }
  const query = page.id ? requireSupabase().from('managed_pages').update(payload).eq('id', page.id) : requireSupabase().from('managed_pages').insert(payload)
  const { data, error } = await query.select('*').single()
  if (error) throw error
  return normalizeRow(page.page_key, data) ?? page
}
