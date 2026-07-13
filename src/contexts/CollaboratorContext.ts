import { createContext, useContext } from 'react'
import type { AdminBusinessCard } from '../lib/adminCards'
import type { CollaboratorCardActions } from '../lib/collaboratorCardActions'

export type CollaboratorContextValue = {
  card: AdminBusinessCard | null
  loading: boolean
  authenticated: boolean
  actions: CollaboratorCardActions
  refreshCard: () => Promise<AdminBusinessCard | null>
  logout: () => Promise<void>
}

export const CollaboratorContext = createContext<CollaboratorContextValue | null>(null)

export function useCollaborator() {
  const context = useContext(CollaboratorContext)
  if (!context) throw new Error('useCollaborator deve ser usado dentro de CollaboratorProvider.')
  return context
}

export function useOptionalCollaborator() {
  return useContext(CollaboratorContext)
}
