import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { getAppleWalletUrl, isAndroidDevice } from '../lib/wallet'

type WalletSupportModalProps = {
  slug: string
  standby?: boolean
  onClose: () => void
}

export default function WalletSupportModal({
  slug,
  standby = false,
  onClose,
}: WalletSupportModalProps) {
  const android = isAndroidDevice()
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousActiveElement = document.activeElement
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)

      if (previousActiveElement instanceof HTMLElement) {
        previousActiveElement.focus()
      }
    }
  }, [onClose])

  return (
    <div
      className="wallet-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="wallet-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-modal-title"
        aria-describedby="wallet-modal-description"
      >
        <button
          ref={closeButton}
          className="wallet-modal-close"
          type="button"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X aria-hidden="true" />
        </button>

        <div className="wallet-modal-body">
          <p className="eyebrow">Wallet</p>
          <h2 id="wallet-modal-title">
            {standby ? 'Wallet em breve' : 'Adicionar cartão à Wallet'}
          </h2>

          {standby ? (
            <>
              <div className="wallet-option">
                <p id="wallet-modal-description">
                  A integração com Apple Wallet está tecnicamente preparada e será ativada após
                  aprovação institucional da conta Apple Developer.
                </p>
              </div>
              <div className="wallet-option disabled">
                <p>Google Wallet será disponibilizado em uma próxima etapa.</p>
              </div>
            </>
          ) : (
            <>
              <div className="wallet-option">
                <strong>Apple Wallet</strong>
                <p id="wallet-modal-description">
                  {android
                    ? 'Apple Wallet está disponível para iPhone.'
                    : 'Abra esta página no iPhone para adicionar diretamente ao Apple Wallet.'}
                </p>
                {!android ? (
                  <a className="primary-button" href={getAppleWalletUrl(slug)}>
                    Baixar arquivo Apple Wallet
                  </a>
                ) : null}
              </div>
              <div className="wallet-option disabled">
                <strong>Google Wallet</strong>
                <p>Google Wallet será disponibilizado em uma próxima etapa.</p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
