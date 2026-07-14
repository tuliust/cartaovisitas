import { createContext, useContext } from 'react'
import type { PublicVisualVariant } from '../lib/cardVisualVariants'

export type VisualModeOption = { value: PublicVisualVariant; label: string }

export type VisualModeContextValue = {
  visualMode: PublicVisualVariant
  setVisualMode: (mode: PublicVisualVariant) => void
  keepVisualModeAsDefault: boolean
  setKeepVisualModeAsDefault: (keep: boolean) => void
  applyAuthenticatedDefault: (mode: PublicVisualVariant, sessionKey: string) => void
  clearAuthenticatedDefault: () => void
  visualModeOptions: VisualModeOption[]
  hasVisualModePreference: boolean
}

export const VisualModeContext = createContext<VisualModeContextValue | null>(null)

export function useVisualMode() {
  const context = useContext(VisualModeContext)
  if (!context) throw new Error('useVisualMode deve ser usado dentro de VisualModeProvider.')
  return context
}
