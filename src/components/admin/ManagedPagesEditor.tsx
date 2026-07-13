import { useEffect, useState } from 'react'
import { useToast } from '../../contexts/ToastContext'
import { recordAuditLog } from '../../lib/audit'
import { getFriendlyErrorMessage } from '../../lib/errors'
import { getManagedPagesForAdmin, saveManagedPage } from '../../lib/managedPages'
import { managedPageDefaults, normalizeSectionId, type ManagedPage, type ManagedPageKey } from '../../lib/managedPageDefaults'

const labels: Record<ManagedPageKey, string> = { terms_and_privacy: 'Termos e Privacidade', usage_guide: 'Guia de Utilização' }

export function ManagedPagesEditor() {
  const toast = useToast()
  const [pages, setPages] = useState<ManagedPage[]>([])
  const [savedPages, setSavedPages] = useState<ManagedPage[]>([])
  const [active, setActive] = useState<ManagedPageKey>('terms_and_privacy')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [restored, setRestored] = useState<ManagedPageKey | null>(null)
  const page = pages.find(({ page_key }) => page_key === active)

  useEffect(() => { let mounted = true; void getManagedPagesForAdmin().then((items) => { if (mounted) { setPages(items); setSavedPages(items) } }).catch((reason) => { if (mounted) setError(getFriendlyErrorMessage(reason)) }); return () => { mounted = false } }, [])
  function update(next: ManagedPage) { setPages((current) => current.map((item) => item.page_key === next.page_key ? next : item)) }

  async function save() {
    if (!page) return
    const ids = page.content.sections.map(({ id }) => normalizeSectionId(id))
    if (!page.title.trim() || page.content.sections.some(({ title, body }) => !title.trim() || !body.trim()) || ids.some((id) => !id) || new Set(ids).size !== ids.length) { setError('Preencha títulos, corpos e IDs únicos para todas as seções.'); return }
    const normalized = { ...page, content: { ...page.content, sections: page.content.sections.map((section, index) => ({ ...section, id: ids[index] })) } }
    setSaving(true); setError('')
    try {
      const before = savedPages.find((item) => item.page_key === page.page_key) ?? null
      const saved = await saveManagedPage(normalized)
      const action = restored === page.page_key ? 'managed_page_restored' : before && before.is_published !== saved.is_published ? (saved.is_published ? 'managed_page_published' : 'managed_page_unpublished') : 'managed_page_updated'
      await recordAuditLog({ action, targetType: 'managed_page', targetId: saved.id, targetLabel: saved.title || saved.page_key, beforeData: before, afterData: saved, metadata: { changed_fields: ['title', 'subtitle', 'content', 'version_label', 'is_published'] } })
      update(saved); setSavedPages((current) => current.map((item) => item.page_key === saved.page_key ? saved : item)); setRestored(null); toast.success('Conteúdo salvo com sucesso.')
    } catch (reason) { const message = getFriendlyErrorMessage(reason); setError(message); toast.error(message) } finally { setSaving(false) }
  }

  function restore() {
    if (!page || !window.confirm('Restaurar o conteúdo padrão desta página?')) return
    const restored = { ...managedPageDefaults[page.page_key], id: page.id, created_at: page.created_at, updated_at: page.updated_at }
    update(restored)
    setRestored(page.page_key)
    toast.info('Conteúdo padrão restaurado no formulário. Salve para publicar a alteração.')
  }

  if (!page) return <div className="brand-settings-section" role="status">{error || 'Carregando conteúdo das páginas...'}</div>
  return <div className="managed-pages-editor">
    {error ? <p className="admin-error" role="alert">{error}</p> : null}
    <div className="managed-page-tabs" role="tablist" aria-label="Páginas institucionais">{(Object.keys(labels) as ManagedPageKey[]).map((key) => <button type="button" role="tab" aria-selected={active === key} className={active === key ? 'active' : ''} key={key} onClick={() => setActive(key)}>{labels[key]}</button>)}</div>
    <div className="managed-page-layout"><section className="brand-settings-section managed-page-form" aria-label={`Editar ${labels[active]}`}>
      <label>Título<input value={page.title} maxLength={120} onChange={(event) => update({ ...page, title: event.target.value })} /><small>{page.title.length}/120</small></label>
      <label>Subtítulo<textarea value={page.subtitle} maxLength={240} onChange={(event) => update({ ...page, subtitle: event.target.value })} /><small>{page.subtitle.length}/240</small></label>
      {page.content.notice ? <fieldset><legend>Aviso institucional</legend><label>Título<input value={page.content.notice.title} maxLength={120} onChange={(event) => update({ ...page, content: { ...page.content, notice: { ...page.content.notice!, title: event.target.value } } })} /></label><label>Corpo<textarea value={page.content.notice.body} maxLength={1500} onChange={(event) => update({ ...page, content: { ...page.content, notice: { ...page.content.notice!, body: event.target.value } } })} /><small>{page.content.notice.body.length}/1500</small></label></fieldset> : null}
      <div className="managed-page-sections"><h3>Seções</h3>{page.content.sections.map((section, index) => <fieldset key={`${section.id}-${index}`}><legend>Seção {index + 1}</legend><label>ID da âncora<input value={section.id} onBlur={(event) => { const sections = [...page.content.sections]; sections[index] = { ...section, id: normalizeSectionId(event.target.value) }; update({ ...page, content: { ...page.content, sections } }) }} onChange={(event) => { const sections = [...page.content.sections]; sections[index] = { ...section, id: event.target.value }; update({ ...page, content: { ...page.content, sections } }) }} /></label><label>Título<input value={section.title} maxLength={160} onChange={(event) => { const sections = [...page.content.sections]; sections[index] = { ...section, title: event.target.value }; update({ ...page, content: { ...page.content, sections } }) }} /></label><label>Corpo<textarea value={section.body} maxLength={4000} onChange={(event) => { const sections = [...page.content.sections]; sections[index] = { ...section, body: event.target.value }; update({ ...page, content: { ...page.content, sections } }) }} /><small>{section.body.length}/4000</small></label></fieldset>)}</div>
      {active === 'terms_and_privacy' ? <label>Versão e data textual<input value={page.version_label} maxLength={240} onChange={(event) => update({ ...page, version_label: event.target.value })} /></label> : null}
      <label className="admin-checkbox-field"><input type="checkbox" checked={page.is_published} onChange={(event) => update({ ...page, is_published: event.target.checked })} /><span>Publicado</span></label>
      <div className="admin-form-actions"><button className="secondary-button" type="button" onClick={restore}>Restaurar conteúdo padrão</button><button className="primary-button" type="button" disabled={saving} onClick={() => void save()}>{saving ? 'Salvando...' : 'Salvar conteúdo'}</button></div>
    </section><aside className="brand-settings-section managed-page-preview" aria-label="Prévia"><p className="eyebrow">Prévia</p><h2>{page.title}</h2><p>{page.subtitle}</p>{page.content.notice ? <aside role="note"><strong>{page.content.notice.title}</strong><p>{page.content.notice.body}</p></aside> : null}{page.content.sections.map((section) => <section key={section.id}><h3>{section.title}</h3><p>{section.body}</p></section>)}</aside></div>
  </div>
}
