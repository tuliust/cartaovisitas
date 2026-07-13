import { createContext } from 'react'

export type InstallPlatform = 'ios' | 'android' | 'desktop'
export type InstallInstructions = 'iphone' | 'android' | 'desktop'

export type InstallAppContextValue = {
  platform: InstallPlatform
  isInstalled: boolean
  isInstallable: boolean
  modalOpen: boolean
  selectedInstructions: InstallInstructions
  openInstallModal: () => void
  closeInstallModal: () => void
  setSelectedInstructions: (value: InstallInstructions) => void
  promptInstall: () => Promise<void>
}

export const InstallAppContext = createContext<InstallAppContextValue | null>(null)
