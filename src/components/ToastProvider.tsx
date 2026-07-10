import { X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ToastContext, type ToastKind } from '../contexts/ToastContext'

type ToastItem = { id: number; kind: ToastKind; message: string }

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const nextId = useRef(0)
  const timers = useRef(new Set<number>())

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current.clear()
  }, [])

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }, [])

  const show = useCallback((kind: ToastKind, message: string) => {
    const id = ++nextId.current
    setItems((current) => [...current, { id, kind, message }])
    const timer = window.setTimeout(() => {
      timers.current.delete(timer)
      dismiss(id)
    }, kind === 'error' ? 6000 : 4200)
    timers.current.add(timer)
  }, [dismiss])

  const value = useMemo(() => ({
    success: (message: string) => show('success', message),
    error: (message: string) => show('error', message),
    info: (message: string) => show('info', message),
  }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-relevant="additions">
        {items.map((item) => (
          <div className={`toast ${item.kind}`} key={item.id} role={item.kind === 'error' ? 'alert' : 'status'}>
            <span>{item.message}</span>
            <button className="toast-close" type="button" onClick={() => dismiss(item.id)} aria-label="Fechar notificação"><X aria-hidden="true" /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
