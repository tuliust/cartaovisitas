import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useBrandSettings } from './BrandSettingsContext'
import { getEffectiveVisualVariant, getVariantImage, isLightVisualVariant, publicVisualVariantOptions, type PublicVisualVariant } from '../lib/cardVisualVariants'
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
    const modeClass = isLightVisualVariant(effectiveMode) ? 'app-visual-mode-light' : 'app-visual-mode-dark'
    const variantClass = `app-visual-variant-${effectiveMode.replace(/_/g, '-')}`
    root.classList.remove('app-visual-mode-light', 'app-visual-mode-dark')
    publicVisualVariantOptions.forEach(({ value }) => root.classList.remove(`app-visual-variant-${value.replace(/_/g, '-')}`))
    root.classList.add(modeClass, variantClass)
    root.style.setProperty('--app-visual-variant-image', image ? `url("${image.replace(/"/g, '\\"')}")` : 'none')
  }, [settings, visualMode])

  const value = useMemo(() => ({ visualMode, setVisualMode, visualModeOptions: publicVisualVariantOptions, hasVisualModePreference }), [visualMode, setVisualMode, hasVisualModePreference])
  return <VisualModeContext.Provider value={value}>{children}</VisualModeContext.Provider>
}
