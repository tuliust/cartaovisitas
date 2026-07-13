import { X } from 'lucide-react'
import { useEffect, useId, useRef, type RefObject } from 'react'
import type { CardFormValues } from '../../lib/adminCards'
import CardPreview from './CardPreview'

type CardPreviewModalProps = {
  values: CardFormValues
  onClose: () => void
  returnFocusRef: RefObject<HTMLButtonElement | null>
}

export default function CardPreviewModal({ values, onClose, returnFocusRef }: CardPreviewModalProps) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const returnFocusElement = returnFocusRef.current
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !modalRef.current) return

      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter((element) => !element.hasAttribute('disabled'))
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      returnFocusElement?.focus()
    }
  }, [onClose, returnFocusRef])

  return (
    <div
      className="card-preview-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className="card-preview-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={modalRef}>
        <header className="card-preview-modal-header">
          <h2 id={titleId}>Preview do cartão</h2>
          <button className="card-preview-modal-close" type="button" aria-label="Fechar preview" onClick={onClose} ref={closeRef}>
            <X aria-hidden="true" />
          </button>
        </header>
        <div className="card-preview-modal-body">
          <CardPreview values={values} />
        </div>
      </section>
    </div>
  )
}
