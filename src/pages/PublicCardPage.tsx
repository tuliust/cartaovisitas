import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import QRCode from 'qrcode'
import { BarChart3, BookOpen, Copy, Download, FileText, FileUp, Globe, Mail, MapPin, MessageCircle, Palette, Pencil, QrCode, Smartphone, Wallet, type LucideIcon } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import CollaboratorLayout from '../components/collaborator/CollaboratorLayout'
import VisualModeSelector from '../components/VisualModeSelector'
import { useBrandSettings } from '../contexts/BrandSettingsContext'
import { useCollaborator } from '../contexts/CollaboratorContext'
import { useToast } from '../contexts/ToastContext'
import { useVisualMode } from '../contexts/VisualModeContext'
import { useInstallApp } from '../hooks/useInstallApp'
import { getEffectiveVisualVariant, getVariantClassName, getVariantLogo, getVariantStyle, isLightVisualVariant } from '../lib/cardVisualVariants'
import { recordCardEvent } from '../lib/cards'
import { getLocalizedProfessionalData, getStoredPublicCardLanguage, publicCardCopy, publicCardLanguageLabels, storePublicCardLanguage, type PublicCardLanguage } from '../lib/publicCardLocale'

type PublicVisualLanguage = PublicCardLanguage

const PUBLIC_CARD_DESKTOP_WIDTH = 1108
const PUBLIC_CARD_DESKTOP_HEIGHT = 648
const PUBLIC_CARD_DESKTOP_BOTTOM_GAP = 18

function normalizePhoneForWhatsApp(phone: string) { return phone.replace(/\D/g, '') }
function buildAddress(card: NonNullable<ReturnType<typeof useCollaborator>['card']>) { return [card.address_line, card.city, card.state, card.country].filter(Boolean).join(', ') }
const INVEST_RS_MAPS_URL = 'https://maps.app.goo.gl/Je4hp2P23VrX6Ctq8'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

async function urlToDataUrl(url: string) {
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) return url
  const response = await fetch(url, { mode: 'cors', credentials: 'omit' })
  if (!response.ok) throw new Error(`Falha ao carregar recurso: ${url}`)
  const blob = await response.blob()
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

async function inlineBackgroundImages(value: string) {
  const matches = Array.from(value.matchAll(/url\(["']?([^"')]+)["']?\)/g))
  let result = value
  for (const match of matches) {
    const source = match[1]
    if (!source || source.startsWith('data:') || source.startsWith('blob:')) continue
    try { result = result.replace(source, await urlToDataUrl(source)) } catch (error) { console.warn('Não foi possível incorporar imagem de fundo ao PNG.', source, error) }
  }
  return result
}

async function waitForImages(source: HTMLElement) {
  const images = Array.from(source.querySelectorAll('img'))
  await Promise.all(images.map((image) => {
    if (image.complete && image.naturalWidth > 0) return Promise.resolve()
    return new Promise<void>((resolve) => {
      const finish = () => resolve()
      image.addEventListener('load', finish, { once: true })
      image.addEventListener('error', finish, { once: true })
      window.setTimeout(finish, 3000)
    })
  }))
}

async function cloneCardWithInlineStyles(source: HTMLElement) {
  const clone = source.cloneNode(true) as HTMLElement
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
  const sourceNodes = [source, ...Array.from(source.querySelectorAll<HTMLElement>('*'))]
  const cloneNodes = [clone, ...Array.from(clone.querySelectorAll<HTMLElement>('*'))]

  await Promise.all(sourceNodes.map(async (sourceNode, index) => {
    const cloneNode = cloneNodes[index]
    if (!cloneNode) return
    const computed = window.getComputedStyle(sourceNode)
    const declarations: string[] = []
    for (let propertyIndex = 0; propertyIndex < computed.length; propertyIndex += 1) {
      const property = computed.item(propertyIndex)
      let value = computed.getPropertyValue(property)
      if (property === 'background-image' && value.includes('url(')) value = await inlineBackgroundImages(value)
      declarations.push(`${property}:${value};`)
    }
    cloneNode.style.cssText = declarations.join('')

    if (sourceNode instanceof HTMLImageElement && cloneNode instanceof HTMLImageElement) {
      try { cloneNode.src = await urlToDataUrl(sourceNode.currentSrc || sourceNode.src) } catch (error) {
        console.warn('Não foi possível incorporar imagem ao PNG.', sourceNode.currentSrc || sourceNode.src, error)
        cloneNode.src = sourceNode.currentSrc || sourceNode.src
      }
    }
  }))

  clone.style.transform = 'none'
  clone.style.margin = '0'
  clone.style.width = `${source.offsetWidth}px`
  clone.style.height = `${source.offsetHeight}px`
  clone.style.maxWidth = 'none'
  clone.style.maxHeight = 'none'
  return clone
}

async function renderElementToPngBlob(source: HTMLElement) {
  await document.fonts.ready
  await waitForImages(source)
  const width = source.offsetWidth
  const height = source.offsetHeight
  if (width <= 0 || height <= 0) throw new Error(`Dimensões inválidas do cartão: ${width}x${height}.`)

  const clone = await cloneCardWithInlineStyles(source)
  const serialized = new XMLSerializer().serializeToString(clone)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><foreignObject width="100%" height="100%">${serialized}</foreignObject></svg>`
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const svgUrl = URL.createObjectURL(svgBlob)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image()
      nextImage.onload = () => resolve(nextImage)
      nextImage.onerror = () => reject(new Error('Falha ao renderizar o SVG intermediário do cartão.'))
      nextImage.src = svgUrl
    })
    const scale = 2
    const canvas = document.createElement('canvas')
    canvas.width = width * scale
    canvas.height = height * scale
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas indisponível.')
    context.scale(scale, scale)
    context.drawImage(image, 0, 0, width, height)
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Falha ao gerar PNG.')), 'image/png', 1))
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}

type LanguageToggleProps = {
  language: PublicCardLanguage
  className?: string
  onChange: (language: PublicCardLanguage) => void
}

function LanguageToggle({ language, className = '', onChange }: LanguageToggleProps) {
  return <div className={`public-language-toggle${className ? ` ${className}` : ''}`} role="group" aria-label="Idioma do cartão">
    {(Object.keys(publicCardLanguageLabels) as PublicCardLanguage[]).map((item) => <button key={item} type="button" className={language === item ? 'active' : ''} aria-pressed={language === item} onClick={() => onChange(item)}>{publicCardLanguageLabels[item]}</button>)}
  </div>
}

function ContactLabel({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return <span className="contact-label"><Icon aria-hidden="true" /><span className="contact-label-text">{children}</span></span>
}

export default function PublicCardPage() {
  const { slug } = useParams()
  const { card, actions } = useCollaborator()
  const { settings } = useBrandSettings()
  const { visualMode, hasVisualModePreference } = useVisualMode()
  const toast = useToast()
  const { isInstalled, openInstallModal } = useInstallApp()
  const actionPanelRef = useRef<HTMLDivElement>(null)
  const desktopStageRef = useRef<HTMLDivElement>(null)
  const cardVisualRef = useRef<HTMLDivElement>(null)
  const shareControlRef = useRef<HTMLDivElement>(null)
  const [desktopScale, setDesktopScale] = useState(1)
  const [language, setLanguage] = useState<PublicVisualLanguage>(getStoredPublicCardLanguage)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [failedLogoUrl, setFailedLogoUrl] = useState('')
  const [shareMenuOpen, setShareMenuOpen] = useState(false)
  const [shareAction, setShareAction] = useState<string | null>(null)

  const qrValue = actions.qrValue
  useEffect(() => { if (card && slug === card.slug) void recordCardEvent(card.id, 'view') }, [card, slug])
  useEffect(() => { if (!qrValue || !card || slug !== card.slug) return; QRCode.toDataURL(qrValue, { width: 360, margin: 1, errorCorrectionLevel: 'M' }).then(setQrDataUrl).catch(() => setQrDataUrl('')) }, [card, qrValue, slug])
  useEffect(() => {
    if (!shareMenuOpen) return
    function closeOnOutsideClick(event: MouseEvent) { if (!shareControlRef.current?.contains(event.target as Node)) setShareMenuOpen(false) }
    function closeOnEscape(event: KeyboardEvent) { if (event.key === 'Escape') setShareMenuOpen(false) }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => { document.removeEventListener('mousedown', closeOnOutsideClick); document.removeEventListener('keydown', closeOnEscape) }
  }, [shareMenuOpen])
  useEffect(() => {
    const stage = desktopStageRef.current
    if (!stage) return
    const updateScale = () => {
      if (window.innerWidth < 901) { setDesktopScale(1); return }
      const rect = stage.getBoundingClientRect()
      const availableWidth = stage.clientWidth
      const availableHeight = Math.max(1, window.innerHeight - rect.top - PUBLIC_CARD_DESKTOP_BOTTOM_GAP)
      const nextScale = Math.min(availableWidth / PUBLIC_CARD_DESKTOP_WIDTH, availableHeight / PUBLIC_CARD_DESKTOP_HEIGHT)
      setDesktopScale(Math.max(0.1, nextScale))
    }
    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(stage)
    window.addEventListener('resize', updateScale)
    return () => { observer.disconnect(); window.removeEventListener('resize', updateScale) }
  }, [])
  const professionalData = useMemo(() => card ? getLocalizedProfessionalData(card, language) : null, [card, language])

  if (!card) return <Navigate to="/meu-cartao/editar" replace />
  if (!slug || slug !== card.slug) return <Navigate to="/meu-cartao" replace />
  const cardId = card.id
  const cardSlug = card.slug

  const name = card.display_name || card.full_name
  const phone = card.mobile_phone || card.work_phone
  const address = buildAddress(card)
  const variant = hasVisualModePreference ? visualMode : card.public_visual_variant ?? 'dark_black'
  const actionTheme = isLightVisualVariant(getEffectiveVisualVariant(settings, variant)) ? 'action-panel-theme-light' : 'action-panel-theme-dark'
  const logoUrl = getVariantLogo(settings, variant, card.logo_url)
  const copy = publicCardCopy[language]
  const shareMessage = `Olá! Este é o link para abrir meu cartão de visitas e salvar o contato no seu celular: ${actions.vcardUrl}`
  const desktopStageStyle = { '--public-card-desktop-scale': desktopScale, height: `${PUBLIC_CARD_DESKTOP_HEIGHT * desktopScale}px` } as CSSProperties
  function changeLanguage(next: PublicCardLanguage) { setLanguage(next); storePublicCardLanguage(next) }

  async function getCardPng() {
    if (!cardVisualRef.current) throw new Error('Cartão indisponível.')
    return await renderElementToPngBlob(cardVisualRef.current)
  }

  async function saveCardPng() {
    setShareAction('card')
    try {
      const blob = await getCardPng()
      downloadBlob(blob, `cartao-${cardSlug}.png`)
      toast.success('Imagem do cartão salva em PNG.')
      void recordCardEvent(cardId, 'share')
      setShareMenuOpen(false)
    } catch (error) {
      console.error('Falha ao gerar a imagem PNG do cartão.', error)
      toast.error('Não foi possível gerar a imagem do cartão.')
    } finally { setShareAction(null) }
  }

  function shareOnWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank', 'noopener,noreferrer')
    void recordCardEvent(cardId, 'share')
    setShareMenuOpen(false)
  }

  function shareByGmail() {
    const subject = `${name} | Cartão de visitas Invest RS`
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareMessage)}`
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    if (isMobile) {
      window.location.href = `googlegmail:///co?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareMessage)}`
      window.setTimeout(() => { if (document.visibilityState === 'visible') window.open(gmailWebUrl, '_blank', 'noopener,noreferrer') }, 900)
    } else {
      window.open(gmailWebUrl, '_blank', 'noopener,noreferrer')
    }
    void recordCardEvent(cardId, 'share')
    setShareMenuOpen(false)
  }

  async function shareViaAirDrop() {
    setShareAction('airdrop')
    try {
      if (typeof navigator.share !== 'function') {
        toast.info('O AirDrop depende do menu de compartilhamento de um dispositivo Apple compatível.')
        return
      }
      await navigator.share({ title: `${name} | Invest RS`, text: shareMessage, url: actions.vcardUrl })
      void recordCardEvent(cardId, 'share')
      setShareMenuOpen(false)
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        console.error('Falha ao abrir o compartilhamento nativo para AirDrop.', error)
        toast.error('Não foi possível abrir o compartilhamento do dispositivo.')
      }
    } finally { setShareAction(null) }
  }

  return <CollaboratorLayout>
    <div className="public-card-desktop-stage" ref={desktopStageRef} style={desktopStageStyle}>
      <section className="digital-card collaborator-own-card public-card-desktop-canvas">
        <div ref={cardVisualRef} className={`card-visual ${getVariantClassName(settings, variant)}`} style={getVariantStyle(settings, variant)}>
          <div className="card-topline">{failedLogoUrl === logoUrl ? <span className="brand-logo-fallback" role="img" aria-label="Invest RS">Invest RS</span> : <img className="public-card-logo" src={logoUrl} alt="Invest RS" onError={() => setFailedLogoUrl(logoUrl)} />}{card.show_avatar_public && card.avatar_url ? <div className="public-card-avatar-wrapper"><img className="public-card-avatar" src={card.avatar_url} alt={`Foto de ${name}`} /></div> : null}</div>
          <div className="card-main"><div className="person-block"><h1>{name}</h1>{professionalData?.jobTitle ? <p className="job-title">{professionalData.jobTitle}</p> : null}{professionalData?.department ? <p className="department">{professionalData.department}</p> : null}</div></div>
          <div className="card-footer"><div className="contact-list public-card-contact-list">{phone ? <a href={`https://wa.me/${normalizePhoneForWhatsApp(phone)}`} target="_blank" rel="noreferrer"><ContactLabel icon={MessageCircle}>WhatsApp</ContactLabel><span className="contact-value">{phone}</span></a> : null}{card.email ? <a href={`mailto:${card.email}`}><ContactLabel icon={Mail}>{copy.email}</ContactLabel><span className="contact-value">{card.email}</span></a> : null}{card.website ? <a href={card.website} target="_blank" rel="noreferrer"><ContactLabel icon={Globe}>{copy.website}</ContactLabel><span className="contact-value">{card.website.replace(/^https?:\/\//, '')}</span></a> : null}{address ? <a className="contact-address" href={INVEST_RS_MAPS_URL} target="_blank" rel="noreferrer"><ContactLabel icon={MapPin}>{copy.address}</ContactLabel><span className="contact-value">{address}</span></a> : null}</div>{qrDataUrl ? <img className="qr-code" src={qrDataUrl} alt={`QR Code de ${name}`} /> : null}</div>
          <div className="public-card-initial-toolbar" aria-label="Ações rápidas do cartão">
            <LanguageToggle language={language} className="public-card-language-mobile" onChange={changeLanguage} />
            <div className="public-card-initial-actions">
              <Link to="/meu-cartao/editar" aria-label="Editar" title="Editar"><Pencil aria-hidden="true" /></Link>
              <button type="button" aria-label="Baixar QR Code" title="Baixar QR Code" disabled={Boolean(actions.running)} onClick={() => void actions.downloadQrCode()}><Download aria-hidden="true" /></button>
              <button type="button" aria-label="Exportar" title="Exportar" disabled={Boolean(actions.running)} onClick={() => setShareMenuOpen(true)}><FileUp aria-hidden="true" /></button>
              <Link to="/meu-cartao/estatisticas" aria-label="Estatísticas" title="Estatísticas"><BarChart3 aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
        <div className={`action-panel public-card-actions-panel ${actionTheme}`} ref={actionPanelRef} id="card-lower-actions">
          <div className="public-card-actions-heading">
            <p className="eyebrow">Minha Página</p>
            <LanguageToggle language={language} className="public-card-language-desktop" onChange={changeLanguage} />
          </div>
          <h2>Gerencie e compartilhe seu cartão</h2>
          <div className="button-grid collaborator-owner-actions">
            <div className="share-contact-control" ref={shareControlRef}>
              <button className="primary-button share-contact-trigger" type="button" aria-haspopup="menu" aria-expanded={shareMenuOpen} onClick={() => setShareMenuOpen((current) => !current)}>Compartilhar meu contato</button>
              {shareMenuOpen ? <div className="share-contact-popover" role="menu" aria-label="Opções para compartilhar contato">
                <button type="button" role="menuitem" disabled={Boolean(shareAction)} onClick={() => void actions.copyVCard().then(() => setShareMenuOpen(false))}><Copy aria-hidden="true" /><span>Copiar vCard</span></button>
                <button type="button" role="menuitem" disabled={Boolean(shareAction)} onClick={shareOnWhatsApp}><MessageCircle aria-hidden="true" /><span>Enviar por WhatsApp</span></button>
                <button type="button" role="menuitem" disabled={Boolean(shareAction)} onClick={() => void saveCardPng()}><Download aria-hidden="true" /><span>{shareAction === 'card' ? 'Gerando...' : 'Salvar Card'}</span></button>
                <button type="button" role="menuitem" disabled={Boolean(shareAction) || Boolean(actions.running)} onClick={() => void actions.downloadQrCode().then(() => setShareMenuOpen(false))}><QrCode aria-hidden="true" /><span>Salvar QR-Code</span></button>
                <button type="button" role="menuitem" disabled={Boolean(shareAction)} onClick={shareByGmail}><Mail aria-hidden="true" /><span>Enviar pelo Gmail</span></button>
                <button type="button" role="menuitem" disabled={Boolean(shareAction)} onClick={() => void shareViaAirDrop()}><FileUp aria-hidden="true" /><span>{shareAction === 'airdrop' ? 'Abrindo...' : 'AirDrop'}</span></button>
              </div> : null}
            </div>
            <Link className="auxiliary-button" to="/meu-cartao/editar">Editar Dados</Link>
            {!isInstalled ? <button className="secondary-button install-page-button" type="button" onClick={openInstallModal}><Smartphone aria-hidden="true" />Instale esta página como app</button> : null}
            <Link className="auxiliary-button" to="/meu-cartao/assinatura-de-email">Gerar Rodapé para E-mail</Link>
            <Link className="auxiliary-button" to="/meu-cartao/estatisticas">Estatísticas de Compartilhamento</Link>
          </div>
          <section className="extra-functions" aria-labelledby="extra-functions-title">
            <h3 id="extra-functions-title">Funcionalidades adicionais</h3>
            <div className="extra-actions-grid">
              <Link className="extra-action-button" to="/guia-de-utilizacao"><BookOpen className="extra-action-icon" aria-hidden="true" /><span className="extra-action-label">Guia de Utilização</span></Link>
              <Link className="extra-action-button" to="/termos-de-uso-e-privacidade"><FileText className="extra-action-icon" aria-hidden="true" /><span className="extra-action-label">Termos de Uso e Privacidade</span></Link>
              <button className="extra-action-button" type="button" disabled={Boolean(actions.running)} onClick={() => void actions.openWallet()}><Wallet className="extra-action-icon" aria-hidden="true" /><span className="extra-action-label">{actions.running === 'wallet' ? 'Abrindo...' : 'Adicionar à Wallet'}</span></button>
              <div className="extra-action-button models-colors-action"><Palette className="extra-action-icon" aria-hidden="true" /><span className="extra-action-label">Modelos e Cores</span><VisualModeSelector variant="compact" /></div>
            </div>
          </section>
        </div>
      </section>
    </div>
  </CollaboratorLayout>
}
