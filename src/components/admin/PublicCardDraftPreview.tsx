import { ChevronDown } from 'lucide-react'
import QRCode from 'qrcode'
import { useEffect, useMemo, useState } from 'react'
import PublicCardVisual, { PublicCardLanguageToggle } from '../PublicCardVisual'
import type { AdminBusinessCard, CardFormValues } from '../../lib/adminCards'
import type { PublicCardLanguage } from '../../lib/publicCardLocale'

function nullable(value: string) {
  const normalized = value.trim()
  return normalized || null
}

function toPreviewCard(values: CardFormValues): AdminBusinessCard {
  return {
    id: 'card-preview',
    slug: values.slug || 'preview',
    full_name: values.full_name || 'Nome completo',
    display_name: nullable(values.display_name),
    job_title: nullable(values.job_title_pt || values.job_title),
    department: nullable(values.department_pt || values.department),
    job_title_pt: nullable(values.job_title_pt || values.job_title),
    job_title_es: nullable(values.job_title_es),
    job_title_en: nullable(values.job_title_en),
    department_pt: nullable(values.department_pt || values.department),
    department_es: nullable(values.department_es),
    department_en: nullable(values.department_en),
    company: nullable(values.company) || 'Invest RS',
    mobile_phone: nullable(values.mobile_phone),
    work_phone: nullable(values.work_phone),
    email: nullable(values.email),
    website: nullable(values.website),
    address_line: nullable(values.address_line),
    city: nullable(values.city),
    state: nullable(values.state),
    country: nullable(values.country) || 'Brasil',
    linkedin_url: nullable(values.linkedin_url),
    instagram_url: nullable(values.instagram_url),
    avatar_url: nullable(values.avatar_url),
    show_avatar_public: values.show_avatar_public,
    logo_url: nullable(values.logo_url),
    theme: 'invest_black',
    public_visual_variant: values.public_visual_variant,
    is_active: values.is_active,
    expires_at: null,
    created_at: null,
    updated_at: null,
    created_by: null,
  }
}

function buildPreviewQrValue(values: CardFormValues) {
  const name = values.display_name || values.full_name || 'Contato Invest RS'
  const phone = values.mobile_phone || values.work_phone

  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    'ORG:Invest RS',
    values.job_title_pt || values.job_title ? `TITLE:${values.job_title_pt || values.job_title}` : '',
    phone ? `TEL;TYPE=CELL:${phone}` : '',
    values.email ? `EMAIL:${values.email}` : '',
    values.website ? `URL:${values.website}` : '',
    'END:VCARD',
  ].filter(Boolean).join('\r\n')
}

export default function PublicCardDraftPreview({ values, showStatus = false }: { values: CardFormValues; showStatus?: boolean }) {
  const [language, setLanguage] = useState<PublicCardLanguage>('pt')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const card = useMemo(() => toPreviewCard(values), [values])
  const qrValue = useMemo(() => buildPreviewQrValue(values), [values])

  useEffect(() => {
    let cancelled = false

    void QRCode.toDataURL(qrValue, { width: 360, margin: 1, errorCorrectionLevel: 'M' })
      .then((value) => {
        if (!cancelled) setQrDataUrl(value)
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl('')
      })

    return () => {
      cancelled = true
    }
  }, [qrValue])

  return <div className="draft-public-card-preview collaborator-own-card">
    <PublicCardVisual
      card={card}
      language={language}
      variant={values.public_visual_variant}
      qrDataUrl={qrDataUrl}
      toolbar={<div className="public-card-initial-toolbar" aria-label="Idioma e ferramentas do cartão no preview">
        <PublicCardLanguageToggle language={language} className="public-card-language-mobile" onChange={setLanguage} />
        <div className="public-card-initial-actions" aria-hidden="true">
          <span className="public-card-mobile-expand draft-preview-expand-icon"><ChevronDown /></span>
        </div>
      </div>}
    />
    {showStatus ? <span className={`draft-preview-status status-pill ${values.is_active ? 'active' : 'inactive'}`}>{values.is_active ? 'Ativo' : 'Inativo'}</span> : null}
  </div>
}
