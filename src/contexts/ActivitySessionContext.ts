import { createContext } from 'react'

export type ActivitySessionContextValue = {
  ensureActiveSession: () => Promise<boolean>
}

export const ActivitySessionContext = createContext<ActivitySessionContextValue | null>(null)
