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
    root.style.setProperty('--brand-background-image', settings.background_image_url ? `url("${settings.background_image_url.replace(/"/g, '\\"')}")` : 'none')
    let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!favicon) { favicon = document.createElement('link'); favicon.rel = 'icon'; document.head.appendChild(favicon) }
    favicon.href = settings.favicon_url || defaultBrandSettings.favicon_url
    const faviconUrl = favicon.href.toLowerCase()
    favicon.type = faviconUrl.endsWith('.svg') ? 'image/svg+xml' : faviconUrl.endsWith('.png') ? 'image/png' : 'image/x-icon'
    let appleTouch = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]')
    if (settings.apple_touch_icon_url) {
      if (!appleTouch) { appleTouch = document.createElement('link'); appleTouch.rel = 'apple-touch-icon'; document.head.appendChild(appleTouch) }
      appleTouch.href = settings.apple_touch_icon_url
      appleTouch.setAttribute('sizes', '180x180')
    } else {
      appleTouch?.remove()
    }
  }, [settings])

  const value = useMemo(() => ({ settings, setSettings }), [settings])
  return <BrandSettingsContext.Provider value={value}>{children}</BrandSettingsContext.Provider>
}
