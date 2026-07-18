import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { EmailSignaturePreview } from '../components/EmailSignaturePreview'
import CollaboratorLayout from '../components/collaborator/CollaboratorLayout'
import { useBrandSettings } from '../contexts/BrandSettingsContext'
import { useCollaborator } from '../contexts/CollaboratorContext'
import { useToast } from '../contexts/ToastContext'
import {
  buildEmailSignatureHtml,
  buildEmailSignatureModel,
  buildEmailSignaturePlainText,
  emailSignatureLanguageLabels,
  requiredEmailSignatureOptions,
  type EmailSignatureLanguage,
} from '../lib/emailSignature'

const SIGNATURE_PREVIEW_WIDTH = 580
const GMAIL_SETTINGS_URL = 'https://mail.google.com/mail/u/0/#settings/general'

export default function MyCardEmailSignaturePage() {
  const { card } = useCollaborator()
  const { settings } = useBrandSettings()
  const toast = useToast()
  const previewRef = useRef<HTMLDivElement>(null)
  const previewViewportRef = useRef<HTMLDivElement>(null)
  const previewStageRef = useRef<HTMLDivElement>(null)
  const [language, setLanguage] = useState<EmailSignatureLanguage>('pt')
  const [previewScale, setPreviewScale] = useState(1)
  const [previewHeight, setPreviewHeight] = useState<number | null>(null)
  const origin = (import.meta.env.VITE_APP_BASE_URL || window.location.origin).replace(/\/$/, '')
  const model = useMemo(
    () => card ? buildEmailSignatureModel(card, settings, language, requiredEmailSignatureOptions, origin) : null,
    [card, language, origin, settings],
  )
  const html = useMemo(() => model ? buildEmailSignatureHtml(model) : '', [model])
  const plain = useMemo(() => model ? buildEmailSignaturePlainText(model) : '', [model])

  useEffect(() => {
    const viewport = previewViewportRef.current
    const stage = previewStageRef.current
    if (!viewport || !stage) return

    const updatePreviewScale = () => {
      const mobile = window.matchMedia('(max-width: 900px)').matches
      if (!mobile) {
        setPreviewScale(1)
        setPreviewHeight(null)
        return
      }

      const styles = window.getComputedStyle(viewport)
      const horizontalPadding = Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight)
      const verticalPadding = Number.parseFloat(styles.paddingTop) + Number.parseFloat(styles.paddingBottom)
      const availableWidth = Math.max(1, viewport.clientWidth - horizontalPadding)
      const nextScale = Math.min(1, availableWidth / SIGNATURE_PREVIEW_WIDTH)
      const nextHeight = Math.ceil(stage.scrollHeight * nextScale + verticalPadding)
      setPreviewScale(nextScale)
      setPreviewHeight(nextHeight)
    }

    const frame = window.requestAnimationFrame(updatePreviewScale)
    const observer = new ResizeObserver(updatePreviewScale)
    observer.observe(viewport)
    observer.observe(stage)
    window.addEventListener('resize', updatePreviewScale)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', updatePreviewScale)
    }
  }, [model])

  async function copyHtml() {
    try {
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/plain': new Blob([plain], { type: 'text/plain' }),
          }),
        ])
      } else if (previewRef.current) {
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(previewRef.current)
        selection?.removeAllRanges()
        selection?.addRange(range)
        if (!document.execCommand('copy')) throw new Error('copy failed')
        selection?.removeAllRanges()
      }
      toast.success('Assinatura copiada com formatação.')
    } catch {
      toast.error('Não foi possível copiar a assinatura formatada.')
    }
  }

  function openGmailSettings() {
    const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    if (!mobile) {
      window.open(GMAIL_SETTINGS_URL, '_blank', 'noopener,noreferrer')
      return
    }

    window.location.href = 'googlegmail://'
    window.setTimeout(() => {
      if (document.visibilityState === 'visible') window.location.href = GMAIL_SETTINGS_URL
    }, 1000)
  }

  const viewportStyle = previewHeight ? { height: `${previewHeight}px` } : undefined
  const stageStyle = { transform: `scale(${previewScale})` } as CSSProperties

  return (
    <CollaboratorLayout title="Gerar Rodapé para E-mail">
      {!card || !model ? (
        <p className="state-card">Salve seu cartão antes de gerar a assinatura.</p>
      ) : (
        <div className="signature-layout">
          <section className="collaborator-card signature-controls">
            <div>
              <h2>Idioma da assinatura</h2>
              <div className="signature-language-toggle" role="group" aria-label="Idioma da assinatura">
                {(Object.keys(emailSignatureLanguageLabels) as EmailSignatureLanguage[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-label={`Usar assinatura em ${emailSignatureLanguageLabels[item]}`}
                    aria-pressed={language === item}
                    className={language === item ? 'active' : ''}
                    onClick={() => setLanguage(item)}
                  >
                    {emailSignatureLanguageLabels[item]}
                  </button>
                ))}
              </div>
            </div>
            <div className="signature-actions">
              <button className="primary-button" type="button" onClick={() => void copyHtml()}>
                Copiar assinatura para Gmail
              </button>
              <button className="secondary-button" type="button" onClick={openGmailSettings}>
                Abrir configurações do Gmail
              </button>
            </div>
            <p className="field-help">
              No aplicativo Gmail, abra Menu → Configurações e localize as opções de assinatura. No computador, acesse Configurações → Ver todas as configurações → Geral → Assinatura.
            </p>
          </section>
          <section className="collaborator-card">
            <h2>Prévia</h2>
            <div className="signature-preview signature-preview-viewport" ref={previewViewportRef} style={viewportStyle}>
              <div className="signature-preview-scale-stage" ref={previewStageRef} style={stageStyle}>
                <div ref={previewRef}>
                  <EmailSignaturePreview model={model} />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </CollaboratorLayout>
  )
}
