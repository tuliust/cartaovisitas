import { Link } from 'react-router-dom'
import VisualModeSelector from '../components/VisualModeSelector'
import { useBrandSettings } from '../contexts/BrandSettingsContext'
import { useVisualMode } from '../contexts/VisualModeContext'
import { getVariantLogo } from '../lib/cardVisualVariants'

export default function HomePage() {
  const { settings } = useBrandSettings()
  const { visualMode } = useVisualMode()

  return (
    <main className="app-shell home-page-shell">
      <section className="home-panel">
        <div className="home-topline">
          <img
            className="brand-logo-main"
            src={getVariantLogo(settings, visualMode)}
            alt="Invest RS"
          />
          <VisualModeSelector />
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
            <Link className="secondary-button" to="/admin/login">
              Área Restrita
            </Link>
          </div>
        </div>
      </section>
      <div className="home-secondary-actions" aria-label="Links de apoio">
        <Link to="/meu-cartao/guia">Guia de Uso</Link>
        <Link to="/termos-de-uso-e-privacidade">Termos de Uso e Privacidade</Link>
      </div>
    </main>
  )
}
