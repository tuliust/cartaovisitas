import { useContext } from 'react'
import { InstallAppContext } from '../contexts/InstallAppContext'

export function useInstallApp() {
  const context = useContext(InstallAppContext)
  if (!context) throw new Error('useInstallApp deve ser usado dentro de InstallAppProvider.')
  return context
}
