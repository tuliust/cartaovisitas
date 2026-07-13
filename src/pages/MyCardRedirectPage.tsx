import { Navigate } from 'react-router-dom'
import { useCollaborator } from '../contexts/CollaboratorContext'

export default function MyCardRedirectPage() {
  const { card } = useCollaborator()
  return <Navigate to={card?.slug ? `/${card.slug}` : '/meu-cartao/editar'} replace />
}
