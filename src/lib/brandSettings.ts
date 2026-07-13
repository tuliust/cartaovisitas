import { supabase } from './supabase'
import type { PublicVisualVariant } from './cardVisualVariants'

export const DEFAULT_BROWSER_TITLE = 'Cartões Digitais | Invest RS'
export const DEFAULT_APPLE_TOUCH_TITLE = 'Cartões Digitais'
export const BRAND_SETTINGS_CACHE_KEY = 'invest-rs-brand-settings-v2'

export type VisualVariantSettings = {
  primary_color: string
  secondary_color: string
  background_color: string
  surface_color: string
  text_color: string
  background_overlay_opacity: number
  card_surface_opacity: number
}

export type VisualVariantSettingsMap = Record<PublicVisualVariant, VisualVariantSettings>

export type BrandSettings = {
  id?: string
  logo_url: string
  favicon_url: string
  og_image_url: string
  background_image_url: string
  logo_on_dark_url: string
  logo_on_light_url: string
  card_bg_dark_image_1_url: string
  card_bg_dark_image_2_url: string
  card_bg_light_image_3_url: string
  card_bg_light_image_4_url: string
  apple_touch_icon_url: string
  browser_title: string
  apple_touch_title: string
  primary_color: string
  secondary_color: string
  background_color: string
  surface_color: string
  text_color: string
  visual_variant_settings: VisualVariantSettingsMap
}

export type BrandAssetType = 'logo' | 'favicon' | 'og-image' | 'background' | 'apple-touch-icon' | 'logo-on-dark' | 'logo-on-light' | 'card-bg-dark-1' | 'card-bg-dark-2' | 'card-bg-light-3' | 'card-bg-light-4'

const darkDefaults = {
  primary_color: '#050505', secondary_color: '#f7f3eb', background_color: '#050505',
  surface_color: '#111111', text_color: '#ffffff', card_surface_opacity: 0.78,
}
const lightDefaults = {
  primary_color: '#111111', secondary_color: '#555555', background_color: '#f4f1eb',
  surface_color: '#ffffff', text_color: '#111111', card_surface_opacity: 0.82,
}

export const defaultVisualVariantSettings: VisualVariantSettingsMap = {
  dark_black: { ...darkDefaults, background_overlay_opacity: 0 },
  dark_image_1: { ...darkDefaults, background_overlay_opacity: 0.72 },
  dark_image_2: { ...darkDefaults, background_overlay_opacity: 0.72 },
  light_white: { ...lightDefaults, background_overlay_opacity: 0 },
  light_image_3: { ...lightDefaults, background_overlay_opacity: 0.75 },
  light_image_4: { ...lightDefaults, background_overlay_opacity: 0.75 },
}

export const defaultBrandSettings: BrandSettings = {
  logo_url: '/invest-rs-logo.png', favicon_url: '/favicon.svg', og_image_url: '/og-image.png',
  background_image_url: '', logo_on_dark_url: '', logo_on_light_url: '',
  card_bg_dark_image_1_url: '', card_bg_dark_image_2_url: '', card_bg_light_image_3_url: '',
  card_bg_light_image_4_url: '', apple_touch_icon_url: '', browser_title: DEFAULT_BROWSER_TITLE,
  apple_touch_title: DEFAULT_APPLE_TOUCH_TITLE, primary_color: '#050505', secondary_color: '#f7f3eb',
  background_color: '#050505', surface_color: '#111111', text_color: '#ffffff',
  visual_variant_settings: defaultVisualVariantSettings,
}

const assetRules: Record<BrandAssetType, { types: string[]; maxSize: number }> = {
  logo: { types: ['image/png', 'image/svg+xml', 'image/webp'], maxSize: 2 * 1024 * 1024 },
  favicon: { types: ['image/x-icon', 'image/vnd.microsoft.icon', 'image/svg+xml', 'image/png'], maxSize: 512 * 1024 },
  'og-image': { types: ['image/png', 'image/jpeg', 'image/webp'], maxSize: 3 * 1024 * 1024 },
  background: { types: ['image/png', 'image/jpeg', 'image/webp'], maxSize: 5 * 1024 * 1024 },
  'apple-touch-icon': { types: ['image/png'], maxSize: 1024 * 1024 },
  'logo-on-dark': { types: ['image/png', 'image/svg+xml', 'image/webp'], maxSize: 2 * 1024 * 1024 },
  'logo-on-light': { types: ['image/png', 'image/svg+xml', 'image/webp'], maxSize: 2 * 1024 * 1024 },
  'card-bg-dark-1': { types: ['image/png', 'image/jpeg', 'image/webp'], maxSize: 5 * 1024 * 1024 },
  'card-bg-dark-2': { types: ['image/png', 'image/jpeg', 'image/webp'], maxSize: 5 * 1024 * 1024 },
  'card-bg-light-3': { types: ['image/png', 'image/jpeg', 'image/webp'], maxSize: 5 * 1024 * 1024 },
  'card-bg-light-4': { types: ['image/png', 'image/jpeg', 'image/webp'], maxSize: 5 * 1024 * 1024 },
}

function requireSupabase() { if (!supabase) throw new Error('Supabase não configurado. Verifique as variáveis de ambiente.'); return supabase }
export function isValidHexColor(value: string) { return /^#[0-9a-f]{6}$/i.test(value) }
function validOpacity(value: unknown, fallback: number) { const parsed = typeof value === 'number' ? value : Number(value); return Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : fallback }
function validColor(value: unknown, fallback: string) { return typeof value === 'string' && isValidHexColor(value) ? value : fallback }
function cleanTitle(value: unknown, fallback: string, maxLength: number) { if (typeof value !== 'string') return fallback; const clean = value.replace(/[\r\n]+/g, ' ').trim(); return clean && clean.length <= maxLength && !/[<>]/.test(clean) ? clean : fallback }

function normalizeVariants(value: unknown, legacy: Pick<BrandSettings, 'primary_color' | 'secondary_color' | 'background_color' | 'surface_color' | 'text_color'>): VisualVariantSettingsMap {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
  return Object.fromEntries((Object.keys(defaultVisualVariantSettings) as PublicVisualVariant[]).map((variant) => {
    const defaults = defaultVisualVariantSettings[variant]
    const entry = source[variant] && typeof source[variant] === 'object' && !Array.isArray(source[variant]) ? source[variant] as Record<string, unknown> : {}
    const useLegacy = Object.keys(entry).length === 0
    return [variant, {
      primary_color: validColor(entry.primary_color, useLegacy ? legacy.primary_color : defaults.primary_color),
      secondary_color: validColor(entry.secondary_color, useLegacy ? legacy.secondary_color : defaults.secondary_color),
      background_color: validColor(entry.background_color, useLegacy ? legacy.background_color : defaults.background_color),
      surface_color: validColor(entry.surface_color, useLegacy ? legacy.surface_color : defaults.surface_color),
      text_color: validColor(entry.text_color, useLegacy ? legacy.text_color : defaults.text_color),
      background_overlay_opacity: validOpacity(entry.background_overlay_opacity, defaults.background_overlay_opacity),
      card_surface_opacity: validOpacity(entry.card_surface_opacity, defaults.card_surface_opacity),
    }]
  })) as VisualVariantSettingsMap
}

export function normalizeBrandSettings(data?: Partial<BrandSettings> | null): BrandSettings {
  const merged = { ...defaultBrandSettings, ...data }
  const legacy = {
    primary_color: validColor(merged.primary_color, defaultBrandSettings.primary_color), secondary_color: validColor(merged.secondary_color, defaultBrandSettings.secondary_color),
    background_color: validColor(merged.background_color, defaultBrandSettings.background_color), surface_color: validColor(merged.surface_color, defaultBrandSettings.surface_color),
    text_color: validColor(merged.text_color, defaultBrandSettings.text_color),
  }
  return { ...merged, ...legacy,
    logo_url: merged.logo_url || defaultBrandSettings.logo_url, favicon_url: merged.favicon_url || defaultBrandSettings.favicon_url,
    og_image_url: merged.og_image_url || defaultBrandSettings.og_image_url, background_image_url: merged.background_image_url || '',
    logo_on_dark_url: merged.logo_on_dark_url || '', logo_on_light_url: merged.logo_on_light_url || '',
    card_bg_dark_image_1_url: merged.card_bg_dark_image_1_url || '', card_bg_dark_image_2_url: merged.card_bg_dark_image_2_url || '',
    card_bg_light_image_3_url: merged.card_bg_light_image_3_url || '', card_bg_light_image_4_url: merged.card_bg_light_image_4_url || '',
    apple_touch_icon_url: merged.apple_touch_icon_url || '', browser_title: cleanTitle(merged.browser_title, DEFAULT_BROWSER_TITLE, 100),
    apple_touch_title: cleanTitle(merged.apple_touch_title, DEFAULT_APPLE_TOUCH_TITLE, 40),
    visual_variant_settings: normalizeVariants(merged.visual_variant_settings, legacy),
  }
}

export function readCachedBrandSettings(): BrandSettings | null { try { const raw = localStorage.getItem(BRAND_SETTINGS_CACHE_KEY); return raw ? normalizeBrandSettings(JSON.parse(raw) as Partial<BrandSettings>) : null } catch { return null } }
export function cacheBrandSettings(settings: BrandSettings) { try { localStorage.setItem(BRAND_SETTINGS_CACHE_KEY, JSON.stringify(settings)) } catch { /* cache is optional */ } }
export async function getBrandSettings(): Promise<BrandSettings> { const { data, error } = await requireSupabase().from('brand_settings').select('*').limit(1).maybeSingle(); if (error) throw error; return normalizeBrandSettings(data as Partial<BrandSettings> | null) }
export async function updateBrandSettings(values: BrandSettings): Promise<BrandSettings> { const client = requireSupabase(); const { id, ...settings } = values; const payload = { ...settings, updated_at: new Date().toISOString() }; const query = id ? client.from('brand_settings').update(payload).eq('id', id) : client.from('brand_settings').insert({ ...payload, singleton: true }); const { data, error } = await query.select('*').single(); if (error) throw error; return normalizeBrandSettings(data as Partial<BrandSettings>) }

function getExtension(file: File) { return file.name.split('.').pop()?.toLowerCase() || (file.type === 'image/jpeg' ? 'jpg' : 'png') }
export async function uploadBrandAsset(file: File, type: BrandAssetType): Promise<string> { const rule = assetRules[type]; const extension = getExtension(file); const typeAllowed = rule.types.includes(file.type) || (type === 'favicon' && ['ico', 'svg', 'png'].includes(extension)); if (type === 'background' && (!rule.types.includes(file.type) || file.size > rule.maxSize)) throw new Error('Envie uma imagem JPG, PNG ou WebP com até 5 MB.'); if (!typeAllowed) throw new Error(`Asset de marca: formato não permitido para ${type}.`); if (file.size > rule.maxSize) throw new Error(`Asset de marca: o arquivo de ${type} excede o limite permitido.`); const client = requireSupabase(); const path = `brand/${type}-${Date.now()}.${extension}`; const { error } = await client.storage.from('business-card-assets').upload(path, file, { cacheControl: '3600', contentType: file.type, upsert: false }); if (error) throw error; return client.storage.from('business-card-assets').getPublicUrl(path).data.publicUrl }
