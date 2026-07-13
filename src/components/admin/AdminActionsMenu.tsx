import { MoreVertical, type LucideIcon } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

export type AdminActionItem = { label: string; icon: LucideIcon; onSelect: () => void }
type AdminActionsMenuProps = { label: string; items: AdminActionItem[] }

export function AdminActionsMenu({ label, items }: AdminActionsMenuProps) {
  const [open, setOpen] = useState(false)
  const [upward, setUpward] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  function close(restore = true) { setOpen(false); setUpward(false); if (restore) window.requestAnimationFrame(() => triggerRef.current?.focus()) }
  function toggle() {
    if (open) return close()
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) setUpward(window.innerHeight - rect.bottom < Math.min(224, 52 + items.length * 44) && rect.top > window.innerHeight - rect.bottom)
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const outside = (event: MouseEvent) => { if (!rootRef.current?.contains(event.target as Node)) close() }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') close() }
    const viewport = () => close()
    document.addEventListener('mousedown', outside); document.addEventListener('keydown', escape); window.addEventListener('scroll', viewport, true); window.addEventListener('resize', viewport)
    return () => { document.removeEventListener('mousedown', outside); document.removeEventListener('keydown', escape); window.removeEventListener('scroll', viewport, true); window.removeEventListener('resize', viewport) }
  }, [open])

  return <div className={`admin-actions-menu-root${open ? ' is-open' : ''}${upward ? ' opens-upward' : ''}`} ref={rootRef}>
    <button ref={triggerRef} className="admin-actions-trigger" type="button" aria-label={label} title="Ações" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} onClick={toggle}><MoreVertical aria-hidden="true" /></button>
    {open ? <div className="admin-actions-popover" id={menuId} role="menu" aria-label={label}>{items.map((item) => { const Icon = item.icon; return <button type="button" role="menuitem" key={item.label} onClick={() => { item.onSelect(); close() }}><Icon aria-hidden="true" /><span>{item.label}</span></button> })}</div> : null}
  </div>
}
