import type { CSSProperties } from 'react'
import type { BrandSettings } from './brandSettings'

export type PublicVisualVariant = 'dark_black' | 'dark_image_1' | 'dark_image_2' | 'light_white' | 'light_image_3' | 'light_image_4'

export const publicVisualVariantOptions: Array<{ value: PublicVisualVariant; label: string }> = [
  { value: 'dark_black', label: 'Preto institucional' },
  { value: 'dark_image_1', label: 'Imagem escura 1' },
  { value: 'dark_image_2', label: 'Imagem escura 2' },
  { value: 'light_white', label: 'Branco institucional' },
  { value: 'light_image_3', label: 'Imagem clara 1' },
  { value: 'light_image_4', label: 'Imagem clara 2' },
]

const imageKeys: Partial<Record<PublicVisualVariant, keyof BrandSettings>> = {
  dark_image_1: 'card_bg_dark_image_1_url', dark_image_2: 'card_bg_dark_image_2_url',
  light_image_3: 'card_bg_light_image_3_url', light_image_4: 'card_bg_light_image_4_url',
}

export function isLightVisualVariant(variant: PublicVisualVariant) { return variant.startsWith('light_') }
export function getVariantImage(settings: BrandSettings, variant: PublicVisualVariant) { const key = imageKeys[variant]; return key ? String(settings[key] || '') : '' }
export function getEffectiveVisualVariant(settings: BrandSettings, variant: PublicVisualVariant): PublicVisualVariant { if (getVariantImage(settings, variant)) return variant; return isLightVisualVariant(variant) ? 'light_white' : 'dark_black' }
export function getVariantLogo(settings: BrandSettings, variant: PublicVisualVariant, cardLogo?: string | null) { return isLightVisualVariant(variant) ? settings.logo_on_light_url || cardLogo || settings.logo_url || '/invest-rs-logo.png' : settings.logo_on_dark_url || cardLogo || settings.logo_url || '/invest-rs-logo.png' }
export function getVariantClassName(settings: BrandSettings, variant: PublicVisualVariant) { const effective = getEffectiveVisualVariant(settings, variant); return `public-card-theme-${isLightVisualVariant(effective) ? 'light' : 'dark'} public-card-variant-${effective.replace(/_/g, '-')}` }
export function getVariantSettings(settings: BrandSettings, variant: PublicVisualVariant) { return settings.visual_variant_settings[variant] }
function hexToRgbChannels(hex: string) { return `${Number.parseInt(hex.slice(1, 3), 16)} ${Number.parseInt(hex.slice(3, 5), 16)} ${Number.parseInt(hex.slice(5, 7), 16)}` }
export function getVariantStyle(settings: BrandSettings, variant: PublicVisualVariant) { const image = getVariantImage(settings, variant); const tokens = getVariantSettings(settings, variant); return {
  '--public-card-variant-image': image ? `url("${image.replace(/"/g, '\\"')}")` : 'none',
  '--variant-primary': tokens.primary_color, '--variant-accent': tokens.secondary_color,
  '--variant-background': tokens.background_color, '--variant-surface': tokens.surface_color,
  '--variant-surface-rgb': hexToRgbChannels(tokens.surface_color), '--variant-text': tokens.text_color,
  '--variant-overlay-rgb': isLightVisualVariant(variant) ? '255 255 255' : '0 0 0',
  '--variant-overlay-opacity': String(tokens.background_overlay_opacity), '--variant-card-opacity': String(tokens.card_surface_opacity),
} as CSSProperties }
