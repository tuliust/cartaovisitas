import { useMemo, useRef, useState } from 'react'
import CollaboratorLayout from '../components/collaborator/CollaboratorLayout'
import { useBrandSettings } from '../contexts/BrandSettingsContext'
import { useCollaborator } from '../contexts/CollaboratorContext'
import { useToast } from '../contexts/ToastContext'
import type { AdminBusinessCard } from '../lib/adminCards'
import type { BrandSettings } from '../lib/brandSettings'

type OptionalField = 'department' | 'phone' | 'email' | 'website' | 'linkedin' | 'page'
const labels: Record<OptionalField, string> = { department: 'Departamento', phone: 'Telefone', email: 'E-mail', website: 'Site', linkedin: 'LinkedIn', page: 'Minha Página' }
function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character) }
function legacyCopyText(value: string) { const textarea = document.createElement('textarea'); textarea.value = value; textarea.style.position = 'fixed'; textarea.style.opacity = '0'; document.body.appendChild(textarea); textarea.select(); const copied = document.execCommand('copy'); textarea.remove(); if (!copied) throw new Error('copy failed') }

export default function MyCardEmailSignaturePage() {
  const { card } = useCollaborator()
  const { settings } = useBrandSettings()
  const toast = useToast()
  return <CollaboratorLayout title="Gerar Rodapé para E-mail" subtitle="Monte uma assinatura institucional compatível com o Gmail.">{card ? <EmailSignatureBuilder card={card} settings={settings} toast={toast} /> : <p className="state-card">Salve seu cartão antes de gerar a assinatura.</p>}</CollaboratorLayout>
}

function EmailSignatureBuilder({ card, settings, toast }: { card: AdminBusinessCard; settings: BrandSettings; toast: ReturnType<typeof useToast> }) {
  const previewRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState<Record<OptionalField, boolean>>({ department: true, phone: true, email: true, website: true, linkedin: true, page: true })

  const phone = card.mobile_phone || card.work_phone || ''
  const logo = settings.logo_on_light_url || settings.logo_on_dark_url || settings.logo_url
  const pageUrl = `${window.location.origin}/${card.slug}`
  const rows = useMemo(() => [
    enabled.department && card.department ? card.department : '', enabled.phone && phone ? phone : '', enabled.email && card.email ? card.email : '',
    enabled.website && card.website ? card.website : '', enabled.linkedin && card.linkedin_url ? card.linkedin_url : '', enabled.page ? pageUrl : '',
  ].filter(Boolean), [card, enabled, pageUrl, phone])
  const html = useMemo(() => `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;color:#111111"><tr><td style="padding:0 18px 0 0;vertical-align:top;border-right:2px solid #111111"><img src="${escapeHtml(logo)}" alt="Invest RS" width="180" style="display:block;width:180px;max-width:180px;height:auto;border:0"></td><td style="padding:0 0 0 18px;vertical-align:top"><strong style="font-size:17px;line-height:1.3">${escapeHtml(card.display_name || card.full_name)}</strong>${card.job_title ? `<div style="font-size:14px;line-height:1.45">${escapeHtml(card.job_title)}</div>` : ''}${rows.map((row) => `<div style="font-size:12px;line-height:1.5;color:#444444">${escapeHtml(row)}</div>`).join('')}</td></tr></table>`, [card, logo, rows])
  const plain = useMemo(() => [card.display_name || card.full_name, card.job_title, ...rows].filter(Boolean).join('\n'), [card, rows])

  async function copyHtml() {
    try {
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([plain], { type: 'text/plain' }) })])
      else if (previewRef.current) { const selection = window.getSelection(); const range = document.createRange(); range.selectNodeContents(previewRef.current); selection?.removeAllRanges(); selection?.addRange(range); if (!document.execCommand('copy')) throw new Error('copy failed'); selection?.removeAllRanges() }
      toast.success('Assinatura copiada com formatação.')
    } catch { toast.error('Não foi possível copiar a assinatura formatada.') }
  }
  async function copyPlain() { try { if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(plain); else legacyCopyText(plain); toast.success('Texto da assinatura copiado.') } catch { toast.error('Não foi possível copiar o texto.') } }

  return <div className="signature-layout">
      <section className="collaborator-card signature-controls"><h2>Campos opcionais</h2><div className="signature-options">{(Object.keys(labels) as OptionalField[]).map((field) => <label key={field}><input type="checkbox" checked={enabled[field]} onChange={(event) => setEnabled((current) => ({ ...current, [field]: event.target.checked }))} />{labels[field]}</label>)}</div><div className="signature-actions"><button className="primary-button" type="button" onClick={() => void copyHtml()}>Copiar assinatura para Gmail</button><button className="secondary-button" type="button" onClick={() => void copyPlain()}>Copiar texto simples</button><a className="secondary-button" href="https://mail.google.com/mail/u/0/#settings/general" target="_blank" rel="noreferrer">Abrir configurações do Gmail</a></div><p className="field-help">No Gmail, acesse Configurações → Ver todas as configurações → Geral → Assinatura. Crie uma assinatura e cole o conteúdo copiado.</p></section>
      <section className="collaborator-card"><h2>Prévia</h2><div className="signature-preview" ref={previewRef}><table role="presentation" cellPadding="0" cellSpacing="0"><tbody><tr><td className="signature-logo-cell"><img src={logo} alt="Invest RS" width="180" /></td><td className="signature-data-cell"><strong>{card.display_name || card.full_name}</strong>{card.job_title ? <div>{card.job_title}</div> : null}{rows.map((row) => <div key={row}>{row}</div>)}</td></tr></tbody></table></div><h3>Texto simples</h3><pre className="signature-plain-preview">{plain}</pre></section>
    </div>
}
