import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useBrandSettings } from '../../contexts/BrandSettingsContext'
import { useOptionalCollaborator } from '../../contexts/CollaboratorContext'
import { useVisualMode } from '../../contexts/VisualModeContext'
import { getVariantLogo } from '../../lib/cardVisualVariants'
import { isWalletPublicEnabled } from '../../lib/wallet'
import WalletSupportModal from '../WalletSupportModal'
import CollaboratorNavigation from './CollaboratorNavigation'
import { getAuthenticatedLogoDestination } from '../../lib/navigation'

type Props = { title?: string; subtitle?: string; headerContent?: ReactNode; useBackButton?: boolean; children: ReactNode }

export default function CollaboratorLayout({ title, subtitle, headerContent, useBackButton = false, children }: Props) {
  const collaborator = useOptionalCollaborator()
  const { settings } = useBrandSettings()
  const { visualMode } = useVisualMode()
  const actions = collaborator?.actions
  const authenticated = Boolean(collaborator?.authenticated)
  const logoDestination = getAuthenticatedLogoDestination(authenticated, collaborator?.card ?? null)
  return <main className="collaborator-shell">
    <header className="collaborator-topbar">
      <Link className="collaborator-brand" to={logoDestination} aria-label={logoDestination === '/' ? 'Ir para a página inicial' : 'Ir para o meu cartão'}><img className="collaborator-logo" src={getVariantLogo(settings, visualMode)} alt="Invest RS" /></Link>
      <CollaboratorNavigation authenticated={authenticated} isAdmin={Boolean(collaborator?.isAdmin)} card={collaborator?.card ?? null} actions={authenticated ? actions : undefined} onLogout={() => void collaborator?.logout()} useBackButton={useBackButton} />
    </header>
    <section className="collaborator-page">
      {title ? <div className="collaborator-page-header"><div><p className="eyebrow">{authenticated ? 'Área do colaborador' : 'Invest RS'}</p><h1>{title}</h1>{subtitle ? <p>{subtitle}</p> : null}{headerContent}</div></div> : null}
      {children}
    </section>
    {actions?.walletModalOpen && collaborator?.card ? <WalletSupportModal slug={collaborator.card.slug} standby={!isWalletPublicEnabled()} onClose={actions.closeWalletModal} /> : null}
  </main>
}
