import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import InstallAppModal from '../components/InstallAppModal'
import { useToast } from './ToastContext'
import { InstallAppContext, type InstallInstructions, type InstallPlatform } from './InstallAppContext'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

type NavigatorWithStandalone = Navigator & { standalone?: boolean }

function detectPlatform(): InstallPlatform {
  const userAgent = navigator.userAgent.toLowerCase()
  const appleTouchDevice = navigator.maxTouchPoints > 1 && /macintosh/.test(userAgent)
  if (/iphone|ipad|ipod/.test(userAgent) || appleTouchDevice) return 'ios'
  if (/android/.test(userAgent)) return 'android'
  return 'desktop'
}

function detectInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as NavigatorWithStandalone).standalone)
}

function defaultInstructions(platform: InstallPlatform): InstallInstructions {
  if (platform === 'ios') return 'iphone'
  if (platform === 'android') return 'android'
  return 'desktop'
}

export function InstallAppProvider({ children }: { children: ReactNode }) {
  const toast = useToast()
  const [platform] = useState<InstallPlatform>(() => detectPlatform())
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(() => detectInstalled())
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedInstructions, setSelectedInstructions] = useState<InstallInstructions>(() => defaultInstructions(detectPlatform()))

  useEffect(() => {
    const media = window.matchMedia('(display-mode: standalone)')
    const updateInstalled = () => setIsInstalled(detectInstalled())
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }
    const handleInstalled = () => {
      setInstallPrompt(null)
      setIsInstalled(true)
      setModalOpen(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleInstalled)
    media.addEventListener('change', updateInstalled)
    updateInstalled()

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleInstalled)
      media.removeEventListener('change', updateInstalled)
    }
  }, [toast])

  const openInstallModal = useCallback(() => {
    if (isInstalled) return
    setSelectedInstructions(defaultInstructions(platform))
    setModalOpen(true)
  }, [isInstalled, platform])

  const closeInstallModal = useCallback(() => setModalOpen(false), [])

  const promptInstall = useCallback(async () => {
    if (!installPrompt) return
    const prompt = installPrompt
    setInstallPrompt(null)
    await prompt.prompt()
    const choice = await prompt.userChoice
    if (choice.outcome === 'accepted') {
      setIsInstalled(true)
      setModalOpen(false)
      toast.success('Aplicativo instalado com sucesso.')
    }
  }, [installPrompt, toast])

  const value = useMemo(() => ({
    platform,
    isInstalled,
    isInstallable: Boolean(installPrompt),
    modalOpen,
    selectedInstructions,
    openInstallModal,
    closeInstallModal,
    setSelectedInstructions,
    promptInstall,
  }), [closeInstallModal, installPrompt, isInstalled, modalOpen, openInstallModal, platform, promptInstall, selectedInstructions])

  return (
    <InstallAppContext.Provider value={value}>
      {children}
      {modalOpen ? <InstallAppModal /> : null}
    </InstallAppContext.Provider>
  )
}
