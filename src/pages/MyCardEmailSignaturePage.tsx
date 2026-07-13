import { useMemo, useRef, useState } from 'react'
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
  type EmailSignatureLanguage,
  type EmailSignatureOptions,
} from '../lib/emailSignature'

const optionLabels: Record<keyof EmailSignatureOptions, string> = {
  department: 'Área/departamento',
  phone: 'Telefone/WhatsApp',
  email: 'E-mail',
  website: 'Site',
  confidentiality: 'Incluir aviso de confidencialidade e LGPD',
}
const defaultOptions: EmailSignatureOptions = { department: true, phone: true, email: true, website: true, confidentiality: false }

function legacyCopyText(value: string) {
  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  textarea.remove()
  if (!copied) throw new Error('copy failed')
}

export default function MyCardEmailSignaturePage() {
  const { card } = useCollaborator()
  const { settings } = useBrandSettings()
  const toast = useToast()
  const previewRef = useRef<HTMLDivElement>(null)
  const [language, setLanguage] = useState<EmailSignatureLanguage>('pt')
  const [options, setOptions] = useState<EmailSignatureOptions>(defaultOptions)
  const origin = (import.meta.env.VITE_APP_BASE_URL || window.location.origin).replace(/\/$/, '')
  const model = useMemo(
    () => card ? buildEmailSignatureModel(card, settings, language, options, origin) : null,
    [card, language, options, origin, settings],
  )
  const html = useMemo(() => model ? buildEmailSignatureHtml(model) : '', [model])
  const plain = useMemo(() => model ? buildEmailSignaturePlainText(model) : '', [model])

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

  async function copyPlain() {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(plain)
      else legacyCopyText(plain)
      toast.success('Texto da assinatura copiado.')
    } catch {
      toast.error('Não foi possível copiar o texto.')
    }
  }

  return (
    <CollaboratorLayout title="Gerar Rodapé para E-mail" subtitle="Monte uma assinatura institucional compatível com o Gmail.">
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
            <div>
              <h2>Campos opcionais</h2>
              <div className="signature-options">
                {(Object.keys(optionLabels) as Array<keyof EmailSignatureOptions>).map((field) => (
                  <label key={field}>
                    <input
                      type="checkbox"
                      checked={options[field]}
                      onChange={(event) => setOptions((current) => ({ ...current, [field]: event.target.checked }))}
                    />
                    {optionLabels[field]}
                  </label>
                ))}
              </div>
            </div>
            <div className="signature-actions">
              <button className="primary-button" type="button" onClick={() => void copyHtml()}>
                Copiar assinatura para Gmail
              </button>
              <button className="secondary-button" type="button" onClick={() => void copyPlain()}>
                Copiar texto simples
              </button>
              <a className="secondary-button" href="https://mail.google.com/mail/u/0/#settings/general" target="_blank" rel="noreferrer">
                Abrir configurações do Gmail
              </a>
            </div>
            <p className="field-help">
              No Gmail, acesse Configurações → Ver todas as configurações → Geral → Assinatura. Crie uma assinatura e cole o conteúdo copiado.
            </p>
          </section>
          <section className="collaborator-card">
            <h2>Prévia</h2>
            <div className="signature-preview" ref={previewRef}>
              <EmailSignaturePreview model={model} />
            </div>
            <h3>Texto simples</h3>
            <pre className="signature-plain-preview">{plain}</pre>
          </section>
        </div>
      )}
    </CollaboratorLayout>
  )
}
