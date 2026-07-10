import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { getAppleWalletUrl, isAndroidDevice } from '../lib/wallet'

type WalletSupportModalProps = { slug: string; onClose: () => void }

export default function WalletSupportModal({ slug, onClose }: WalletSupportModalProps) {
  const android = isAndroidDevice()
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()
    function handleKeyDown(event: KeyboardEvent) { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="wallet-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="wallet-modal" role="dialog" aria-modal="true" aria-labelledby="wallet-modal-title">
        <button ref={closeButton} className="wallet-modal-close" type="button" onClick={onClose} aria-label="Fechar"><X aria-hidden="true" /></button>
        <p className="eyebrow">Wallet</p>
        <h2 id="wallet-modal-title">Adicionar cartão à Wallet</h2>
        <div className="wallet-option">
          <strong>Apple Wallet</strong>
          <p>{android ? 'Apple Wallet está disponível para iPhone.' : 'Abra esta página no iPhone para adicionar diretamente ao Apple Wallet.'}</p>
          {!android ? <a className="primary-button" href={getAppleWalletUrl(slug)}>Baixar arquivo Apple Wallet</a> : null}
        </div>
        <div className="wallet-option disabled">
          <strong>Google Wallet</strong>
          <p>Google Wallet será disponibilizado em uma próxima etapa.</p>
        </div>
      </section>
    </div>
  )
}
