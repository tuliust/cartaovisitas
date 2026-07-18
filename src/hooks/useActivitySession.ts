import { useContext } from 'react'
import { ActivitySessionContext } from '../contexts/ActivitySessionContext'

export function useActivitySession() {
  const context = useContext(ActivitySessionContext)
  if (!context) throw new Error('useActivitySession deve ser usado dentro de ActivitySessionProvider.')
  return context
}
