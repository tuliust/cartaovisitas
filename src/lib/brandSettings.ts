import { supabase } from './supabase'
import type { PublicVisualVariant } from './cardVisualVariants'

export const DEFAULT_BROWSER_TITLE = 'Cartões Digitais | Invest RS'
export const DEFAULT_APPLE_TOUCH_TITLE = 'Cartões Digitais'
export const BRAND_SETTINGS_CACHE_KEY = 'invest-rs-brand-settings-v4'

export const templateColorPalette = ['#ffffff', '#808080', '#000000', '#00ac7c', '#fdb642', '#ee286e'] as const
export type TemplateColor = typeof templateColorPalette[number]

export type VisualVariantSettings = {
  primary_color: string
  secondary_color: string
  background_color: TemplateColor
  surface_color: TemplateColor
  text_color: TemplateColor
  background_overlay_opacity: number
  card_surface_opacity: number
  background_opacity: number
  surface_opacity: number
  overlay_color: TemplateColor
  raised_surface_color: TemplateColor
  raised_surface_opacity: number
  header_color: TemplateColor
  header_opacity: number
  text_opacity: number
  muted_text_color: TemplateColor
  muted_text_opacity: number
  subtle_text_color: TemplateColor
  subtle_text_opacity: number
  border_color: TemplateColor
  border_opacity: number
  icon_color: TemplateColor
  icon_opacity: number
  input_background_color: TemplateColor
  input_background_opacity: number
  input_text_color: TemplateColor
  input_text_opacity: number
  input_placeholder_color: TemplateColor
  input_placeholder_opacity: number
  primary_button_color: TemplateColor
  primary_button_opacity: number
  primary_button_text_color: TemplateColor
  primary_button_text_opacity: number
  secondary_button_color: TemplateColor
  secondary_button_opacity: number
  secondary_button_text_color: TemplateColor
  secondary_button_text_opacity: number
  auxiliary_button_color: TemplateColor
  auxiliary_button_opacity: number
  auxiliary_button_text_color: TemplateColor
  auxiliary_button_text_opacity: number
  focus_color: TemplateColor
  focus_opacity: number
  modal_backdrop_color: TemplateColor
  modal_backdrop_opacity: number
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

const darkDefaults: VisualVariantSettings = {
  primary_color: '#ffffff', secondary_color: '#fdb642', background_color: '#000000',
  surface_color: '#000000', text_color: '#ffffff', background_overlay_opacity: 0,
  card_surface_opacity: 0.78, background_opacity: 0, surface_opacity: 0.78,
  overlay_color: '#000000', raised_surface_color: '#000000', raised_surface_opacity: 0.94,
  header_color: '#000000', header_opacity: 0.88, text_opacity: 1,
  muted_text_color: '#ffffff', muted_text_opacity: 0.72,
  subtle_text_color: '#ffffff', subtle_text_opacity: 0.56,
  border_color: '#ffffff', border_opacity: 0.14, icon_color: '#ffffff', icon_opacity: 1,
  input_background_color: '#000000', input_background_opacity: 0.76,
  input_text_color: '#ffffff', input_text_opacity: 1,
  input_placeholder_color: '#ffffff', input_placeholder_opacity: 0.48,
  primary_button_color: '#fdb642', primary_button_opacity: 1,
  primary_button_text_color: '#000000', primary_button_text_opacity: 1,
  secondary_button_color: '#808080', secondary_button_opacity: 0.18,
  secondary_button_text_color: '#ffffff', secondary_button_text_opacity: 1,
  auxiliary_button_color: '#000000', auxiliary_button_opacity: 1,
  auxiliary_button_text_color: '#ffffff', auxiliary_button_text_opacity: 1,
  focus_color: '#fdb642', focus_opacity: 1,
  modal_backdrop_color: '#000000', modal_backdrop_opacity: 0.72,
}

const lightDefaults: VisualVariantSettings = {
  primary_color: '#000000', secondary_color: '#00ac7c', background_color: '#ffffff',
  surface_color: '#ffffff', text_color: '#000000', background_overlay_opacity: 0,
  card_surface_opacity: 0.82, background_opacity: 0, surface_opacity: 0.82,
  overlay_color: '#ffffff', raised_surface_color: '#ffffff', raised_surface_opacity: 0.94,
  header_color: '#ffffff', header_opacity: 0.88, text_opacity: 1,
  muted_text_color: '#000000', muted_text_opacity: 0.72,
  subtle_text_color: '#000000', subtle_text_opacity: 0.56,
  border_color: '#000000', border_opacity: 0.14, icon_color: '#000000', icon_opacity: 1,
  input_background_color: '#ffffff', input_background_opacity: 0.76,
  input_text_color: '#000000', input_text_opacity: 1,
  input_placeholder_color: '#000000', input_placeholder_opacity: 0.48,
  primary_button_color: '#00ac7c', primary_button_opacity: 1,
  primary_button_text_color: '#ffffff', primary_button_text_opacity: 1,
  secondary_button_color: '#808080', secondary_button_opacity: 0.18,
  secondary_button_text_color: '#000000', secondary_button_text_opacity: 1,
  auxiliary_button_color: '#ffffff', auxiliary_button_opacity: 1,
  auxiliary_button_text_color: '#000000', auxiliary_button_text_opacity: 1,
  focus_color: '#00ac7c', focus_opacity: 1,
  modal_backdrop_color: '#000000', modal_backdrop_opacity: 0.42,
}

export const defaultVisualVariantSettings: VisualVariantSettingsMap = {
  dark_black: { ...darkDefaults },
  dark_image_1: {
    ...darkDefaults,
    background_overlay_opacity: 0.72,
    background_opacity: 0.72,
    primary_button_color: '#ee286e',
    primary_button_text_color: '#ffffff',
    secondary_color: '#ee286e',
    focus_color: '#ee286e',
  },
  dark_image_2: {
    ...darkDefaults,
    background_overlay_opacity: 0.72,
    background_opacity: 0.72,
    primary_button_color: '#00ac7c',
    primary_button_text_color: '#ffffff',
    secondary_color: '#00ac7c',
    focus_color: '#00ac7c',
  },
  light_white: { ...lightDefaults },
  light_image_3: {
    ...lightDefaults,
    background_overlay_opacity: 0.75,
    background_opacity: 0.75,
    primary_button_color: '#808080',
    primary_button_text_color: '#ffffff',
    secondary_color: '#808080',
    focus_color: '#808080',
  },
  light_image_4: {
    ...lightDefaults,
    background_overlay_opacity: 0.75,
    background_opacity: 0.75,
    primary_button_color: '#fdb642',
    primary_button_text_color: '#000000',
    secondary_color: '#fdb642',
    focus_color: '#fdb642',
  },
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
function nearestPaletteColor(value: unknown, fallback: TemplateColor): TemplateColor {
  const color = validColor(value, fallback).toLowerCase()
  if ((templateColorPalette as readonly string[]).includes(color)) return color as TemplateColor
  const rgb = [1, 3, 5].map((start) => Number.parseInt(color.slice(start, start + 2), 16))
  return templateColorPalette.reduce((nearest, candidate) => {
    const candidateRgb = [1, 3, 5].map((start) => Number.parseInt(candidate.slice(start, start + 2), 16))
    const distance = candidateRgb.reduce((total, channel, index) => total + ((channel - rgb[index]) ** 2), 0)
    const nearestRgb = [1, 3, 5].map((start) => Number.parseInt(nearest.slice(start, start + 2), 16))
    const nearestDistance = nearestRgb.reduce((total, channel, index) => total + ((channel - rgb[index]) ** 2), 0)
    return distance < nearestDistance ? candidate : nearest
  }, fallback)
}
function cleanTitle(value: unknown, fallback: string, maxLength: number) { if (typeof value !== 'string') return fallback; const clean = value.replace(/[\r\n]+/g, ' ').trim(); return clean && clean.length <= maxLength && !/[<>]/.test(clean) ? clean : fallback }
function hexChannels(hex: string) { return [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16)) }
function contrastTextColor(background: TemplateColor, opacity: number, surface: TemplateColor): TemplateColor {
  const bg = hexChannels(background)
  const underlay = hexChannels(surface)
  const composed = bg.map((channel, index) => Math.round((channel * opacity) + (underlay[index] * (1 - opacity))))
  const luminance = composed.map((channel) => { const value = channel / 255; return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4 })
    .reduce((sum, channel, index) => sum + (channel * [0.2126, 0.7152, 0.0722][index]), 0)
  return luminance > 0.42 ? '#000000' : '#ffffff'
}

function normalizeVariants(value: unknown): VisualVariantSettingsMap {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
  return Object.fromEntries((Object.keys(defaultVisualVariantSettings) as PublicVisualVariant[]).map((variant) => {
    const defaults = defaultVisualVariantSettings[variant]
    const entry = source[variant] && typeof source[variant] === 'object' && !Array.isArray(source[variant]) ? source[variant] as Record<string, unknown> : {}
    const backgroundColor = nearestPaletteColor(entry.background_color, defaults.background_color)
    const surfaceColor = nearestPaletteColor(entry.surface_color, defaults.surface_color)
    const textColor = nearestPaletteColor(entry.text_color, defaults.text_color)
    const backgroundOpacity = validOpacity(entry.background_opacity ?? entry.background_overlay_opacity, defaults.background_opacity)
    const surfaceOpacity = validOpacity(entry.surface_opacity ?? entry.card_surface_opacity, defaults.surface_opacity)
    const primaryButtonColor = nearestPaletteColor(entry.primary_button_color ?? entry.secondary_color, defaults.primary_button_color)
    const primaryButtonOpacity = validOpacity(entry.primary_button_opacity, defaults.primary_button_opacity)
    const secondaryButtonColor = nearestPaletteColor(entry.secondary_button_color, defaults.secondary_button_color)
    const secondaryButtonOpacity = validOpacity(entry.secondary_button_opacity, defaults.secondary_button_opacity)
    const auxiliaryButtonColor = nearestPaletteColor(entry.auxiliary_button_color, defaults.auxiliary_button_color)
    const auxiliaryButtonOpacity = validOpacity(entry.auxiliary_button_opacity, defaults.auxiliary_button_opacity)
    return [variant, {
      primary_color: textColor,
      secondary_color: primaryButtonColor,
      background_color: backgroundColor,
      surface_color: surfaceColor,
      text_color: textColor,
      background_overlay_opacity: backgroundOpacity,
      card_surface_opacity: surfaceOpacity,
      background_opacity: backgroundOpacity,
      surface_opacity: surfaceOpacity,
      overlay_color: nearestPaletteColor(entry.overlay_color, backgroundColor),
      raised_surface_color: nearestPaletteColor(entry.raised_surface_color, surfaceColor),
      raised_surface_opacity: validOpacity(entry.raised_surface_opacity, defaults.raised_surface_opacity),
      header_color: nearestPaletteColor(entry.header_color, surfaceColor),
      header_opacity: validOpacity(entry.header_opacity, defaults.header_opacity),
      text_opacity: validOpacity(entry.text_opacity, defaults.text_opacity),
      muted_text_color: nearestPaletteColor(entry.muted_text_color, textColor),
      muted_text_opacity: validOpacity(entry.muted_text_opacity, defaults.muted_text_opacity),
      subtle_text_color: nearestPaletteColor(entry.subtle_text_color, textColor),
      subtle_text_opacity: validOpacity(entry.subtle_text_opacity, defaults.subtle_text_opacity),
      border_color: nearestPaletteColor(entry.border_color, defaults.border_color),
      border_opacity: validOpacity(entry.border_opacity, defaults.border_opacity),
      icon_color: nearestPaletteColor(entry.icon_color, defaults.icon_color),
      icon_opacity: validOpacity(entry.icon_opacity, defaults.icon_opacity),
      input_background_color: nearestPaletteColor(entry.input_background_color, backgroundColor),
      input_background_opacity: validOpacity(entry.input_background_opacity, defaults.input_background_opacity),
      input_text_color: nearestPaletteColor(entry.input_text_color, textColor),
      input_text_opacity: validOpacity(entry.input_text_opacity, defaults.input_text_opacity),
      input_placeholder_color: nearestPaletteColor(entry.input_placeholder_color, textColor),
      input_placeholder_opacity: validOpacity(entry.input_placeholder_opacity, defaults.input_placeholder_opacity),
      primary_button_color: primaryButtonColor,
      primary_button_opacity: primaryButtonOpacity,
      primary_button_text_color: nearestPaletteColor(entry.primary_button_text_color, contrastTextColor(primaryButtonColor, primaryButtonOpacity, surfaceColor)),
      primary_button_text_opacity: validOpacity(entry.primary_button_text_opacity, defaults.primary_button_text_opacity),
      secondary_button_color: secondaryButtonColor,
      secondary_button_opacity: secondaryButtonOpacity,
      secondary_button_text_color: nearestPaletteColor(entry.secondary_button_text_color, contrastTextColor(secondaryButtonColor, secondaryButtonOpacity, surfaceColor)),
      secondary_button_text_opacity: validOpacity(entry.secondary_button_text_opacity, defaults.secondary_button_text_opacity),
      auxiliary_button_color: auxiliaryButtonColor,
      auxiliary_button_opacity: auxiliaryButtonOpacity,
      auxiliary_button_text_color: nearestPaletteColor(entry.auxiliary_button_text_color, contrastTextColor(auxiliaryButtonColor, auxiliaryButtonOpacity, surfaceColor)),
      auxiliary_button_text_opacity: validOpacity(entry.auxiliary_button_text_opacity, defaults.auxiliary_button_text_opacity),
      focus_color: nearestPaletteColor(entry.focus_color, primaryButtonColor),
      focus_opacity: validOpacity(entry.focus_opacity, defaults.focus_opacity),
      modal_backdrop_color: nearestPaletteColor(entry.modal_backdrop_color, defaults.modal_backdrop_color),
      modal_backdrop_opacity: validOpacity(entry.modal_backdrop_opacity, defaults.modal_backdrop_opacity),
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
    visual_variant_settings: normalizeVariants(merged.visual_variant_settings),
  }
}

export function readCachedBrandSettings(): BrandSettings | null { try { const raw = localStorage.getItem(BRAND_SETTINGS_CACHE_KEY); return raw ? normalizeBrandSettings(JSON.parse(raw) as Partial<BrandSettings>) : null } catch { return null } }
export function cacheBrandSettings(settings: BrandSettings) { try { localStorage.setItem(BRAND_SETTINGS_CACHE_KEY, JSON.stringify(settings)) } catch { /* cache is optional */ } }
export async function getBrandSettings(): Promise<BrandSettings> { const { data, error } = await requireSupabase().from('brand_settings').select('*').limit(1).maybeSingle(); if (error) throw error; return normalizeBrandSettings(data as Partial<BrandSettings> | null) }
export async function updateBrandSettings(values: BrandSettings): Promise<BrandSettings> { const client = requireSupabase(); const normalized = normalizeBrandSettings(values); const { id, ...settings } = normalized; const payload = { ...settings, updated_at: new Date().toISOString() }; const query = id ? client.from('brand_settings').update(payload).eq('id', id) : client.from('brand_settings').insert({ ...payload, singleton: true }); const { data, error } = await query.select('*').single(); if (error) throw error; return normalizeBrandSettings(data as Partial<BrandSettings>) }

function getExtension(file: File) { return file.name.split('.').pop()?.toLowerCase() || (file.type === 'image/jpeg' ? 'jpg' : 'png') }
export async function uploadBrandAsset(file: File, type: BrandAssetType): Promise<string> { const rule = assetRules[type]; const extension = getExtension(file); const typeAllowed = rule.types.includes(file.type) || (type === 'favicon' && ['ico', 'svg', 'png'].includes(extension)); if (type === 'background' && (!rule.types.includes(file.type) || file.size > rule.maxSize)) throw new Error('Envie uma imagem JPG, PNG ou WebP com até 5 MB.'); if (!typeAllowed) throw new Error(`Asset de marca: formato não permitido para ${type}.`); if (file.size > rule.maxSize) throw new Error(`Asset de marca: o arquivo de ${type} excede o limite permitido.`); const client = requireSupabase(); const path = `brand/${type}-${Date.now()}.${extension}`; const { error } = await client.storage.from('business-card-assets').upload(path, file, { cacheControl: '3600', contentType: file.type, upsert: false }); if (error) throw error; return client.storage.from('business-card-assets').getPublicUrl(path).data.publicUrl }
