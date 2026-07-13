import { Copy, MoreHorizontal, QrCode, Wallet } from 'lucide-react'
import { useEffect, useId, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import type { CollaboratorAction } from '../../lib/collaboratorCardActions'

type Props = { disabled: boolean; running: CollaboratorAction | null; onCopyVCard: () => Promise<void>; onDownloadQr: () => Promise<void>; onWallet: () => Promise<void> }

export default function CollaboratorMoreMenu({ disabled, running, onCopyVCard, onDownloadQr, onWallet }: Props) {
  const [open, setOpen] = useState(false)
  const [upward, setUpward] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  function close(restore = true) { setOpen(false); setUpward(false); if (restore) window.requestAnimationFrame(() => triggerRef.current?.focus()) }
  function toggle(event: ReactMouseEvent<HTMLButtonElement>) { if (open) return close(); const rect = event.currentTarget.getBoundingClientRect(); setUpward(window.innerHeight - rect.bottom < 190 && rect.top > window.innerHeight - rect.bottom); setOpen(true) }
  useEffect(() => {
    if (!open) return
    const outside = (event: MouseEvent) => { if (!rootRef.current?.contains(event.target as Node)) close() }
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') close() }
    const viewport = () => close()
    document.addEventListener('mousedown', outside); document.addEventListener('keydown', escape); window.addEventListener('scroll', viewport, true); window.addEventListener('resize', viewport)
    return () => { document.removeEventListener('mousedown', outside); document.removeEventListener('keydown', escape); window.removeEventListener('scroll', viewport, true); window.removeEventListener('resize', viewport) }
  }, [open])
  const execute = async (action: () => Promise<void>) => { if (running) return; await action(); close() }
  return <div className={`collaborator-more${upward ? ' opens-upward' : ''}`} ref={rootRef}>
    <button ref={triggerRef} className="collaborator-nav-item" type="button" disabled={disabled} aria-label="Mais ações" title="Mais" aria-haspopup="menu" aria-expanded={open} aria-controls={menuId} onClick={toggle}><MoreHorizontal aria-hidden="true" /><span>Mais</span></button>
    {open ? <div className="collaborator-more-popover" id={menuId} role="menu" aria-label="Mais ações do cartão">
      <button type="button" role="menuitem" disabled={Boolean(running)} onClick={() => void execute(onCopyVCard)}><Copy aria-hidden="true" /><span>{running === 'copy-vcard' ? 'Copiando...' : 'Copiar vCard'}</span></button>
      <button type="button" role="menuitem" disabled={Boolean(running)} onClick={() => void execute(onDownloadQr)}><QrCode aria-hidden="true" /><span>{running === 'qr' ? 'Gerando...' : 'Baixar QR-Code'}</span></button>
      <button type="button" role="menuitem" disabled={Boolean(running)} onClick={() => void execute(onWallet)}><Wallet aria-hidden="true" /><span>{running === 'wallet' ? 'Abrindo...' : 'Adicionar à Wallet'}</span></button>
    </div> : null}
  </div>
}
