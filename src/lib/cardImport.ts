import { createAdminCard, defaultCardFormValues, listAdminCards, normalizeSlug, updateAdminCard, type CardFormValues } from './adminCards'
import { formatBrazilianPhone } from './phone'
import { buildInstagramUrl, buildLinkedinUrl } from './socialLinks'

export type ImportMode = 'new' | 'email' | 'slug'
export type CardImportRow = { line: number; raw: Record<string, string>; values: CardFormValues; errors: string[] }
export type CardImportResult = { created: number; updated: number; ignored: number }

export const importColumns = ['full_name','display_name','email','slug','job_title_pt','job_title_es','job_title_en','department_pt','department_es','department_en','mobile_phone','linkedin','instagram','show_avatar_public','is_active'] as const

function parseCsv(text: string) {
  const rows: string[][] = []; let row: string[] = []; let field = ''; let quoted = false
  for (let index = 0; index < text.length; index += 1) { const char = text[index]; const next = text[index + 1]; if (char === '"' && quoted && next === '"') { field += '"'; index += 1 } else if (char === '"') quoted = !quoted; else if (char === ',' && !quoted) { row.push(field); field = '' } else if ((char === '\n' || char === '\r') && !quoted) { if (char === '\r' && next === '\n') index += 1; row.push(field); if (row.some(Boolean)) rows.push(row); row = []; field = '' } else field += char }
  row.push(field); if (row.some(Boolean)) rows.push(row); return rows
}

function bool(value: string, fallback: boolean, errors: string[], label: string) { if (!value) return fallback; if (value.toLowerCase() === 'true') return true; if (value.toLowerCase() === 'false') return false; errors.push(`${label} deve ser true ou false.`); return fallback }

export async function parseCardImportFile(file: File): Promise<CardImportRow[]> {
  if (!file.name.toLowerCase().endsWith('.csv')) throw new Error('Envie uma planilha CSV.')
  const parsed = parseCsv((await file.text()).replace(/^\uFEFF/, ''))
  if (parsed.length < 2) throw new Error('A planilha não contém linhas para importar.')
  const headers = parsed[0].map((item) => item.trim())
  const missing = importColumns.filter((column) => !headers.includes(column))
  if (missing.length) throw new Error(`Colunas ausentes: ${missing.join(', ')}.`)
  const existing = await listAdminCards(); const internalSlugs = new Set<string>(); const internalEmails = new Set<string>()
  return parsed.slice(1).map((fields, rowIndex) => {
    const raw = Object.fromEntries(headers.map((header, index) => [header, (fields[index] ?? '').trim()])); const errors: string[] = []; const slug = normalizeSlug(raw.slug); const email = raw.email.toLowerCase()
    if (!raw.full_name) errors.push('full_name é obrigatório.'); if (!email || !email.endsWith('@investrs.org.br')) errors.push('E-mail institucional inválido.'); if (!raw.slug) errors.push('slug é obrigatório.'); else if (slug !== raw.slug.toLowerCase()) errors.push('Slug contém caracteres inválidos.');
    if (internalSlugs.has(slug)) errors.push('Slug duplicado na planilha.'); if (internalEmails.has(email)) errors.push('E-mail duplicado na planilha.'); internalSlugs.add(slug); internalEmails.add(email)
    const values: CardFormValues = { ...defaultCardFormValues, full_name: raw.full_name, display_name: raw.display_name, email, slug, job_title_pt: raw.job_title_pt, job_title_es: raw.job_title_es || raw.job_title_pt, job_title_en: raw.job_title_en || raw.job_title_pt, department_pt: raw.department_pt, department_es: raw.department_es || raw.department_pt, department_en: raw.department_en || raw.department_pt, job_title: raw.job_title_pt, department: raw.department_pt, mobile_phone: raw.mobile_phone ? formatBrazilianPhone(raw.mobile_phone) : '', linkedin_url: raw.linkedin ? buildLinkedinUrl(raw.linkedin) : '', instagram_url: raw.instagram ? buildInstagramUrl(raw.instagram) : '', show_avatar_public: bool(raw.show_avatar_public, false, errors, 'show_avatar_public'), is_active: bool(raw.is_active, true, errors, 'is_active') }
    const slugMatch = existing.find((card) => card.slug === slug); const emailMatch = existing.find((card) => card.email?.toLowerCase() === email); if (slugMatch && emailMatch && slugMatch.id !== emailMatch.id) errors.push('Slug e e-mail pertencem a cartões diferentes no banco.')
    return { line: rowIndex + 2, raw, values, errors }
  })
}

export async function importCardRows(rows: CardImportRow[], mode: ImportMode): Promise<CardImportResult> {
  const result = { created: 0, updated: 0, ignored: 0 }; const existing = await listAdminCards()
  for (const row of rows) { if (row.errors.length) { result.ignored += 1; continue } const match = mode === 'email' ? existing.find((card) => card.email?.toLowerCase() === row.values.email.toLowerCase()) : mode === 'slug' ? existing.find((card) => card.slug === row.values.slug) : undefined; const duplicate = existing.find((card) => card.slug === row.values.slug || card.email?.toLowerCase() === row.values.email.toLowerCase()); if (match) { await updateAdminCard(match.id, row.values); result.updated += 1 } else if (duplicate || mode === 'new' && duplicate) result.ignored += 1; else { const created = await createAdminCard(row.values); existing.push(created); result.created += 1 } }
  return result
}

export function downloadCardImportTemplate() {
  const example = ['Tulius Márcio Tsangaropulos Souza','Tulius Souza','tulius.souza@investrs.org.br','tulius-souza','Analista Executivo','Analista Ejecutivo','Executive Analyst','Comunicação','Comunicación','Communications','+55 51 99999-9999','tulius-souza','tulius.souza','false','true']
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`; const csv = `\uFEFF${importColumns.join(',')}\r\n${example.map(escape).join(',')}\r\n`; const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'modelo-importacao-cartoes-invest-rs.csv'; document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url)
}
