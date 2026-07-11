import { useEffect, useMemo, useState } from 'react'
import { Copy, Pencil, QrCode, Wallet } from 'lucide-react'
import QRCode from 'qrcode'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCurrentSession } from '../lib/auth'
import { getPublicCardBySlug, recordCardEvent, type BusinessCard } from '../lib/cards'
import {
  getLocalizedProfessionalData,
  getStoredPublicCardLanguage,
  publicCardCopy,
  publicCardLanguageLabels,
  storePublicCardLanguage,
  type PublicCardLanguage,
} from '../lib/publicCardLocale'
import { downloadQrCodePng } from '../lib/qrcode'
import { useBrandSettings } from '../contexts/BrandSettingsContext'
import WalletSupportModal from '../components/WalletSupportModal'
import { getAppleWalletUrl, isIosDevice, isWalletPublicEnabled } from '../lib/wallet'
import { useToast } from '../contexts/ToastContext'
import { getEffectiveVisualVariant, getVariantClassName, getVariantLogo, getVariantStyle, isLightVisualVariant } from '../lib/cardVisualVariants'
import { useVisualMode } from '../contexts/VisualModeContext'

type PageStatus = 'loading' | 'ready' | 'not-found' | 'error'

function normalizePhoneForLink(phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

function buildAddress(card: BusinessCard) {
  return [card.address_line, card.city, card.state, card.country].filter(Boolean).join(', ')
}

function getBaseUrl() {
  const envBaseUrl = import.meta.env.VITE_APP_BASE_URL
  return envBaseUrl ? envBaseUrl.replace(/\/$/, '') : window.location.origin
}

export default function PublicCardPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { settings } = useBrandSettings()
  const { visualMode, hasVisualModePreference } = useVisualMode()
  const { slug } = useParams()
  const [card, setCard] = useState<BusinessCard | null>(null)
  const [status, setStatus] = useState<PageStatus>('loading')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [language, setLanguage] = useState<PublicCardLanguage>(getStoredPublicCardLanguage)
  const [failedLogoUrl, setFailedLogoUrl] = useState('')
  const [walletModalOpen, setWalletModalOpen] = useState(false)

  const vcardUrl = useMemo(() => slug ? `${getBaseUrl()}/api/vcard/${slug}?lang=${language}` : '', [language, slug])
  const qrUrl = useMemo(() => slug ? `${getBaseUrl()}/qr/${slug}?lang=${language}` : '', [language, slug])

  useEffect(() => {
    let isMounted = true

    async function loadCard() {
      if (!slug) {
        setStatus('not-found')
        return
      }

      try {
        setStatus('loading')
        const result = await getPublicCardBySlug(slug)
        if (!isMounted) return
        if (!result) {
          setStatus('not-found')
          return
        }

        setCard(result)
        setStatus('ready')
        void recordCardEvent(result.id, 'view')
      } catch (error) {
        console.error(error)
        if (isMounted) setStatus('error')
      }
    }

    void loadCard()
    return () => { isMounted = false }
  }, [slug])

  useEffect(() => {
    if (!qrUrl || status !== 'ready') return
    QRCode.toDataURL(qrUrl, { width: 360, margin: 1, errorCorrectionLevel: 'M' })
      .then(setQrDataUrl)
      .catch((error: unknown) => console.error('Erro ao gerar QR Code:', error))
  }, [qrUrl, status])

  function changeLanguage(nextLanguage: PublicCardLanguage) {
    setLanguage(nextLanguage)
    storePublicCardLanguage(nextLanguage)
  }

  function handleDownloadVCard() {
    if (!card) return
    const anchor = document.createElement('a')
    anchor.href = vcardUrl
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    toast.success('Contato pronto para ser salvo.')
    void recordCardEvent(card.id, 'vcard')
  }

  async function handleShareCard() {
    if (!card) return
    const cardUrl = `${window.location.origin}/${card.slug}`
    const title = `${card.display_name || card.full_name} | ${card.company || 'Invest RS'}`
    let usedNativeShare = false

    try {
      if ('share' in navigator && typeof navigator.share === 'function') {
        await navigator.share({ title, text: `${publicCardCopy[language].institutionalContact}: ${card.display_name || card.full_name}`, url: cardUrl })
        usedNativeShare = true
      } else {
        await navigator.clipboard.writeText(cardUrl)
      }
      toast.success(usedNativeShare ? 'Cartão compartilhado com sucesso.' : publicCardCopy.pt.linkCopied)
      void recordCardEvent(card.id, 'share')
    } catch (error) {
      console.warn('Compartilhamento cancelado ou indisponível:', error)
      toast.error('Não foi possível compartilhar o cartão agora.')
    }
  }

  async function handleEdit() {
    const session = await getCurrentSession().catch(() => null)
    navigate(session ? '/meu-cartao/editar' : '/entrar')
  }

  async function handleCopyVCard() {
    if (!card) return
    try {
      await navigator.clipboard.writeText(vcardUrl)
      toast.success(publicCardCopy.pt.vcardCopied)
      void recordCardEvent(card.id, 'vcard')
    } catch {
      toast.error('Não foi possível copiar o link do vCard.')
    }
  }

  async function handleDownloadQrCode() {
    if (!card) return
    try {
      await downloadQrCodePng(qrUrl, `qr-code-${card.slug}.png`)
      toast.success('QR Code baixado com sucesso.')
      void recordCardEvent(card.id, 'qr')
    } catch {
      toast.error('Não foi possível baixar o QR Code.')
    }
  }

  function handleWallet() {
    if (!card) return
    if (!isWalletPublicEnabled()) {
      setWalletModalOpen(true)
      toast.info('Wallet em breve.')
      return
    }
    if (isIosDevice()) {
      window.location.assign(getAppleWalletUrl(card.slug))
      return
    }
    setWalletModalOpen(true)
  }

  if (status === 'loading') return <main className="app-shell"><section className="state-card">Carregando cartão...</section></main>
  if (status === 'not-found') return <main className="app-shell"><section className="state-card"><h1>Cartão não encontrado</h1><p>Verifique se o link está correto ou se o cartão ainda está ativo.</p><Link to="/">Voltar</Link></section></main>
  if (status === 'error' || !card) return <main className="app-shell"><section className="state-card"><h1>Erro ao carregar</h1><p>Não foi possível carregar este cartão agora.</p></section></main>

  const cardCopy = publicCardCopy[language]
  const interfaceCopy = publicCardCopy.pt
  const professionalData = getLocalizedProfessionalData(card, language)
  const name = card.display_name || card.full_name
  const phone = card.mobile_phone || card.work_phone
  const phoneLink = phone ? normalizePhoneForLink(phone) : ''
  const address = buildAddress(card)
  const visualVariant = hasVisualModePreference ? visualMode : card.public_visual_variant ?? 'dark_black'
  const actionPanelTheme = isLightVisualVariant(getEffectiveVisualVariant(settings, visualVariant)) ? 'action-panel-theme-light' : 'action-panel-theme-dark'
  const logoUrl = getVariantLogo(settings, visualVariant, card.logo_url)
  const logoFailed = failedLogoUrl === logoUrl
  const showAvatar = card.show_avatar_public && Boolean(card.avatar_url)

  return (
    <main className="app-shell">
      <section className="digital-card">
        <div className={`card-visual ${getVariantClassName(settings, visualVariant)}`} style={getVariantStyle(settings, visualVariant)}>
          <div className="card-topline">
            {logoFailed ? <span className="brand-logo-fallback" role="img" aria-label="Invest RS">Invest RS</span> : <img className="public-card-logo" src={logoUrl} alt="Invest RS" onError={() => setFailedLogoUrl(logoUrl)} />}
            {showAvatar ? <div className="public-card-avatar-wrapper"><img className="public-card-avatar" src={card.avatar_url ?? ''} alt={`Foto de ${name}`} /></div> : null}
          </div>

          <div className="card-main">
            <div className="person-block">
              <p className="label">{cardCopy.institutionalContact}</p>
              <h1>{name}</h1>
              {professionalData.jobTitle ? <p className="job-title">{professionalData.jobTitle}</p> : null}
              {professionalData.department ? <p className="department">{professionalData.department}</p> : null}
            </div>
          </div>

          <div className="card-footer">
            <div className="contact-list">
              {phone ? <a href={`tel:${phoneLink}`}><span>{cardCopy.phone}</span>{phone}</a> : null}
              {card.email ? <a href={`mailto:${card.email}`}><span>{cardCopy.email}</span>{card.email}</a> : null}
              {card.website ? <a href={card.website} target="_blank" rel="noreferrer"><span>{cardCopy.website}</span>{card.website.replace(/^https?:\/\//, '')}</a> : null}
              {address ? <p><span>{cardCopy.address}</span>{address}</p> : null}
            </div>
            {qrDataUrl ? <img className="qr-code" src={qrDataUrl} alt={`QR Code de ${name}`} /> : null}
          </div>
        </div>

        <div className={`action-panel ${actionPanelTheme}`}>
          <div className="public-language-toggle" aria-label="Idioma do cartão">
            {(Object.keys(publicCardLanguageLabels) as PublicCardLanguage[]).map((item) => <button key={item} type="button" className={language === item ? 'active' : ''} aria-pressed={language === item} onClick={() => changeLanguage(item)}>{publicCardLanguageLabels[item]}</button>)}
          </div>
          <p className="eyebrow">{interfaceCopy.quickActions}</p>
          <h2>{interfaceCopy.actionTitle}</h2>

          <div className="button-grid">
            <button className="primary-button" type="button" onClick={handleDownloadVCard}>{interfaceCopy.saveContact}</button>
            {phone ? <a className="secondary-button" href={`tel:${phoneLink}`}>{interfaceCopy.call}</a> : null}
            {card.email ? <a className="secondary-button" href={`mailto:${card.email}`}>{interfaceCopy.email}</a> : null}
            {card.website ? <a className="secondary-button" href={card.website} target="_blank" rel="noreferrer">{interfaceCopy.website}</a> : null}
            <button className="secondary-button" type="button" onClick={() => void handleShareCard()}>{interfaceCopy.share}</button>
          </div>

          <section className="extra-functions" aria-labelledby="extra-functions-title">
            <h3 id="extra-functions-title">{interfaceCopy.otherFeatures}</h3>
            <div className="extra-actions-grid">
              <button className="extra-action-button" type="button" onClick={() => void handleEdit()}><Pencil className="extra-action-icon" aria-hidden="true" /><span className="extra-action-label">{interfaceCopy.edit}</span></button>
              <button className="extra-action-button" type="button" onClick={() => void handleCopyVCard()}><Copy className="extra-action-icon" aria-hidden="true" /><span className="extra-action-label">{interfaceCopy.copyVcard}</span></button>
              <button className="extra-action-button" type="button" onClick={() => void handleDownloadQrCode()}><QrCode className="extra-action-icon" aria-hidden="true" /><span className="extra-action-label">{interfaceCopy.downloadQr}</span></button>
              <button className="extra-action-button" type="button" onClick={handleWallet}><Wallet className="extra-action-icon" aria-hidden="true" /><span className="extra-action-label">{interfaceCopy.wallet}</span></button>
            </div>
          </section>
        </div>
      </section>
      {walletModalOpen ? <WalletSupportModal slug={card.slug} standby={!isWalletPublicEnabled()} onClose={() => setWalletModalOpen(false)} /> : null}
    </main>
  )
}
