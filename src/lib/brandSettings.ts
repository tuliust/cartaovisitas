import { supabase } from './supabase'

export type BrandSettings = {
  id?: string
  logo_url: string
  favicon_url: string
  og_image_url: string
  background_image_url: string
  primary_color: string
  secondary_color: string
  background_color: string
  surface_color: string
  text_color: string
}

export type BrandAssetType = 'logo' | 'favicon' | 'og-image' | 'background'

export const defaultBrandSettings: BrandSettings = {
  logo_url: '/invest-rs-logo.png',
  favicon_url: '/favicon.svg',
  og_image_url: '/og-image.png',
  background_image_url: '',
  primary_color: '#050505',
  secondary_color: '#f7f3eb',
  background_color: '#050505',
  surface_color: '#111111',
  text_color: '#ffffff',
}

const assetRules: Record<BrandAssetType, { types: string[]; maxSize: number }> = {
  logo: { types: ['image/png', 'image/svg+xml', 'image/webp'], maxSize: 2 * 1024 * 1024 },
  favicon: { types: ['image/x-icon', 'image/vnd.microsoft.icon', 'image/svg+xml', 'image/png'], maxSize: 512 * 1024 },
  'og-image': { types: ['image/png', 'image/jpeg', 'image/webp'], maxSize: 3 * 1024 * 1024 },
  background: { types: ['image/png', 'image/jpeg', 'image/webp'], maxSize: 5 * 1024 * 1024 },
}

function requireSupabase() {
  if (!supabase) throw new Error('Supabase não configurado. Verifique as variáveis de ambiente.')
  return supabase
}

function withDefaults(data?: Partial<BrandSettings> | null): BrandSettings {
  const merged = { ...defaultBrandSettings, ...data }
  return {
    ...merged,
    logo_url: merged.logo_url || defaultBrandSettings.logo_url,
    favicon_url: merged.favicon_url || defaultBrandSettings.favicon_url,
    og_image_url: merged.og_image_url || defaultBrandSettings.og_image_url,
    background_image_url: merged.background_image_url || '',
    primary_color: merged.primary_color || defaultBrandSettings.primary_color,
    secondary_color: merged.secondary_color || defaultBrandSettings.secondary_color,
    background_color: merged.background_color || defaultBrandSettings.background_color,
    surface_color: merged.surface_color || defaultBrandSettings.surface_color,
    text_color: merged.text_color || defaultBrandSettings.text_color,
  }
}

export async function getBrandSettings(): Promise<BrandSettings> {
  const { data, error } = await requireSupabase().from('brand_settings').select('*').limit(1).maybeSingle()
  if (error) throw error
  return withDefaults(data)
}

export async function updateBrandSettings(values: BrandSettings): Promise<BrandSettings> {
  const client = requireSupabase()
  const { id, ...settings } = values
  const payload = { ...settings, updated_at: new Date().toISOString() }
  const query = id
    ? client.from('brand_settings').update(payload).eq('id', id)
    : client.from('brand_settings').insert({ ...payload, singleton: true })
  const { data, error } = await query.select('*').single()
  if (error) throw error
  return withDefaults(data)
}

function getExtension(file: File) {
  return file.name.split('.').pop()?.toLowerCase() || (file.type === 'image/jpeg' ? 'jpg' : 'png')
}

export async function uploadBrandAsset(file: File, type: BrandAssetType): Promise<string> {
  const rule = assetRules[type]
  if (type === 'background' && (!rule.types.includes(file.type) || file.size > rule.maxSize)) {
    throw new Error('Envie uma imagem JPG, PNG ou WebP com até 5 MB.')
  }
  if (!rule.types.includes(file.type)) throw new Error(`Asset de marca: formato não permitido para ${type}.`)
  if (file.size > rule.maxSize) throw new Error(`Asset de marca: o arquivo de ${type} excede o limite permitido.`)

  const client = requireSupabase()
  const path = `brand/${type}-${Date.now()}.${getExtension(file)}`
  const { error } = await client.storage.from('business-card-assets').upload(path, file, {
    cacheControl: '3600', contentType: file.type, upsert: false,
  })
  if (error) throw error
  return client.storage.from('business-card-assets').getPublicUrl(path).data.publicUrl
}

export function isValidHexColor(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value)
}
