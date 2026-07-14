import type { CSSProperties } from 'react'
import type { BrandSettings } from './brandSettings'

export type PublicVisualVariant = 'dark_black' | 'dark_image_1' | 'dark_image_2' | 'light_white' | 'light_image_3' | 'light_image_4'

export const publicVisualVariantOptions: Array<{ value: PublicVisualVariant; label: string }> = [
  { value: 'dark_black', label: 'Modo Escuro 1' },
  { value: 'dark_image_1', label: 'Modo Escuro 2' },
  { value: 'dark_image_2', label: 'Modo Escuro 3' },
  { value: 'light_white', label: 'Modo Claro 1' },
  { value: 'light_image_3', label: 'Modo Claro 2' },
  { value: 'light_image_4', label: 'Modo Claro 3' },
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
function hexChannels(hex: string) { return [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16)) }
function autoContrast(background: string, opacity: number, surface: string) {
  const bg = hexChannels(background)
  const underlay = hexChannels(surface)
  const composed = bg.map((channel, index) => Math.round((channel * opacity) + (underlay[index] * (1 - opacity))))
  const luminance = composed.map((channel) => { const value = channel / 255; return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4 })
    .reduce((sum, channel, index) => sum + (channel * [0.2126, 0.7152, 0.0722][index]), 0)
  return luminance > 0.42 ? '#000000' : '#ffffff'
}
export function getVariantSemanticTokens(settings: BrandSettings, variant: PublicVisualVariant) {
  const tokens = getVariantSettings(settings, variant)
  const text = tokens.text_color
  const surface = tokens.surface_color
  const background = tokens.background_color
  const primaryText = autoContrast(tokens.primary_button_color, tokens.primary_button_opacity, surface)
  const secondaryText = autoContrast(tokens.secondary_button_color, tokens.secondary_button_opacity, surface)
  const auxiliaryText = autoContrast(tokens.auxiliary_button_color, tokens.auxiliary_button_opacity, surface)
  return {
    '--semantic-text': text,
    '--semantic-muted': `color-mix(in srgb, ${text} 72%, transparent)`,
    '--semantic-subtle': `color-mix(in srgb, ${text} 56%, transparent)`,
    '--semantic-surface': `color-mix(in srgb, ${surface} ${tokens.surface_opacity * 100}%, transparent)`,
    '--semantic-surface-solid': surface,
    '--semantic-surface-raised': `color-mix(in srgb, ${surface} 94%, ${background})`,
    '--semantic-border': `color-mix(in srgb, ${tokens.border_color} ${tokens.border_opacity * 100}%, transparent)`,
    '--semantic-icon': `color-mix(in srgb, ${tokens.icon_color} ${tokens.icon_opacity * 100}%, transparent)`,
    '--semantic-input-bg': `color-mix(in srgb, ${background} 76%, ${surface})`,
    '--semantic-input-text': text,
    '--semantic-input-placeholder': `color-mix(in srgb, ${text} 48%, transparent)`,
    '--semantic-header-bg': `color-mix(in srgb, ${surface} 88%, transparent)`,
    '--semantic-primary-base': tokens.primary_button_color,
    '--semantic-primary-bg': `color-mix(in srgb, ${tokens.primary_button_color} ${tokens.primary_button_opacity * 100}%, transparent)`,
    '--semantic-primary-text': primaryText,
    '--semantic-secondary-bg': `color-mix(in srgb, ${tokens.secondary_button_color} ${tokens.secondary_button_opacity * 100}%, transparent)`,
    '--semantic-secondary-text': secondaryText,
    '--semantic-auxiliary-bg': `color-mix(in srgb, ${tokens.auxiliary_button_color} ${tokens.auxiliary_button_opacity * 100}%, transparent)`,
    '--semantic-auxiliary-text': auxiliaryText,
    '--semantic-focus': tokens.primary_button_color,
    '--semantic-modal-backdrop': `color-mix(in srgb, ${background} 72%, transparent)`,
    '--semantic-danger': '#ee286e',
    '--semantic-success': '#00ac7c',
    '--semantic-warning': '#fdb642',
  }
}
function hexToRgbChannels(hex: string) { return `${Number.parseInt(hex.slice(1, 3), 16)} ${Number.parseInt(hex.slice(3, 5), 16)} ${Number.parseInt(hex.slice(5, 7), 16)}` }
export function getVariantStyle(settings: BrandSettings, variant: PublicVisualVariant) { const image = getVariantImage(settings, variant); const tokens = getVariantSettings(settings, variant); return {
  ...getVariantSemanticTokens(settings, variant),
  '--public-card-variant-image': image ? `url("${image.replace(/"/g, '\\"')}")` : 'none',
  '--variant-primary': tokens.primary_color, '--variant-accent': tokens.primary_button_color,
  '--variant-background': tokens.background_color, '--variant-surface': tokens.surface_color,
  '--variant-surface-rgb': hexToRgbChannels(tokens.surface_color), '--variant-text': tokens.text_color,
  '--variant-overlay-rgb': hexToRgbChannels(tokens.background_color),
  '--variant-overlay-opacity': String(tokens.background_opacity), '--variant-card-opacity': String(tokens.surface_opacity),
} as CSSProperties }
