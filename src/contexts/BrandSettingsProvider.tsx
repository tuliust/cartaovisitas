import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { defaultBrandSettings, getBrandSettings } from '../lib/brandSettings'
import { BrandSettingsContext } from './BrandSettingsContext'

export function BrandSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(defaultBrandSettings)

  useEffect(() => {
    let mounted = true
    void getBrandSettings().then((data) => { if (mounted) setSettings(data) }).catch(() => undefined)
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--brand-primary', settings.primary_color)
    root.style.setProperty('--brand-background', settings.background_color)
    root.style.setProperty('--brand-surface', settings.surface_color)
    root.style.setProperty('--brand-text', settings.text_color)
    root.style.setProperty('--brand-accent', settings.secondary_color)
    const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (favicon) {
      favicon.href = settings.favicon_url || defaultBrandSettings.favicon_url
      const faviconUrl = favicon.href.toLowerCase()
      favicon.type = faviconUrl.endsWith('.svg') ? 'image/svg+xml' : faviconUrl.endsWith('.png') ? 'image/png' : 'image/x-icon'
    }
  }, [settings])

  const value = useMemo(() => ({ settings, setSettings }), [settings])
  return <BrandSettingsContext.Provider value={value}>{children}</BrandSettingsContext.Provider>
}
