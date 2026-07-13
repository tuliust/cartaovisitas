import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { cacheBrandSettings, defaultBrandSettings, getBrandSettings, readCachedBrandSettings } from '../lib/brandSettings'
import { BrandSettingsContext } from './BrandSettingsContext'

export function BrandSettingsProvider({ children }: { children: ReactNode }) {
  const [cached] = useState(() => readCachedBrandSettings())
  const [settings, setSettingsState] = useState(cached ?? defaultBrandSettings)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(cached ? 'ready' : 'loading')

  useEffect(() => {
    let mounted = true
    void getBrandSettings().then((data) => { if (mounted) { setSettingsState(data); cacheBrandSettings(data); setStatus('ready') } })
      .catch(() => { if (mounted) setStatus(cached ? 'ready' : 'error') })
    return () => { mounted = false }
  }, [cached])

  useEffect(() => {
    if (status === 'loading') return
    const root = document.documentElement
    root.style.setProperty('--brand-primary', settings.primary_color)
    root.style.setProperty('--brand-background', settings.background_color)
    root.style.setProperty('--brand-surface', settings.surface_color)
    root.style.setProperty('--brand-text', settings.text_color)
    root.style.setProperty('--brand-accent', settings.secondary_color)
    root.style.setProperty('--brand-background-image', settings.background_image_url ? `url("${settings.background_image_url.replace(/"/g, '\\"')}")` : 'none')
    document.title = settings.browser_title
    let appTitle = document.querySelector<HTMLMetaElement>('meta[name="apple-mobile-web-app-title"]')
    if (!appTitle) { appTitle = document.createElement('meta'); appTitle.name = 'apple-mobile-web-app-title'; document.head.appendChild(appTitle) }
    appTitle.content = settings.apple_touch_title
    let favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (!favicon) { favicon = document.createElement('link'); favicon.rel = 'icon'; document.head.appendChild(favicon) }
    favicon.href = settings.favicon_url || defaultBrandSettings.favicon_url
    const faviconUrl = favicon.href.toLowerCase()
    favicon.type = faviconUrl.endsWith('.svg') ? 'image/svg+xml' : faviconUrl.endsWith('.png') ? 'image/png' : 'image/x-icon'
    let appleTouch = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]')
    if (!appleTouch) { appleTouch = document.createElement('link'); appleTouch.rel = 'apple-touch-icon'; document.head.appendChild(appleTouch) }
    appleTouch.href = settings.apple_touch_icon_url || '/icons/app-192.png'
    appleTouch.setAttribute('sizes', '180x180')
  }, [settings, status])

  const setSettings = useCallback((value: typeof settings) => { setSettingsState(value); cacheBrandSettings(value); setStatus('ready') }, [])
  const value = useMemo(() => ({ settings, setSettings, status }), [settings, setSettings, status])
  return <BrandSettingsContext.Provider value={value}>{children}</BrandSettingsContext.Provider>
}
