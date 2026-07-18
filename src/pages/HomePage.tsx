import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import VisualModeSelector from '../components/VisualModeSelector'
import { useBrandSettings } from '../contexts/BrandSettingsContext'
import { useVisualMode } from '../contexts/VisualModeContext'
import { getVariantLogo } from '../lib/cardVisualVariants'

const DESKTOP_REFERENCE_WIDTH = 920
const DESKTOP_REFERENCE_HEIGHT = 718
const DESKTOP_VIEWPORT_INSET = 28
const DESKTOP_BREAKPOINT = 901

function getDesktopScale() {
  if (typeof window === 'undefined' || window.innerWidth < DESKTOP_BREAKPOINT) return 1

  const availableWidth = Math.max(0, window.innerWidth - DESKTOP_VIEWPORT_INSET)
  const availableHeight = Math.max(0, window.innerHeight - DESKTOP_VIEWPORT_INSET)

  return Math.min(
    availableWidth / DESKTOP_REFERENCE_WIDTH,
    availableHeight / DESKTOP_REFERENCE_HEIGHT,
  )
}

export default function HomePage() {
  const { settings } = useBrandSettings()
  const { visualMode } = useVisualMode()
  const [desktopScale, setDesktopScale] = useState(getDesktopScale)

  useEffect(() => {
    const updateScale = () => setDesktopScale(getDesktopScale())

    updateScale()
    window.addEventListener('resize', updateScale)

    return () => window.removeEventListener('resize', updateScale)
  }, [])

  const viewportStyle = {
    '--home-desktop-scale': desktopScale,
    '--home-desktop-scaled-width': `${DESKTOP_REFERENCE_WIDTH * desktopScale}px`,
    '--home-desktop-scaled-height': `${DESKTOP_REFERENCE_HEIGHT * desktopScale}px`,
  } as CSSProperties

  return (
    <main className="app-shell home-page-shell">
      <div className="home-desktop-viewport" style={viewportStyle}>
        <div className="home-desktop-stage">
          <section className="home-panel">
            <div className="home-topline">
              <img
                className="brand-logo-main"
                src={getVariantLogo(settings, visualMode)}
                alt="Invest RS"
              />
              <div className="home-visual-selector-desktop">
                <VisualModeSelector />
              </div>
              <div className="home-visual-selector-mobile">
                <VisualModeSelector variant="compact" />
              </div>
            </div>

            <div className="home-content">
              <p className="eyebrow">Cartão de visitas digital</p>
              <h1>Cartões digitais com QR Code.</h1>
              <p className="home-description">
                Sistema para criar cartões institucionais da Invest RS, gerar QR Codes e permitir
                que contatos sejam salvos diretamente no celular.
              </p>

              <div className="home-actions">
                <Link className="primary-button" to="/entrar">
                  Acessar meu cartão
                </Link>
                <Link className="secondary-button" to="/cadastro">
                  Cadastro
                </Link>
                <Link className="auxiliary-button" to="/admin/login">
                  Área Restrita
                </Link>
              </div>
            </div>
          </section>
          <div className="home-secondary-actions" aria-label="Links de apoio">
            <Link className="auxiliary-button" to="/guia-de-utilizacao">Guia de Uso</Link>
            <Link className="auxiliary-button" to="/termos-de-uso-e-privacidade">
              <span className="home-support-label-desktop">Termos de Uso e Privacidade</span>
              <span className="home-support-label-mobile">Termos e Privacidade</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
