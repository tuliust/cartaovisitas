import { createContext, useContext } from 'react'

export type ToastKind = 'success' | 'error' | 'info'
export type ToastApi = Record<ToastKind, (message: string) => void>

export const ToastContext = createContext<ToastApi | null>(null)

export function useToast() {
  const toast = useContext(ToastContext)
  if (!toast) throw new Error('useToast deve ser usado dentro de ToastProvider.')
  return toast
}
