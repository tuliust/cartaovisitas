import { Contact, LogOut, Pencil, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { AdminBusinessCard } from '../../lib/adminCards'

type Props = {
  card: AdminBusinessCard | null
  onLogout?: () => void
}

export default function CollaboratorAccountMenu({ card, onLogout }: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const pagePath = card?.slug ? `/${card.slug}` : '/meu-cartao/editar'
  const displayName = card?.display_name || card?.full_name || 'Minha conta'
  const initials = displayName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()

  useEffect(() => {
    if (!open) return
    function close(event: MouseEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false)
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return <div className="collaborator-account-menu" ref={rootRef}>
    <button className="collaborator-account-trigger" type="button" aria-label={`Abrir menu de ${displayName}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
      {card?.avatar_url ? <img src={card.avatar_url} alt="" /> : initials ? <span aria-hidden="true">{initials}</span> : <UserRound aria-hidden="true" />}
    </button>
    {open ? <div className="collaborator-account-popover" role="menu" aria-label="Menu da conta">
      <strong>{displayName}</strong>
      <Link to={pagePath} role="menuitem" onClick={() => setOpen(false)}><Contact aria-hidden="true" />Minha Página</Link>
      <Link to="/meu-cartao/editar" role="menuitem" onClick={() => setOpen(false)}><Pencil aria-hidden="true" />Editar</Link>
      <button type="button" role="menuitem" onClick={() => { setOpen(false); onLogout?.() }}><LogOut aria-hidden="true" />Sair</button>
    </div> : null}
  </div>
}
