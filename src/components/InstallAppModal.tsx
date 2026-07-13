import { AppWindow, CheckCircle2, Download, Menu, MonitorDown, Plus, Share2, Smartphone, X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import type { InstallInstructions, InstallPlatform } from '../contexts/InstallAppContext'
import { useInstallApp } from '../hooks/useInstallApp'

const instructionLabels: Record<InstallInstructions, string> = { iphone: 'iPhone', android: 'Android', desktop: 'Computador' }

export default function InstallAppModal() {
  const {
    platform,
    isInstallable,
    selectedInstructions,
    setSelectedInstructions,
    closeInstallModal,
    promptInstall,
  } = useInstallApp()
  const titleId = useId()
  const descriptionId = useId()
  const modalRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousActiveElement = document.activeElement
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeInstallModal()
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
      if (previousActiveElement instanceof HTMLElement) previousActiveElement.focus()
    }
  }, [closeInstallModal])

  const installButtonLabel = platform === 'desktop' ? 'Instalar aplicativo neste computador' : 'Instalar agora'

  return (
    <div
      className="install-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeInstallModal()
      }}
    >
      <section
        ref={modalRef}
        className="install-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <button ref={closeButtonRef} className="install-modal-close" type="button" onClick={closeInstallModal} aria-label="Fechar">
          <X aria-hidden="true" />
        </button>

        <div className="install-modal-header">
          <span className="install-modal-icon" aria-hidden="true"><AppWindow /></span>
          <div>
            <p className="eyebrow">Aplicativo</p>
            <h2 id={titleId}>Instale esta página como app</h2>
            <p id={descriptionId}>Crie um atalho institucional com abertura em tela cheia quando o navegador oferecer suporte.</p>
          </div>
        </div>

        <div className="install-device-tabs" role="tablist" aria-label="Instruções por dispositivo">
          {(Object.keys(instructionLabels) as InstallInstructions[]).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={selectedInstructions === item}
              className={selectedInstructions === item ? 'active' : ''}
              onClick={() => setSelectedInstructions(item)}
            >
              {instructionLabels[item]}
            </button>
          ))}
        </div>

        <div className="install-modal-content">
          <InstallIllustration type={selectedInstructions} />
          <div className="install-steps">
            {selectedInstructions === 'iphone' ? <IphoneInstructions platform={platform} /> : null}
            {selectedInstructions === 'android' ? <AndroidInstructions isInstallable={isInstallable} /> : null}
            {selectedInstructions === 'desktop' ? <DesktopInstructions isInstallable={isInstallable} /> : null}
          </div>
        </div>

        <div className="install-modal-actions">
          {isInstallable && selectedInstructions !== 'iphone' ? (
            <button className="primary-button" type="button" onClick={() => void promptInstall()}>
              <Download aria-hidden="true" />
              {installButtonLabel}
            </button>
          ) : null}
          {platform === 'ios' ? (
            <button className="secondary-button" type="button" onClick={() => void navigator.clipboard?.writeText(window.location.href)}>
              Copiar URL
            </button>
          ) : null}
          <button className="secondary-button" type="button" onClick={closeInstallModal}>Fechar</button>
        </div>
      </section>
    </div>
  )
}

function InstallIllustration({ type }: { type: InstallInstructions }) {
  const Icon = type === 'desktop' ? MonitorDown : Smartphone
  return (
    <div className={`install-illustration install-illustration-${type}`} aria-hidden="true">
      <div className="install-device-frame">
        <Icon />
        <span />
      </div>
      <div className="install-illustration-actions">
        <Share2 />
        <Plus />
        <CheckCircle2 />
      </div>
    </div>
  )
}

function IphoneInstructions({ platform }: { platform: InstallPlatform }) {
  return (
    <>
      {platform === 'ios' ? null : <p className="install-note">No iPhone ou iPad, a instalação deve ser feita pelo Safari.</p>}
      <ol>
        <li>Abra esta página no Safari.</li>
        <li>Toque no botão Compartilhar.</li>
        <li>Selecione “Adicionar à Tela de Início”.</li>
        <li>Ative “Abrir como App Web”, quando a opção estiver disponível.</li>
        <li>Toque em “Adicionar”.</li>
      </ol>
    </>
  )
}

function AndroidInstructions({ isInstallable }: { isInstallable: boolean }) {
  if (isInstallable) {
    return <p>Este navegador permite instalar o aplicativo agora. Revise as informações e toque em “Instalar agora”.</p>
  }
  return (
    <>
      <p className="install-note">O nome da opção pode variar conforme navegador e versão.</p>
      <ol>
        <li>Abra o menu do navegador.</li>
        <li>Selecione “Instalar aplicativo” ou “Adicionar à tela inicial”.</li>
        <li>Confirme a instalação.</li>
      </ol>
    </>
  )
}

function DesktopInstructions({ isInstallable }: { isInstallable: boolean }) {
  if (isInstallable) {
    return <p>Este navegador permite instalar o aplicativo neste computador. Use o botão abaixo para abrir o diálogo nativo.</p>
  }
  return (
    <>
      <p>A instalação está disponível principalmente em navegadores compatíveis. Se a opção não aparecer, use as instruções do navegador ou instale pelo celular.</p>
      <ol>
        <li>Abra o menu do navegador.</li>
        <li>Procure por “Instalar aplicativo” ou “Adicionar à tela inicial”.</li>
        <li>Confirme a instalação quando a opção estiver disponível.</li>
      </ol>
      <p className="install-menu-hint"><Menu aria-hidden="true" /> O local do menu varia conforme o navegador.</p>
    </>
  )
}
