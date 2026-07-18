import { forwardRef, useMemo, useState, type ReactNode } from 'react'
import { Globe, Mail, MapPin, MessageCircle, type LucideIcon } from 'lucide-react'
import { useBrandSettings } from '../contexts/BrandSettingsContext'
import type { AdminBusinessCard } from '../lib/adminCards'
import { getVariantClassName, getVariantLogo, getVariantStyle, type PublicVisualVariant } from '../lib/cardVisualVariants'
import { getLocalizedProfessionalData, publicCardCopy, publicCardLanguageLabels, type PublicCardLanguage } from '../lib/publicCardLocale'

const INVEST_RS_MAPS_URL = 'https://maps.app.goo.gl/Je4hp2P23VrX6Ctq8'

function getPublicCardName(card: AdminBusinessCard) {
  return card.display_name || card.full_name
}

function getPublicCardPhone(card: AdminBusinessCard) {
  return card.mobile_phone || card.work_phone
}

function getPublicCardAddress(card: AdminBusinessCard) {
  return [card.address_line, card.city, card.state, card.country].filter(Boolean).join(', ')
}

function normalizePhoneForWhatsApp(phone: string) {
  return phone.replace(/\D/g, '')
}

function ContactLabel({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return <span className="contact-label"><Icon aria-hidden="true" /><span className="contact-label-text">{children}</span></span>
}

export function PublicCardLanguageToggle({ language, className = '', onChange }: { language: PublicCardLanguage; className?: string; onChange: (language: PublicCardLanguage) => void }) {
  return <div className={`public-language-toggle${className ? ` ${className}` : ''}`} role="group" aria-label="Idioma do cartão">
    {(Object.keys(publicCardLanguageLabels) as PublicCardLanguage[]).map((item) => <button key={item} type="button" className={language === item ? 'active' : ''} aria-pressed={language === item} onClick={() => onChange(item)}>{publicCardLanguageLabels[item]}</button>)}
  </div>
}

type PublicCardVisualProps = {
  card: AdminBusinessCard
  language: PublicCardLanguage
  variant: PublicVisualVariant
  qrDataUrl: string
  toolbar?: ReactNode
}

const PublicCardVisual = forwardRef<HTMLDivElement, PublicCardVisualProps>(function PublicCardVisual({ card, language, variant, qrDataUrl, toolbar }, ref) {
  const { settings } = useBrandSettings()
  const [failedLogoUrl, setFailedLogoUrl] = useState('')
  const professionalData = useMemo(() => getLocalizedProfessionalData(card, language), [card, language])
  const name = getPublicCardName(card)
  const phone = getPublicCardPhone(card)
  const address = getPublicCardAddress(card)
  const logoUrl = getVariantLogo(settings, variant, card.logo_url)
  const copy = publicCardCopy[language]

  return <div ref={ref} className={`card-visual ${getVariantClassName(settings, variant)}`} style={getVariantStyle(settings, variant)}>
    <div className="card-topline">{failedLogoUrl === logoUrl ? <span className="brand-logo-fallback" role="img" aria-label="Invest RS">Invest RS</span> : <img className="public-card-logo" src={logoUrl} alt="Invest RS" onError={() => setFailedLogoUrl(logoUrl)} />}{card.show_avatar_public && card.avatar_url ? <div className="public-card-avatar-wrapper"><img className="public-card-avatar" src={card.avatar_url} alt={`Foto de ${name}`} /></div> : null}</div>
    <div className="card-main"><div className="person-block"><h1>{name}</h1>{professionalData.jobTitle ? <p className="job-title">{professionalData.jobTitle}</p> : null}{professionalData.department ? <p className="department">{professionalData.department}</p> : null}</div></div>
    <div className="card-footer"><div className="contact-list public-card-contact-list">{phone ? <a href={`https://wa.me/${normalizePhoneForWhatsApp(phone)}`} target="_blank" rel="noreferrer"><ContactLabel icon={MessageCircle}>WhatsApp</ContactLabel><span className="contact-value">{phone}</span></a> : null}{card.email ? <a href={`mailto:${card.email}`}><ContactLabel icon={Mail}>{copy.email}</ContactLabel><span className="contact-value">{card.email}</span></a> : null}{card.website ? <a href={card.website} target="_blank" rel="noreferrer"><ContactLabel icon={Globe}>{copy.website}</ContactLabel><span className="contact-value">{card.website.replace(/^https?:\/\//, '')}</span></a> : null}{address ? <a className="contact-address" href={INVEST_RS_MAPS_URL} target="_blank" rel="noreferrer"><ContactLabel icon={MapPin}>{copy.address}</ContactLabel><span className="contact-value">{address}</span></a> : null}</div>{qrDataUrl ? <img className="qr-code" src={qrDataUrl} alt={`QR Code de ${name}`} /> : null}</div>
    {toolbar}
  </div>
})

export default PublicCardVisual
