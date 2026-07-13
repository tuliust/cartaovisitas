import { createContext, useContext } from 'react'
import type { BrandSettings } from '../lib/brandSettings'

export type BrandSettingsContextValue = {
  settings: BrandSettings
  setSettings: (settings: BrandSettings) => void
  status: 'loading' | 'ready' | 'error'
}

export const BrandSettingsContext = createContext<BrandSettingsContextValue | null>(null)

export function useBrandSettings() {
  const context = useContext(BrandSettingsContext)
  if (!context) throw new Error('useBrandSettings deve ser usado dentro de BrandSettingsProvider.')
  return context
}
