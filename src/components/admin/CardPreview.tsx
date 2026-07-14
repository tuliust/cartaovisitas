import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import type { CardFormValues } from '../../lib/adminCards'
import { useBrandSettings } from '../../contexts/BrandSettingsContext'
import { getVariantClassName, getVariantLogo, getVariantStyle } from '../../lib/cardVisualVariants'
import { Globe, Mail, MapPin, MessageCircle, type LucideIcon } from 'lucide-react'

type CardPreviewProps = {
  values: CardFormValues
  showStatus?: boolean
}

function buildAddress(values: CardFormValues) {
  return [values.address_line, values.city, values.state, values.country].filter(Boolean).join(', ')
}

function normalizePhoneForWhatsApp(phone: string) { return phone.replace(/\D/g, '') }
const INVEST_RS_MAPS_URL = 'https://maps.app.goo.gl/Je4hp2P23VrX6Ctq8'

function buildPreviewQrValue(values: CardFormValues) {
  const name = values.display_name || values.full_name || 'Contato Invest RS'
  const phone = values.mobile_phone || values.work_phone
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    'ORG:Invest RS',
    values.job_title ? `TITLE:${values.job_title}` : '',
    phone ? `TEL;TYPE=CELL:${phone}` : '',
    values.email ? `EMAIL:${values.email}` : '',
    values.website ? `URL:${values.website}` : '',
    'END:VCARD',
  ].filter(Boolean).join('\r\n')
}

function PreviewContactLabel({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return <span className="card-preview-contact-label"><Icon aria-hidden="true" /><span className="card-preview-contact-label-text">{children}</span></span>
}

export default function CardPreview({ values, showStatus = true }: CardPreviewProps) {
  const { settings } = useBrandSettings()
  const [qrDataUrl, setQrDataUrl] = useState('')
  const name = values.display_name || values.full_name || 'Nome completo'
  const phone = values.mobile_phone || values.work_phone
  const address = buildAddress(values)
  const logoUrl = getVariantLogo(settings, values.public_visual_variant, values.logo_url)
  const qrValue = useMemo(() => buildPreviewQrValue(values), [values])

  useEffect(() => {
    void QRCode.toDataURL(qrValue, { width: 360, margin: 1, errorCorrectionLevel: 'M' })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(''))
  }, [qrValue])

  return (
    <aside className={`card-preview card-preview--responsive ${getVariantClassName(settings, values.public_visual_variant)}`} style={getVariantStyle(settings, values.public_visual_variant)} aria-label="Prévia do cartão">
      <div className="card-preview-top">
        <img className="public-card-logo card-preview-logo" src={logoUrl} alt="Invest RS" />
        <div className="card-preview-top-actions">
          {values.show_avatar_public && values.avatar_url ? <div className="public-card-avatar-wrapper preview"><img className="public-card-avatar" src={values.avatar_url} alt={`Foto de ${name}`} /></div> : null}
          {showStatus ? <span className={values.is_active ? 'status-pill active' : 'status-pill inactive'}>{values.is_active ? 'Ativo' : 'Inativo'}</span> : null}
        </div>
      </div>

      <div className="card-preview-person">
        <h2>{name}</h2>
        {values.job_title ? <p className="card-preview-job-title">{values.job_title}</p> : null}
        {values.department ? <p className="card-preview-department">{values.department}</p> : null}
      </div>

      <div className="card-preview-footer">
        <div className="contact-list card-preview-contact-list">
          {phone ? <a href={`https://wa.me/${normalizePhoneForWhatsApp(phone)}`} target="_blank" rel="noreferrer"><PreviewContactLabel icon={MessageCircle}>WhatsApp</PreviewContactLabel><span className="card-preview-contact-value">{phone}</span></a> : null}
          {values.email ? <a href={`mailto:${values.email}`}><PreviewContactLabel icon={Mail}>E-mail</PreviewContactLabel><span className="card-preview-contact-value">{values.email}</span></a> : null}
          {values.website ? <a href={values.website} target="_blank" rel="noreferrer"><PreviewContactLabel icon={Globe}>Site</PreviewContactLabel><span className="card-preview-contact-value">{values.website.replace(/^https?:\/\//, '')}</span></a> : null}
          {address ? <a className="card-preview-contact-address" href={INVEST_RS_MAPS_URL} target="_blank" rel="noreferrer"><PreviewContactLabel icon={MapPin}>Endereço</PreviewContactLabel><span className="card-preview-contact-value">{address}</span></a> : null}
        </div>

        {qrDataUrl ? <img className="card-preview-qr" src={qrDataUrl} alt={`QR Code de ${name}`} /> : null}
      </div>
    </aside>
  )
}
