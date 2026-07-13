import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useBrandSettings } from './BrandSettingsContext'
import { getEffectiveVisualVariant, getVariantImage, getVariantSemanticTokens, getVariantSettings, isLightVisualVariant, publicVisualVariantOptions, type PublicVisualVariant } from '../lib/cardVisualVariants'
import { VisualModeContext } from './VisualModeContext'

export const VISUAL_MODE_STORAGE_KEY = 'invest-rs-public-visual-mode'

const validModes = new Set<PublicVisualVariant>(publicVisualVariantOptions.map(({ value }) => value))

function readStoredMode() {
  const stored = window.localStorage.getItem(VISUAL_MODE_STORAGE_KEY)
  if (stored && validModes.has(stored as PublicVisualVariant)) return stored as PublicVisualVariant
  if (stored) window.localStorage.removeItem(VISUAL_MODE_STORAGE_KEY)
  return null
}

export function VisualModeProvider({ children }: { children: ReactNode }) {
  const { settings } = useBrandSettings()
  const [preference, setPreference] = useState(() => {
    const storedMode = readStoredMode()
    return { visualMode: storedMode ?? 'dark_black' as PublicVisualVariant, hasVisualModePreference: Boolean(storedMode) }
  })
  const { visualMode, hasVisualModePreference } = preference

  const setVisualMode = useCallback((mode: PublicVisualVariant) => {
    const safeMode = validModes.has(mode) ? mode : 'dark_black'
    window.localStorage.setItem(VISUAL_MODE_STORAGE_KEY, safeMode)
    setPreference({ visualMode: safeMode, hasVisualModePreference: true })
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const effectiveMode = getEffectiveVisualVariant(settings, visualMode)
    const image = getVariantImage(settings, visualMode)
    const tokens = getVariantSettings(settings, visualMode)
    const modeClass = isLightVisualVariant(effectiveMode) ? 'app-visual-mode-light' : 'app-visual-mode-dark'
    const variantClass = `app-visual-variant-${effectiveMode.replace(/_/g, '-')}`
    root.classList.remove('app-visual-mode-light', 'app-visual-mode-dark')
    publicVisualVariantOptions.forEach(({ value }) => root.classList.remove(`app-visual-variant-${value.replace(/_/g, '-')}`))
    root.classList.add(modeClass, variantClass)
    root.style.setProperty('--app-visual-variant-image', image ? `url("${image.replace(/"/g, '\\"')}")` : 'none')
    root.style.setProperty('--variant-primary', tokens.primary_color)
    root.style.setProperty('--variant-accent', tokens.secondary_color)
    root.style.setProperty('--variant-background', tokens.background_color)
    root.style.setProperty('--variant-surface', tokens.surface_color)
    root.style.setProperty('--variant-text', tokens.text_color)
    root.style.setProperty('--visual-page-text', tokens.text_color)
    root.style.setProperty('--visual-page-muted', `color-mix(in srgb, ${tokens.text_color} 72%, transparent)`)
    root.style.setProperty('--variant-overlay-color', isLightVisualVariant(visualMode) ? `rgba(255, 255, 255, ${tokens.background_overlay_opacity})` : `rgba(0, 0, 0, ${tokens.background_overlay_opacity})`)
    root.style.setProperty('--variant-card-surface', `color-mix(in srgb, ${tokens.surface_color} ${tokens.card_surface_opacity * 100}%, transparent)`)
    root.style.setProperty('--visual-card-surface', `color-mix(in srgb, ${tokens.surface_color} ${tokens.card_surface_opacity * 100}%, transparent)`)
    Object.entries(getVariantSemanticTokens(settings, visualMode)).forEach(([name, value]) => root.style.setProperty(name, value))
  }, [settings, visualMode])

  const value = useMemo(() => ({ visualMode, setVisualMode, visualModeOptions: publicVisualVariantOptions, hasVisualModePreference }), [visualMode, setVisualMode, hasVisualModePreference])
  return <VisualModeContext.Provider value={value}>{children}</VisualModeContext.Provider>
}
