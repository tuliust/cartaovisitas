import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './logo-alignment.css'
import './contact-card-overrides.css'
import './notebook-responsive.css'
import './home-notebook-overrides.css'
import './home-desktop-scale.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
