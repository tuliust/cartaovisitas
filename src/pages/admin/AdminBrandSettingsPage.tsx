import { useEffect, useState, type ChangeEvent, type CSSProperties } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useBrandSettings } from '../../contexts/BrandSettingsContext'
import { getCurrentSession } from '../../lib/auth'
import {
  defaultBrandSettings,
  getBrandSettings,
  templateColorPalette,
  updateBrandSettings,
  uploadBrandAsset,
  type BrandAssetType,
  type BrandSettings,
  type VisualVariantSettings,
} from '../../lib/brandSettings'
import { getFriendlyErrorMessage } from '../../lib/errors'
import { requireAdmin } from '../../lib/roles'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext'
import { recordAuditLog } from '../../lib/audit'
import { getVariantClassName, getVariantLogo, getVariantStyle, publicVisualVariantOptions, type PublicVisualVariant } from '../../lib/cardVisualVariants'
import { ManagedPagesEditor } from '../../components/admin/ManagedPagesEditor'
import { TemplateOptionsEditor } from '../../components/admin/TemplateOptionsEditor'

type AssetUrlKey = 'favicon_url' | 'og_image_url' | 'background_image_url' | 'apple_touch_icon_url' | 'logo_on_dark_url' | 'logo_on_light_url' | 'card_bg_dark_image_1_url' | 'card_bg_dark_image_2_url' | 'card_bg_light_image_3_url' | 'card_bg_light_image_4_url'
type SettingsTab = 'visual' | 'content' | 'usage_guide' | 'terms_and_privacy'

function getImageDimensions(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => { const image = new Image(); const url = URL.createObjectURL(file); image.onload = () => { resolve({ width: image.naturalWidth, height: image.naturalHeight }); URL.revokeObjectURL(url) }; image.onerror = () => { reject(new Error('Não foi possível ler as dimensões da imagem.')); URL.revokeObjectURL(url) }; image.src = url })
}

const settingsTabs: Array<{ key: SettingsTab; label: string }> = [
  { key: 'visual', label: 'Identidade Visual' },
  { key: 'content', label: 'Conteúdo' },
  { key: 'usage_guide', label: 'Guia de Utilização' },
  { key: 'terms_and_privacy', label: 'Termos de Uso' },
]

const brandSettingKeys = Object.keys(defaultBrandSettings) as Array<keyof BrandSettings>

function getChangedBrandFields(before: BrandSettings, after: BrandSettings) {
  return brandSettingKeys.filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]))
}

export default function AdminBrandSettingsPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { setSettings } = useBrandSettings()
  const [values, setValues] = useState(defaultBrandSettings)
  const [savedValues, setSavedValues] = useState(defaultBrandSettings)
  const [booting, setBooting] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<BrandAssetType | ''>('')
  const [error, setError] = useState('')
  const [activeVariant, setActiveVariant] = useState<PublicVisualVariant>('dark_black')
  const [activeSettingsTab, setActiveSettingsTab] = useState<SettingsTab>('visual')

  useEffect(() => {
    let mounted = true
    void (async () => {
      if (!(await getCurrentSession())) return navigate('/admin/login', { replace: true })
      await requireAdmin()
      const loaded = await getBrandSettings()
      if (mounted) { setValues(loaded); setSavedValues(loaded); setBooting(false) }
    })().catch(() => navigate('/admin/login', { replace: true }))
    return () => { mounted = false }
  }, [navigate])

  function update<K extends keyof BrandSettings>(key: K, value: BrandSettings[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function updateVariant<K extends keyof VisualVariantSettings>(key: K, value: VisualVariantSettings[K]) {
    setValues((current) => {
      const variant = { ...current.visual_variant_settings[activeVariant], [key]: value }
      if (key === 'primary_button_color') variant.secondary_color = String(value)
      if (key === 'background_opacity') variant.background_overlay_opacity = Number(value)
      if (key === 'surface_opacity') variant.card_surface_opacity = Number(value)
      return { ...current, visual_variant_settings: { ...current.visual_variant_settings, [activeVariant]: variant } }
    })
  }

  async function uploadFile(file: File, type: BrandAssetType, key: AssetUrlKey) {
    setUploading(type); setError('')
    try {
      if (file.type === 'image/png' && (type === 'favicon' || type === 'apple-touch-icon')) { const dimensions = await getImageDimensions(file); if (dimensions.width !== dimensions.height) toast.info('Recomendamos uma imagem quadrada para este ícone.'); else if (type === 'apple-touch-icon' && (dimensions.width !== 180 || dimensions.height !== 180)) toast.info('O tamanho recomendado para o Ícone Apple Touch é 180 × 180 px.') }
      const url = await uploadBrandAsset(file, type); update(key, url); await recordAuditLog({ action: 'brand_asset_uploaded', targetType: 'brand_settings', targetLabel: type, afterData: { type, url } }); toast.success('Imagem enviada com sucesso. Salve as configurações para aplicar.')
    }
    catch (uploadError) { const message = getFriendlyErrorMessage(uploadError); setError(message); toast.error(message) }
    finally { setUploading('') }
  }

  async function upload(event: ChangeEvent<HTMLInputElement>, type: BrandAssetType, key: AssetUrlKey) {
    const file = event.target.files?.[0]
    if (file) await uploadFile(file, type, key)
    event.target.value = ''
  }

  async function save() {
    const allowedColors = new Set<string>(templateColorPalette)
    const colorKeys = ['background_color', 'surface_color', 'border_color', 'icon_color', 'primary_button_color', 'secondary_button_color', 'auxiliary_button_color'] as const
    const invalidVariant = publicVisualVariantOptions.find(({ value }) => colorKeys.some((key) => !allowedColors.has(values.visual_variant_settings[value][key])))
    if (invalidVariant) { const message = 'Selecione apenas cores da paleta institucional.'; setError(message); toast.error(message); return }
    const browserTitle = values.browser_title.replace(/[\r\n]+/g, ' ').trim()
    const appleTouchTitle = values.apple_touch_title.replace(/[\r\n]+/g, ' ').trim()
    if (!browserTitle || browserTitle.length > 100 || /[<>]/.test(browserTitle) || !appleTouchTitle || appleTouchTitle.length > 40 || /[<>]/.test(appleTouchTitle)) { const message = 'Revise os títulos: não use HTML ou quebras de linha e respeite os limites informados.'; setError(message); toast.error(message); return }
    const valuesToSave = { ...values, browser_title: browserTitle, apple_touch_title: appleTouchTitle }
    setSaving(true); setError('')
    try {
      const previousValues = savedValues
      const changedFields = getChangedBrandFields(previousValues, valuesToSave)
      const saved = await updateBrandSettings(valuesToSave)

      if (changedFields.length > 0) {
        await recordAuditLog({
          action: 'brand_settings_updated',
          targetType: 'brand_settings',
          targetId: saved.id,
          targetLabel: 'Identidade visual',
          beforeData: previousValues,
          afterData: saved,
          metadata: { changed_fields: changedFields },
        })
      }

      const message = 'Identidade visual atualizada com sucesso.'
      setValues(saved); setSavedValues(saved); setSettings(saved); toast.success(message)
    } catch (saveError) { const message = getFriendlyErrorMessage(saveError); setError(message); toast.error(message) }
    finally { setSaving(false) }
  }

  if (booting) return <main className="admin-login-shell admin-state-shell"><div className="admin-login-card admin-state-card" role="status">Carregando configurações...</div></main>

  const activeTokens = values.visual_variant_settings[activeVariant]
  const previewStyle = { ...getVariantStyle(values, activeVariant), '--preview-background': activeTokens.background_color, '--preview-surface': activeTokens.surface_color, '--preview-text': activeTokens.text_color, '--preview-primary': 'var(--semantic-primary-text)', '--preview-accent': 'var(--semantic-primary-bg)' } as CSSProperties

  return (
    <AdminLayout title="Configurações" subtitle="Gerencie os assets e as cores da identidade visual do sistema.">
      {error ? <p className="admin-error" role="alert">{error}</p> : null}
      <div className="admin-settings-tabs" role="tablist" aria-label="Seções de configuração">
        {settingsTabs.map((tab) => <button key={tab.key} type="button" role="tab" aria-selected={activeSettingsTab === tab.key} className={activeSettingsTab === tab.key ? 'active' : ''} onClick={() => setActiveSettingsTab(tab.key)}>{tab.label}</button>)}
      </div>
      {activeSettingsTab === 'visual' ? <>
      <section className="admin-settings-area" aria-labelledby="visual-settings-title"><h2 id="visual-settings-title">Identidade visual</h2><div className="brand-settings-grid">
        <div className="brand-settings-form">
          <section className="brand-settings-section">
            <h2>Metadados do site</h2>
            <label htmlFor="browser-title">Título das janelas do navegador</label>
            <input id="browser-title" value={values.browser_title} maxLength={100} onChange={(event) => update('browser_title', event.target.value.replace(/[\r\n]+/g, ' '))} />
            <small className="field-help">Usado na aba ou janela do navegador em todas as páginas.</small>
            <div className="metadata-field-footer"><span className="metadata-preview">Prévia: {values.browser_title || defaultBrandSettings.browser_title}</span><span>{values.browser_title.length}/100</span></div>
            <button className="secondary-button compact-button" type="button" onClick={() => update('browser_title', defaultBrandSettings.browser_title)}>Restaurar título padrão</button>
            <label htmlFor="apple-touch-title">Título do Apple Touch</label>
            <input id="apple-touch-title" value={values.apple_touch_title} maxLength={40} onChange={(event) => update('apple_touch_title', event.target.value.replace(/[\r\n]+/g, ' '))} />
            <small className="field-help">Usado como nome do atalho quando o site é adicionado à Tela de Início do iPhone ou iPad.</small>
            <div className="metadata-field-footer"><span className="metadata-preview">Prévia: {values.apple_touch_title || defaultBrandSettings.apple_touch_title}</span><span>{values.apple_touch_title.length}/40</span></div>
            <button className="secondary-button compact-button" type="button" onClick={() => update('apple_touch_title', defaultBrandSettings.apple_touch_title)}>Restaurar título padrão</button>
          </section>
          <section className="brand-settings-section">
            <h2>Favicon</h2>
            <p className="field-help">Usado na aba do navegador. Prefira SVG quadrado ou ICO com 16, 32 e 48 px.</p>
            <img className="brand-asset-preview favicon" src={values.favicon_url || defaultBrandSettings.favicon_url} alt="Favicon atual" />
            <label>URL do favicon<input value={values.favicon_url} onChange={(event) => update('favicon_url', event.target.value)} /></label>
            <label>Enviar favicon<input type="file" accept=".ico,image/x-icon,image/vnd.microsoft.icon,image/svg+xml,image/png" onChange={(event) => void upload(event, 'favicon', 'favicon_url')} /></label>
          </section>

          <section className="brand-settings-section">
            <h2>Ícone Apple Touch</h2>
            <p className="field-help">Usado quando o site é salvo na tela inicial do iPhone ou iPad. Recomendado: PNG 180 × 180 px.</p>
            {values.apple_touch_icon_url ? <img className="brand-asset-preview favicon" src={values.apple_touch_icon_url} alt="Ícone Apple Touch atual" /> : <p className="field-help">Nenhum ícone Apple Touch configurado.</p>}
            <label>URL do ícone<input value={values.apple_touch_icon_url} onChange={(event) => update('apple_touch_icon_url', event.target.value)} /></label>
            <label>Enviar ícone<input type="file" accept="image/png" onChange={(event) => void upload(event, 'apple-touch-icon', 'apple_touch_icon_url')} /></label>
            <button className="secondary-button compact-button" type="button" onClick={() => update('apple_touch_icon_url', '')}>Remover ícone</button>
          </section>

          <section className="brand-settings-section">
            <h2>Imagem de compartilhamento</h2>
            <p className="field-help">Dimensão recomendada: 1200 × 630 px.</p>
            <img className="brand-asset-preview og" src={values.og_image_url || defaultBrandSettings.og_image_url} alt="Imagem Open Graph atual" />
            <label>URL da imagem<input value={values.og_image_url} onChange={(event) => update('og_image_url', event.target.value)} /></label>
            <label>Enviar imagem<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void upload(event, 'og-image', 'og_image_url')} /></label>
          </section>

          <TemplateOptionsEditor activeVariant={activeVariant} values={values} uploading={uploading} onActiveVariantChange={setActiveVariant} onAssetChange={update} onUpload={uploadFile} onVariantChange={updateVariant} />
        </div>

        <div className="brand-settings-preview-column">
          <aside className={`brand-preview ${getVariantClassName(values, activeVariant)}`} style={previewStyle} aria-label="Prévia da identidade visual">
            <img src={getVariantLogo(values, activeVariant)} alt="Invest RS" />
            <div className="brand-preview-card"><span className="template-preview-icon" aria-hidden="true">◆</span><p>Cartão institucional</p><h2>Identidade Invest RS</h2><span>Texto de exemplo para conferir contraste e legibilidade.</span><div><button className="primary-button" type="button">Principal</button><button className="secondary-button" type="button">Secundário</button><button className="auxiliary-button" type="button">Auxiliar</button></div></div>
          </aside>
          <div className="brand-settings-actions"><button className="primary-button" type="button" disabled={saving || Boolean(uploading)} onClick={() => void save()}>{uploading ? 'Enviando asset...' : saving ? 'Salvando...' : 'Salvar configurações'}</button></div>
        </div>
      </div></section>
      </> : null}
      {activeSettingsTab === 'content' ? <section className="admin-settings-area" aria-labelledby="content-settings-title"><div className="admin-settings-area-heading"><h2 id="content-settings-title">Conteúdo</h2><p>Use as abas Guia de Utilização e Termos de Uso para editar textos institucionais estruturados sem HTML.</p></div></section> : null}
      {activeSettingsTab === 'usage_guide' ? <section className="admin-settings-area" aria-labelledby="usage-guide-settings-title"><div className="admin-settings-area-heading"><h2 id="usage-guide-settings-title">Guia de Utilização</h2><p>Edite o conteúdo publicado em /guia-de-utilizacao.</p></div><ManagedPagesEditor pageKey="usage_guide" showPreview={false} showTabs={false} /></section> : null}
      {activeSettingsTab === 'terms_and_privacy' ? <section className="admin-settings-area" aria-labelledby="terms-settings-title"><div className="admin-settings-area-heading"><h2 id="terms-settings-title">Termos de Uso</h2><p>Edite o conteúdo publicado em /termos-de-uso-e-privacidade.</p></div><ManagedPagesEditor pageKey="terms_and_privacy" showPreview={false} showTabs={false} /></section> : null}
    </AdminLayout>
  )
}
