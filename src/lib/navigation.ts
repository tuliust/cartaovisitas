import type { AdminBusinessCard } from './adminCards'

export function getAuthenticatedLogoDestination(authenticated: boolean, card: AdminBusinessCard | null) {
  return authenticated && card?.slug ? `/${card.slug}` : '/'
}
