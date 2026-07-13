import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { Copy, Pencil, QrCode, Smartphone, Wallet } from 'lucide-react'
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

function normalizePhoneForLink(phone: string) { return phone.replace(/[^\d+]/g, '') }
function buildAddress(card: NonNullable<ReturnType<typeof useCollaborator>['card']>) { return [card.address_line, card.city, card.state, card.country].filter(Boolean).join(', ') }

export default function PublicCardPage() {
  const { slug } = useParams()
  const { card, actions } = useCollaborator()
  const { settings } = useBrandSettings()
  const { visualMode, hasVisualModePreference } = useVisualMode()
  const { isInstalled, openInstallModal } = useInstallApp()
  const [language, setLanguage] = useState<PublicVisualLanguage>(getStoredPublicCardLanguage)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [failedLogoUrl, setFailedLogoUrl] = useState('')

  const qrUrl = actions.qrUrl
  useEffect(() => { if (card && slug === card.slug) void recordCardEvent(card.id, 'view') }, [card, slug])
  useEffect(() => { if (!qrUrl || !card || slug !== card.slug) return; QRCode.toDataURL(qrUrl, { width: 360, margin: 1, errorCorrectionLevel: 'M' }).then(setQrDataUrl).catch(() => setQrDataUrl('')) }, [card, qrUrl, slug])
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
  function changeLanguage(next: PublicCardLanguage) { setLanguage(next); storePublicCardLanguage(next) }

  return <CollaboratorLayout>
    <section className="digital-card collaborator-own-card">
      <div className={`card-visual ${getVariantClassName(settings, variant)}`} style={getVariantStyle(settings, variant)}>
        <div className="card-topline">{failedLogoUrl === logoUrl ? <span className="brand-logo-fallback" role="img" aria-label="Invest RS">Invest RS</span> : <img className="public-card-logo" src={logoUrl} alt="Invest RS" onError={() => setFailedLogoUrl(logoUrl)} />}{card.show_avatar_public && card.avatar_url ? <div className="public-card-avatar-wrapper"><img className="public-card-avatar" src={card.avatar_url} alt={`Foto de ${name}`} /></div> : null}</div>
        <div className="card-main"><div className="person-block"><p className="label">{copy.institutionalContact}</p><h1>{name}</h1>{professionalData?.jobTitle ? <p className="job-title">{professionalData.jobTitle}</p> : null}{professionalData?.department ? <p className="department">{professionalData.department}</p> : null}</div></div>
        <div className="card-footer"><div className="contact-list public-card-contact-list">{phone ? <a href={`tel:${normalizePhoneForLink(phone)}`}><span>{copy.phone}</span>{phone}</a> : null}{card.email ? <a href={`mailto:${card.email}`}><span>{copy.email}</span>{card.email}</a> : null}{card.website ? <a href={card.website} target="_blank" rel="noreferrer"><span>{copy.website}</span>{card.website.replace(/^https?:\/\//, '')}</a> : null}{address ? <p><span>{copy.address}</span>{address}</p> : null}</div>{qrDataUrl ? <img className="qr-code" src={qrDataUrl} alt={`QR Code de ${name}`} /> : null}</div>
      </div>
      <div className={`action-panel public-card-actions-panel ${actionTheme}`}>
        <div className="public-panel-controls"><div className="public-language-toggle" aria-label="Idioma do cartão">{(Object.keys(publicCardLanguageLabels) as PublicCardLanguage[]).map((item) => <button key={item} type="button" className={language === item ? 'active' : ''} aria-pressed={language === item} onClick={() => changeLanguage(item)}>{publicCardLanguageLabels[item]}</button>)}</div></div>
        <p className="eyebrow">Ferramentas da minha página</p><h2>Gerencie e compartilhe seu cartão</h2>
        <div className="button-grid collaborator-owner-actions">
          {actions.shareSupportChecked && actions.canShareVCard ? <button className="primary-button" type="button" disabled={Boolean(actions.running)} onClick={() => void actions.shareVCard()}>{actions.running === 'share' ? 'Preparando vCard...' : 'Compartilhar contato'}</button> : null}
          {!isInstalled ? <button className="secondary-button install-page-button" type="button" onClick={openInstallModal}><Smartphone aria-hidden="true" />Instale esta página como app</button> : null}
          <Link className="secondary-button" to="/meu-cartao/guia">Guia de Utilização</Link>
          <Link className="secondary-button" to="/meu-cartao/assinatura-de-email">Gerar Rodapé para E-mail</Link>
          <Link className="secondary-button" to="/meu-cartao/estatisticas">Estatísticas de Compartilhamento</Link>
        </div>
        <p className="public-card-secondary-link"><Link to="/termos-de-uso-e-privacidade">Termos de Uso e Privacidade</Link></p>
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
  </CollaboratorLayout>
}
