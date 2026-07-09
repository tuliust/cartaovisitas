import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { Link, useParams } from 'react-router-dom'
import { getPublicCardBySlug, recordCardEvent, type BusinessCard } from '../lib/cards'
import { buildVCardFileName, generateVCard } from '../lib/vcard'

type PageStatus = 'loading' | 'ready' | 'not-found' | 'error'

function normalizePhoneForLink(phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

function buildAddress(card: BusinessCard) {
  return [card.address_line, card.city, card.state, card.country].filter(Boolean).join(', ')
}

function getBaseUrl() {
  const envBaseUrl = import.meta.env.VITE_APP_BASE_URL

  if (envBaseUrl) {
    return envBaseUrl.replace(/\/$/, '')
  }

  return window.location.origin
}

export default function PublicCardPage() {
  const { slug } = useParams()
  const [card, setCard] = useState<BusinessCard | null>(null)
  const [status, setStatus] = useState<PageStatus>('loading')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [shareLabel, setShareLabel] = useState('Compartilhar cartão')
  const [logoFailed, setLogoFailed] = useState(false)

  const vcardUrl = useMemo(() => {
    if (!slug) {
      return ''
    }

    return `${getBaseUrl()}/api/vcard/${slug}`
  }, [slug])

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

        if (!isMounted) {
          return
        }

        if (!result) {
          setStatus('not-found')
          return
        }

        setCard(result)
        setStatus('ready')
        void recordCardEvent(result.id, 'view')
      } catch (error) {
        console.error(error)

        if (isMounted) {
          setStatus('error')
        }
      }
    }

    void loadCard()

    return () => {
      isMounted = false
    }
  }, [slug])

  useEffect(() => {
    setLogoFailed(false)
  }, [card?.logo_url])

  useEffect(() => {
    if (!vcardUrl || status !== 'ready') {
      return
    }

    QRCode.toDataURL(vcardUrl, {
      width: 360,
      margin: 1,
      errorCorrectionLevel: 'M',
    })
      .then(setQrDataUrl)
      .catch((error: unknown) => {
        console.error('Erro ao gerar QR Code:', error)
      })
  }, [vcardUrl, status])

  function handleDownloadVCard() {
    if (!card) {
      return
    }

    const vcard = generateVCard(card)
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')

    anchor.href = url
    anchor.download = buildVCardFileName(card)
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()

    URL.revokeObjectURL(url)
    void recordCardEvent(card.id, 'vcard')
  }

  async function handleShareCard() {
    if (!card) {
      return
    }

    const cardUrl = `${window.location.origin}/${card.slug}`
    const title = `${card.display_name || card.full_name} | ${card.company || 'Invest RS'}`

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `Cartão digital de ${card.display_name || card.full_name}`,
          url: cardUrl,
        })
      } else {
        await navigator.clipboard.writeText(cardUrl)
        setShareLabel('Link copiado')
        window.setTimeout(() => setShareLabel('Compartilhar cartão'), 2200)
      }
    } catch (error) {
      console.warn('Compartilhamento cancelado ou indisponível:', error)
    }
  }

  if (status === 'loading') {
    return (
      <main className="app-shell">
        <section className="state-card">Carregando cartão...</section>
      </main>
    )
  }

  if (status === 'not-found') {
    return (
      <main className="app-shell">
        <section className="state-card">
          <h1>Cartão não encontrado</h1>
          <p>Verifique se o link está correto ou se o cartão ainda está ativo.</p>
          <Link to="/">Voltar</Link>
        </section>
      </main>
    )
  }

  if (status === 'error' || !card) {
    return (
      <main className="app-shell">
        <section className="state-card">
          <h1>Erro ao carregar</h1>
          <p>Confira as variáveis do Supabase no arquivo .env.local.</p>
        </section>
      </main>
    )
  }

  const name = card.display_name || card.full_name
  const phone = card.mobile_phone || card.work_phone
  const phoneLink = phone ? normalizePhoneForLink(phone) : ''
  const address = buildAddress(card)
  const logoUrl = card.logo_url || '/invest-rs-logo.png'

  return (
    <main className="app-shell">
      <section className="digital-card">
        <div className="card-visual">
          <div className="card-topline">
            {logoFailed ? (
              <span className="brand-logo-fallback" role="img" aria-label="Invest RS">
                Invest RS
              </span>
            ) : (
              <img className="brand-logo" src={logoUrl} alt="Invest RS" onError={() => setLogoFailed(true)} />
            )}
            <span className="brand-subtitle">Business Card</span>
          </div>

          <div className="card-main">
            <div className="person-block">
              <p className="label">Contato institucional</p>
              <h1>{name}</h1>

              {card.job_title && <p className="job-title">{card.job_title}</p>}
              {card.department && <p className="department">{card.department}</p>}
            </div>
          </div>

          <div className="card-footer">
            <div className="contact-list">
              {phone && (
                <a href={`tel:${phoneLink}`}>
                  <span>Telefone</span>
                  {phone}
                </a>
              )}

              {card.email && (
                <a href={`mailto:${card.email}`}>
                  <span>E-mail</span>
                  {card.email}
                </a>
              )}

              {card.website && (
                <a href={card.website} target="_blank">
                  <span>Site</span>
                  {card.website.replace(/^https?:\/\//, '')}
                </a>
              )}

              {address && (
                <p>
                  <span>Endereço</span>
                  {address}
                </p>
              )}
            </div>

            {qrDataUrl && <img className="qr-code" src={qrDataUrl} alt={`QR Code de ${name}`} />}
          </div>
        </div>

        <div className="action-panel">
          <p className="eyebrow">Ações rápidas</p>
          <h2>Salve ou compartilhe este contato.</h2>

          <div className="button-grid">
            <button className="primary-button" type="button" onClick={handleDownloadVCard}>
              Salvar contato
            </button>

            {phone && (
              <a className="secondary-button" href={`tel:${phoneLink}`}>
                Ligar
              </a>
            )}

            {card.email && (
              <a className="secondary-button" href={`mailto:${card.email}`}>
                E-mail
              </a>
            )}

            {card.website && (
              <a className="secondary-button" href={card.website} target="_blank">
                Site
              </a>
            )}

            <button className="secondary-button" type="button" onClick={handleShareCard}>
              {shareLabel}
            </button>
          </div>

          <div className="technical-note">
            <strong>QR Code dinâmico</strong>
            <p>
              O QR Code aponta para o vCard dinâmico. Quando o projeto estiver publicado na Vercel, o scan abrirá a
              tela de criação de contato no celular.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
