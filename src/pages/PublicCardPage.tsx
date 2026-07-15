import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import QRCode from 'qrcode'
import { BarChart3, Copy, Download, FileUp, Globe, Mail, MapPin, MessageCircle, Pencil, QrCode, Smartphone, Wallet, type LucideIcon } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import CollaboratorLayout from '../components/collaborator/CollaboratorLayout'
import { useBrandSettings } from '../contexts/BrandSettingsContext'
import { useCollaborator } from '../contexts/CollaboratorContext'
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
  const { isInstalled, openInstallModal } = useInstallApp()
  const actionPanelRef = useRef<HTMLDivElement>(null)
  const desktopStageRef = useRef<HTMLDivElement>(null)
  const [desktopScale, setDesktopScale] = useState(1)
  const [language, setLanguage] = useState<PublicVisualLanguage>(getStoredPublicCardLanguage)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [failedLogoUrl, setFailedLogoUrl] = useState('')

  const qrValue = actions.qrValue
  useEffect(() => { if (card && slug === card.slug) void recordCardEvent(card.id, 'view') }, [card, slug])
  useEffect(() => { if (!qrValue || !card || slug !== card.slug) return; QRCode.toDataURL(qrValue, { width: 360, margin: 1, errorCorrectionLevel: 'M' }).then(setQrDataUrl).catch(() => setQrDataUrl('')) }, [card, qrValue, slug])
  useEffect(() => {
    const stage = desktopStageRef.current
    if (!stage) return

    const updateScale = () => {
      if (window.innerWidth < 901) {
        setDesktopScale(1)
        return
      }

      const rect = stage.getBoundingClientRect()
      const availableWidth = stage.clientWidth
      const availableHeight = Math.max(1, window.innerHeight - rect.top - PUBLIC_CARD_DESKTOP_BOTTOM_GAP)
      const nextScale = Math.min(
        availableWidth / PUBLIC_CARD_DESKTOP_WIDTH,
        availableHeight / PUBLIC_CARD_DESKTOP_HEIGHT,
      )
      setDesktopScale(Math.max(0.1, nextScale))
    }

    updateScale()
    const observer = new ResizeObserver(updateScale)
    observer.observe(stage)
    window.addEventListener('resize', updateScale)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateScale)
    }
  }, [])
  const professionalData = useMemo(() => card ? getLocalizedProfessionalData(card, language) : null, [card, language])

  if (!card) return <Navigate to="/meu-cartao/editar" replace />
  if (!slug || slug !== card.slug) return <Navigate to="/meu-cartao" replace />

  const name = card.display_name || card.full_name
  const phone = card.mobile_phone || card.work_phone
  const address = buildAddress(card)
  const variant = hasVisualModePreference ? visualMode : card.public_visual_variant ?? 'dark_black'
  const actionTheme = isLightVisualVariant(getEffectiveVisualVariant(settings, variant)) ? 'action-panel-theme-light' : 'action-panel-theme-dark'
  const logoUrl = getVariantLogo(settings, variant, card.logo_url)
  const copy = publicCardCopy[language]
  const desktopStageStyle = {
    '--public-card-desktop-scale': desktopScale,
    height: `${PUBLIC_CARD_DESKTOP_HEIGHT * desktopScale}px`,
  } as CSSProperties
  function changeLanguage(next: PublicCardLanguage) { setLanguage(next); storePublicCardLanguage(next) }

  return <CollaboratorLayout>
    <div className="public-card-desktop-stage" ref={desktopStageRef} style={desktopStageStyle}>
      <section className="digital-card collaborator-own-card public-card-desktop-canvas">
        <div className={`card-visual ${getVariantClassName(settings, variant)}`} style={getVariantStyle(settings, variant)}>
          <div className="card-topline">{failedLogoUrl === logoUrl ? <span className="brand-logo-fallback" role="img" aria-label="Invest RS">Invest RS</span> : <img className="public-card-logo" src={logoUrl} alt="Invest RS" onError={() => setFailedLogoUrl(logoUrl)} />}{card.show_avatar_public && card.avatar_url ? <div className="public-card-avatar-wrapper"><img className="public-card-avatar" src={card.avatar_url} alt={`Foto de ${name}`} /></div> : null}</div>
          <div className="card-main"><div className="person-block"><h1>{name}</h1>{professionalData?.jobTitle ? <p className="job-title">{professionalData.jobTitle}</p> : null}{professionalData?.department ? <p className="department">{professionalData.department}</p> : null}</div></div>
          <div className="card-footer"><div className="contact-list public-card-contact-list">{phone ? <a href={`https://wa.me/${normalizePhoneForWhatsApp(phone)}`} target="_blank" rel="noreferrer"><ContactLabel icon={MessageCircle}>WhatsApp</ContactLabel><span className="contact-value">{phone}</span></a> : null}{card.email ? <a href={`mailto:${card.email}`}><ContactLabel icon={Mail}>{copy.email}</ContactLabel><span className="contact-value">{card.email}</span></a> : null}{card.website ? <a href={card.website} target="_blank" rel="noreferrer"><ContactLabel icon={Globe}>{copy.website}</ContactLabel><span className="contact-value">{card.website.replace(/^https?:\/\//, '')}</span></a> : null}{address ? <a className="contact-address" href={INVEST_RS_MAPS_URL} target="_blank" rel="noreferrer"><ContactLabel icon={MapPin}>{copy.address}</ContactLabel><span className="contact-value">{address}</span></a> : null}</div>{qrDataUrl ? <img className="qr-code" src={qrDataUrl} alt={`QR Code de ${name}`} /> : null}</div>
          <div className="public-card-initial-toolbar" aria-label="Acoes rapidas do cartao">
            <LanguageToggle language={language} className="public-card-language-mobile" onChange={changeLanguage} />
            <div className="public-card-initial-actions">
              <Link to="/meu-cartao/editar" aria-label="Editar" title="Editar"><Pencil aria-hidden="true" /></Link>
              <button type="button" aria-label="Baixar QR Code" title="Baixar QR Code" disabled={Boolean(actions.running)} onClick={() => void actions.downloadQrCode()}><Download aria-hidden="true" /></button>
              <button type="button" aria-label="Exportar" title="Exportar" disabled={Boolean(actions.running)} onClick={() => void (actions.canShareVCard ? actions.shareVCard() : actions.copyVCard())}><FileUp aria-hidden="true" /></button>
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
            {actions.shareSupportChecked && actions.canShareVCard ? <button className="primary-button" type="button" disabled={Boolean(actions.running)} onClick={() => void actions.shareVCard()}>{actions.running === 'share' ? 'Preparando vCard...' : 'Compartilhar contato'}</button> : null}
            {!isInstalled ? <button className="secondary-button install-page-button" type="button" onClick={openInstallModal}><Smartphone aria-hidden="true" />Instale esta página como app</button> : null}
            <Link className="auxiliary-button" to="/guia-de-utilizacao">Guia de Utilização</Link>
            <Link className="auxiliary-button" to="/meu-cartao/assinatura-de-email">Gerar Rodapé para E-mail</Link>
            <Link className="auxiliary-button" to="/meu-cartao/estatisticas">Estatísticas de Compartilhamento</Link>
          </div>
          <section className="extra-functions" aria-labelledby="extra-functions-title">
            <h3 id="extra-functions-title">Funcionalidades adicionais</h3>
            <div className="extra-actions-grid">
              <Link className="extra-action-button" to="/meu-cartao/editar"><Pencil className="extra-action-icon" aria-hidden="true" /><span className="extra-action-label">Editar</span></Link>
              <button className="extra-action-button" type="button" disabled={Boolean(actions.running)} onClick={() => void actions.copyVCard()}><Copy className="extra-action-icon" aria-hidden="true" /><span className="extra-action-label">{actions.running === 'copy-vcard' ? 'Copiando...' : 'Copiar vCard'}</span></button>
              <button className="extra-action-button" type="button" disabled={Boolean(actions.running)} onClick={() => void actions.downloadQrCode()}><QrCode className="extra-action-icon" aria-hidden="true" /><span className="extra-action-label">{actions.running === 'qr' ? 'Gerando...' : 'Baixar QR-Code'}</span></button>
              <button className="extra-action-button" type="button" disabled={Boolean(actions.running)} onClick={() => void actions.openWallet()}><Wallet className="extra-action-icon" aria-hidden="true" /><span className="extra-action-label">{actions.running === 'wallet' ? 'Abrindo...' : 'Adicionar à Wallet'}</span></button>
            </div>
          </section>
        </div>
      </section>
    </div>
  </CollaboratorLayout>
}