import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <main className="app-shell">
      <section className="home-panel">
        <div className="brand-mark">Invest RS</div>

        <div className="home-content">
          <p className="eyebrow">Cartão de visitas digital</p>
          <h1>Cartões digitais com QR Code dinâmico e vCard.</h1>
          <p className="home-description">
            Sistema para criar cartões institucionais da Invest RS, gerar QR Codes e permitir
            que contatos sejam salvos diretamente no celular.
          </p>

          <div className="home-actions">
            <Link className="primary-button" to="/alexandre-elmi">
              Ver exemplo
            </Link>
            <a className="secondary-button" href="https://investrs.org.br" target="_blank">
              Site Invest RS
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
