import { Link } from 'react-router-dom'
export default function HomePage() {
  return <main className="app-shell"><section className="home-panel"><img className="home-logo" src="/invest-rs-logo.png" alt="Invest RS" /><div className="home-content"><p className="eyebrow">Cartão de visitas digital</p><h1>Cartões digitais com QR Code.</h1><p className="home-description">Sistema para criar cartões institucionais da Invest RS, gerar QR Codes e permitir que contatos sejam salvos diretamente no celular.</p><div className="home-actions"><Link className="primary-button" to="/entrar">Acessar meu cartão</Link><Link className="secondary-button" to="/cadastro">Cadastro</Link><Link className="secondary-button" to="/admin/login">Área Restrita</Link></div></div></section></main>
}
