import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useBrandSettings } from './BrandSettingsContext'
import {
  getEffectiveVisualVariant,
  getVariantImage,
  getVariantSemanticTokens,
  getVariantSettings,
  isLightVisualVariant,
  publicVisualVariantOptions,
  type PublicVisualVariant,
} from '../lib/cardVisualVariants'
import { VisualModeContext } from './VisualModeContext'

export const VISUAL_MODE_STORAGE_KEY = 'invest-rs-public-visual-mode'
const VISUAL_MODE_SESSION_KEY = 'invest-rs-public-visual-mode-session'
const AUTHENTICATED_VISUAL_SESSION_KEY = 'invest-rs-authenticated-visual-session'

const validModes = new Set<PublicVisualVariant>(publicVisualVariantOptions.map(({ value }) => value))

function readStoredMode() {
  const stored = window.localStorage.getItem(VISUAL_MODE_STORAGE_KEY)
  if (stored && validModes.has(stored as PublicVisualVariant)) return stored as PublicVisualVariant
  if (stored) window.localStorage.removeItem(VISUAL_MODE_STORAGE_KEY)
  return null
}

function readSessionMode() {
  const stored = window.sessionStorage.getItem(VISUAL_MODE_SESSION_KEY)
  if (stored && validModes.has(stored as PublicVisualVariant)) return stored as PublicVisualVariant
  if (stored) window.sessionStorage.removeItem(VISUAL_MODE_SESSION_KEY)
  return null
}

export function VisualModeProvider({ children }: { children: ReactNode }) {
  const { settings } = useBrandSettings()
  const [preference, setPreference] = useState(() => {
    const storedMode = readStoredMode()
    const sessionMode = readSessionMode()
    return {
      visualMode: storedMode ?? sessionMode ?? 'dark_black' as PublicVisualVariant,
      hasVisualModePreference: Boolean(storedMode || sessionMode),
      keepVisualModeAsDefault: Boolean(storedMode),
    }
  })
  const { visualMode, hasVisualModePreference, keepVisualModeAsDefault } = preference

  const setVisualMode = useCallback((mode: PublicVisualVariant) => {
    const safeMode = validModes.has(mode) ? mode : 'dark_black'
    window.sessionStorage.setItem(VISUAL_MODE_SESSION_KEY, safeMode)
    if (keepVisualModeAsDefault) window.localStorage.setItem(VISUAL_MODE_STORAGE_KEY, safeMode)
    setPreference((current) => ({ ...current, visualMode: safeMode, hasVisualModePreference: true }))
  }, [keepVisualModeAsDefault])

  const setKeepVisualModeAsDefault = useCallback((keep: boolean) => {
    if (keep) window.localStorage.setItem(VISUAL_MODE_STORAGE_KEY, visualMode)
    else window.localStorage.removeItem(VISUAL_MODE_STORAGE_KEY)
    setPreference((current) => ({ ...current, keepVisualModeAsDefault: keep }))
  }, [visualMode])

  const applyAuthenticatedDefault = useCallback((mode: PublicVisualVariant, sessionKey: string) => {
    if (window.sessionStorage.getItem(AUTHENTICATED_VISUAL_SESSION_KEY) === sessionKey) return

    const storedMode = readStoredMode()
    const safeMode = storedMode ?? (validModes.has(mode) ? mode : 'dark_black')
    window.sessionStorage.setItem(VISUAL_MODE_SESSION_KEY, safeMode)
    window.sessionStorage.setItem(AUTHENTICATED_VISUAL_SESSION_KEY, sessionKey)
    setPreference({ visualMode: safeMode, hasVisualModePreference: true, keepVisualModeAsDefault: Boolean(storedMode) })
  }, [])

  const clearAuthenticatedDefault = useCallback(() => {
    window.sessionStorage.removeItem(AUTHENTICATED_VISUAL_SESSION_KEY)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const effectiveMode = getEffectiveVisualVariant(settings, visualMode)
    const image = getVariantImage(settings, visualMode)
    const tokens = getVariantSettings(settings, visualMode)
    const semanticTokens = getVariantSemanticTokens(settings, visualMode)
    const modeClass = isLightVisualVariant(effectiveMode) ? 'app-visual-mode-light' : 'app-visual-mode-dark'
    const variantClass = `app-visual-variant-${effectiveMode.replace(/_/g, '-')}`

    root.classList.remove('app-visual-mode-light', 'app-visual-mode-dark')
    publicVisualVariantOptions.forEach(({ value }) => root.classList.remove(`app-visual-variant-${value.replace(/_/g, '-')}`))
    root.classList.add(modeClass, variantClass)

    root.style.setProperty('--app-visual-variant-image', image ? `url("${image.replace(/"/g, '\\"')}")` : 'none')
    root.style.setProperty('--variant-primary', tokens.primary_color)
    root.style.setProperty('--variant-accent', tokens.primary_button_color)
    root.style.setProperty('--variant-background', tokens.background_color)
    root.style.setProperty('--variant-surface', tokens.surface_color)
    root.style.setProperty('--variant-text', tokens.text_color)
    root.style.setProperty('--visual-page-text', tokens.text_color)
    root.style.setProperty('--visual-page-muted', `color-mix(in srgb, ${tokens.text_color} 72%, transparent)`)
    root.style.setProperty('--variant-overlay-color', `color-mix(in srgb, ${tokens.background_color} ${tokens.background_opacity * 100}%, transparent)`)
    root.style.setProperty('--variant-card-surface', `color-mix(in srgb, ${tokens.surface_color} ${tokens.surface_opacity * 100}%, transparent)`)
    root.style.setProperty('--visual-card-surface', `color-mix(in srgb, ${tokens.surface_color} ${tokens.surface_opacity * 100}%, transparent)`)

    Object.entries(semanticTokens).forEach(([name, value]) => root.style.setProperty(name, value))

    const aliases: Record<string, string> = {
      '--brand-primary': tokens.primary_color,
      '--brand-background': tokens.background_color,
      '--brand-surface': tokens.surface_color,
      '--brand-text': tokens.text_color,
      '--brand-accent': tokens.primary_button_color,
      '--visual-card-border': semanticTokens['--semantic-border'],
      '--visual-action-color': semanticTokens['--semantic-text'],
      '--visual-action-muted': semanticTokens['--semantic-muted'],
      '--visual-action-border': semanticTokens['--semantic-border'],
      '--visual-action-tile': semanticTokens['--semantic-secondary-bg'],
      '--visual-action-tile-hover': `color-mix(in srgb, ${tokens.secondary_button_color} ${Math.min(100, (tokens.secondary_button_opacity * 100) + 10)}%, transparent)`,
      '--visual-action-primary-bg': semanticTokens['--semantic-primary-bg'],
      '--visual-action-primary-text': semanticTokens['--semantic-primary-text'],
      '--admin-header-bg': semanticTokens['--semantic-header-bg'],
      '--admin-nav-text': semanticTokens['--semantic-muted'],
      '--admin-nav-text-hover': semanticTokens['--semantic-text'],
      '--admin-nav-text-active': tokens.primary_button_color,
      '--admin-nav-bg': 'transparent',
      '--admin-nav-bg-hover': semanticTokens['--semantic-secondary-bg'],
      '--admin-nav-border': semanticTokens['--semantic-border'],
      '--admin-nav-logout': semanticTokens['--semantic-danger'],
      '--admin-nav-logout-hover': semanticTokens['--semantic-danger'],
      '--admin-primary-button-bg': semanticTokens['--semantic-primary-bg'],
      '--admin-primary-button-text': semanticTokens['--semantic-primary-text'],
      '--admin-secondary-button-text': semanticTokens['--semantic-secondary-text'],
      '--admin-danger-button-text': semanticTokens['--semantic-danger'],
      '--admin-text': semanticTokens['--semantic-text'],
      '--admin-muted': semanticTokens['--semantic-muted'],
      '--admin-subtle': semanticTokens['--semantic-subtle'],
      '--admin-table-heading': semanticTokens['--semantic-muted'],
      '--admin-border': semanticTokens['--semantic-border'],
      '--modal-backdrop': semanticTokens['--semantic-modal-backdrop'],
      '--modal-surface': semanticTokens['--semantic-surface-raised'],
      '--modal-surface-strong': semanticTokens['--semantic-surface-solid'],
      '--modal-text': semanticTokens['--semantic-text'],
      '--modal-muted': semanticTokens['--semantic-muted'],
      '--modal-border': semanticTokens['--semantic-border'],
      '--modal-input-bg': semanticTokens['--semantic-input-bg'],
      '--modal-input-text': semanticTokens['--semantic-input-text'],
      '--modal-input-placeholder': semanticTokens['--semantic-input-placeholder'],
      '--modal-secondary-bg': semanticTokens['--semantic-secondary-bg'],
      '--modal-secondary-text': semanticTokens['--semantic-secondary-text'],
      '--modal-primary-bg': semanticTokens['--semantic-primary-bg'],
      '--modal-primary-text': semanticTokens['--semantic-primary-text'],
    }

    Object.entries(aliases).forEach(([name, value]) => root.style.setProperty(name, value))
  }, [settings, visualMode])

  const value = useMemo(() => ({
    visualMode,
    setVisualMode,
    keepVisualModeAsDefault,
    setKeepVisualModeAsDefault,
    applyAuthenticatedDefault,
    clearAuthenticatedDefault,
    visualModeOptions: publicVisualVariantOptions,
    hasVisualModePreference,
  }), [applyAuthenticatedDefault, clearAuthenticatedDefault, keepVisualModeAsDefault, setKeepVisualModeAsDefault, visualMode, setVisualMode, hasVisualModePreference])
  return <VisualModeContext.Provider value={value}>{children}</VisualModeContext.Provider>
}
