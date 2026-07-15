import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Eye, EyeOff, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { signUpWithPassword } from '../lib/auth'
import { getFriendlyErrorMessage } from '../lib/errors'
import { buildInvestEmail, INVEST_EMAIL_DOMAIN, normalizeInvestEmailInput } from '../lib/investEmail'
import { useBrandSettings } from '../contexts/BrandSettingsContext'
import { useVisualMode } from '../contexts/VisualModeContext'
import { getVariantLogo } from '../lib/cardVisualVariants'
import { useToast } from '../contexts/ToastContext'
import { getManagedPage } from '../lib/managedPages'
import { managedPageDefaults, type ManagedPage } from '../lib/managedPageDefaults'

export default function RegisterPage() {
  const { settings } = useBrandSettings()
  const { visualMode } = useVisualMode()
  const toast = useToast()
  const termsTriggerRef = useRef<HTMLButtonElement>(null)
  const termsAcceptanceRef = useRef<HTMLDivElement>(null)
  const [prefix, setPrefix] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [termsError, setTermsError] = useState('')
  const [termsOpen, setTermsOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (password !== confirm) {
      const validationMessage = 'As senhas não coincidem.'
      toast.error(validationMessage)
      return
    }

    if (password.length < 6) {
      const validationMessage = 'Use uma senha mais segura.'
      toast.error(validationMessage)
      return
    }

    if (!acceptedTerms) {
      const validationMessage = 'Confirme o aceite dos termos de uso para continuar.'
      setTermsError(validationMessage)
      toast.error(validationMessage)
      termsAcceptanceRef.current?.focus()
      return
    }

    setLoading(true)

    try {
      await signUpWithPassword(buildInvestEmail(prefix), password)
      const successMessage = 'Enviamos um e-mail de confirmação. Confirme seu cadastro para continuar.'
      toast.success(successMessage)
    } catch (err) {
      const failureMessage = getFriendlyErrorMessage(err)
      toast.error(failureMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-login-shell auth-page-shell auth-logo-shift-page">
      <section className="admin-login-card auth-page-card">
        <img
          className="auth-logo auth-page-logo"
          src={getVariantLogo(settings, visualMode)}
          alt="Invest RS"
        />

        <h1 className="auth-page-title">Cadastro</h1>
        <form className="auth-page-form" onSubmit={submit}>
          <label>
            E-mail institucional
            <span className="email-suffix-field">
              <input
                required
                id="register-username"
                name="username"
                type="text"
                inputMode="email"
                value={prefix}
                autoComplete="username"
                onChange={(event) => setPrefix(normalizeInvestEmailInput(event.target.value))}
                placeholder="seu.nome"
              />
              <span className="email-suffix-label">{INVEST_EMAIL_DOMAIN}</span>
            </span>
          </label>

          <div className="auth-form-field">
            <label htmlFor="register-password">Senha</label>
            <span className="password-input-field">
              <input
                required
                id="register-password"
                name="password"
                minLength={6}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                className="password-visibility-button"
                type="button"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                aria-pressed={showPassword}
                title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </button>
            </span>
          </div>

          <div className="auth-form-field">
            <label htmlFor="register-password-confirmation">Confirmar senha</label>
            <span className="password-input-field">
              <input
                required
                id="register-password-confirmation"
                name="password-confirmation"
                minLength={6}
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
              />
              <button
                className="password-visibility-button"
                type="button"
                aria-label={showConfirmPassword ? 'Ocultar senha' : 'Exibir senha'}
                aria-pressed={showConfirmPassword}
                title={showConfirmPassword ? 'Ocultar senha' : 'Exibir senha'}
                onClick={() => setShowConfirmPassword((current) => !current)}
              >
                {showConfirmPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </button>
            </span>
          </div>

          <div className={`terms-acceptance${termsError ? ' has-error' : ''}`} ref={termsAcceptanceRef} tabIndex={-1}>
            <label>
              <input
                type="checkbox"
                checked={acceptedTerms}
                aria-describedby={termsError ? 'terms-acceptance-error' : undefined}
                onChange={(event) => {
                  setAcceptedTerms(event.target.checked)
                  if (event.target.checked) setTermsError('')
                }}
              />
              <span>
                Confirmo que aceito os{' '}
                <button
                  ref={termsTriggerRef}
                  className="terms-inline-link"
                  type="button"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    setTermsOpen(true)
                  }}
                >
                  termos de uso
                </button>
              </span>
            </label>
            {termsError ? <p id="terms-acceptance-error" className="auth-inline-error" role="alert">{termsError}</p> : null}
          </div>

          <button className="primary-button auth-page-submit" disabled={loading}>
            {loading ? 'Criando...' : 'Criar cadastro'}
          </button>
        </form>

        <div className="auth-links auth-page-links">
          <Link to="/">Voltar</Link>
        </div>
      </section>
      {termsOpen ? <TermsModal onClose={() => setTermsOpen(false)} returnFocusRef={termsTriggerRef} /> : null}
    </main>
  )
}

function TermsModal({ onClose, returnFocusRef }: { onClose: () => void; returnFocusRef: React.RefObject<HTMLButtonElement | null> }) {
  const titleId = useId()
  const descriptionId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLElement>(null)
  const [page, setPage] = useState<ManagedPage>(() => managedPageDefaults.terms_and_privacy)

  useEffect(() => {
    let mounted = true
    void getManagedPage('terms_and_privacy').then((loaded) => { if (mounted) setPage(loaded) })
    return () => { mounted = false }
  }, [])

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
      className="terms-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className="terms-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} ref={modalRef}>
        <button className="terms-modal-close" type="button" aria-label="Fechar" onClick={onClose} ref={closeRef}><X aria-hidden="true" /></button>
        <header className="terms-modal-header">
          <p className="eyebrow">Termos</p>
          <h2 id={titleId}>{page.title}</h2>
          {page.subtitle ? <p id={descriptionId}>{page.subtitle}</p> : <p id={descriptionId}>Leia os termos antes de concluir seu cadastro.</p>}
        </header>
        <div className="terms-modal-content">
          {page.content.notice ? <aside role="note"><strong>{page.content.notice.title}</strong><p>{page.content.notice.body}</p></aside> : null}
          {page.content.sections.map((section) => <section id={`modal-${section.id}`} key={section.id}><h3>{section.title}</h3><p>{section.body}</p></section>)}
          {page.version_label ? <footer><h3>Data e versão do documento</h3><p>{page.version_label}</p></footer> : null}
        </div>
      </section>
    </div>
  )
}
