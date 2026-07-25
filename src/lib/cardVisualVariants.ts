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
function withOpacity(color: string, opacity: number) { return `color-mix(in srgb, ${color} ${opacity * 100}%, transparent)` }

export function getVariantSemanticTokens(settings: BrandSettings, variant: PublicVisualVariant) {
  const tokens = getVariantSettings(settings, variant)
  return {
    '--semantic-text': withOpacity(tokens.text_color, tokens.text_opacity),
    '--semantic-muted': withOpacity(tokens.muted_text_color, tokens.muted_text_opacity),
    '--semantic-subtle': withOpacity(tokens.subtle_text_color, tokens.subtle_text_opacity),
    '--semantic-surface': withOpacity(tokens.surface_color, tokens.surface_opacity),
    '--semantic-surface-solid': tokens.surface_color,
    '--semantic-surface-raised': withOpacity(tokens.raised_surface_color, tokens.raised_surface_opacity),
    '--semantic-border': withOpacity(tokens.border_color, tokens.border_opacity),
    '--semantic-icon': withOpacity(tokens.icon_color, tokens.icon_opacity),
    '--semantic-input-bg': withOpacity(tokens.input_background_color, tokens.input_background_opacity),
    '--semantic-input-text': withOpacity(tokens.input_text_color, tokens.input_text_opacity),
    '--semantic-input-placeholder': withOpacity(tokens.input_placeholder_color, tokens.input_placeholder_opacity),
    '--semantic-header-bg': withOpacity(tokens.header_color, tokens.header_opacity),
    '--semantic-primary-base': tokens.primary_button_color,
    '--semantic-primary-bg': withOpacity(tokens.primary_button_color, tokens.primary_button_opacity),
    '--semantic-primary-text': withOpacity(tokens.primary_button_text_color, tokens.primary_button_text_opacity),
    '--semantic-secondary-bg': withOpacity(tokens.secondary_button_color, tokens.secondary_button_opacity),
    '--semantic-secondary-text': withOpacity(tokens.secondary_button_text_color, tokens.secondary_button_text_opacity),
    '--semantic-auxiliary-bg': withOpacity(tokens.auxiliary_button_color, tokens.auxiliary_button_opacity),
    '--semantic-auxiliary-text': withOpacity(tokens.auxiliary_button_text_color, tokens.auxiliary_button_text_opacity),
    '--semantic-focus': withOpacity(tokens.focus_color, tokens.focus_opacity),
    '--semantic-modal-backdrop': withOpacity(tokens.modal_backdrop_color, tokens.modal_backdrop_opacity),
    '--semantic-danger': '#ee286e',
    '--semantic-success': '#00ac7c',
    '--semantic-warning': '#fdb642',
  }
}
function hexToRgbChannels(hex: string) { return `${Number.parseInt(hex.slice(1, 3), 16)} ${Number.parseInt(hex.slice(3, 5), 16)} ${Number.parseInt(hex.slice(5, 7), 16)}` }
export function getVariantStyle(settings: BrandSettings, variant: PublicVisualVariant) { const image = getVariantImage(settings, variant); const tokens = getVariantSettings(settings, variant); const semanticTokens = getVariantSemanticTokens(settings, variant); return {
  ...semanticTokens,
  '--public-card-variant-image': image ? `url("${image.replace(/"/g, '\\"')}")` : 'none',
  '--variant-primary': semanticTokens['--semantic-text'], '--variant-accent': tokens.primary_button_color,
  '--variant-background': tokens.background_color, '--variant-surface': tokens.surface_color,
  '--variant-surface-rgb': hexToRgbChannels(tokens.surface_color), '--variant-text': semanticTokens['--semantic-text'],
  '--variant-overlay-rgb': hexToRgbChannels(tokens.overlay_color),
  '--variant-overlay-opacity': String(tokens.background_opacity), '--variant-card-opacity': String(tokens.surface_opacity),
} as CSSProperties }
