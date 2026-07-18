import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './logo-alignment.css'
import './contact-card-overrides.css'
import './notebook-responsive.css'
import './home-notebook-overrides.css'
import './home-desktop-scale.css'
import './public-card-notebook-overrides.css'
import './public-card-desktop-scale.css'
import './register-desktop-overrides.css'
import './auth-desktop-standard.css'
import './desktop-visual-contract.css'
import './guide-desktop-overrides.css'
import './auth-autofill-overrides.css'
import './public-card-share-popover.css'
import './public-card-actions-overrides.css'
import './admin-desktop-scale.css'
import './unified-site-header.css'
import './brand-token-contract.css'
import './brand-token-specificity.css'
import './brand-token-coverage.css'
import './brand-token-auth.css'
import './admin-brand-settings-preview.css'
import './mobile-experience-overrides.css'
import './mobile-experience-followup.css'
import './mobile-experience-polish.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
