import { useEffect, useState, type ChangeEvent, type CSSProperties } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useBrandSettings } from '../../contexts/BrandSettingsContext'
import { getCurrentSession } from '../../lib/auth'
import {
  defaultBrandSettings,
  getBrandSettings,
  isValidHexColor,
  updateBrandSettings,
  uploadBrandAsset,
  type BrandAssetType,
  type BrandSettings,
} from '../../lib/brandSettings'
import { getFriendlyErrorMessage } from '../../lib/errors'
import { requireAdmin } from '../../lib/roles'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext'
import { recordAuditLog } from '../../lib/audit'
import { getVariantClassName, getVariantLogo, getVariantStyle, publicVisualVariantOptions } from '../../lib/cardVisualVariants'

type ColorKey = 'primary_color' | 'secondary_color' | 'background_color' | 'surface_color' | 'text_color'
type AssetUrlKey = 'favicon_url' | 'og_image_url' | 'background_image_url' | 'apple_touch_icon_url' | 'logo_on_dark_url' | 'logo_on_light_url' | 'card_bg_dark_image_1_url' | 'card_bg_dark_image_2_url' | 'card_bg_light_image_3_url' | 'card_bg_light_image_4_url'

const institutionalAssets: Array<{ key: AssetUrlKey; type: BrandAssetType; label: string; help: string; accept: string }> = [
  { key: 'logo_on_dark_url', type: 'logo-on-dark', label: 'Logo para fundo escuro', help: 'Use uma versão branca ou clara. Recomendado: logo horizontal em PNG, SVG ou WebP, entre 600–1200 px de largura e 160–320 px de altura, preferencialmente com fundo transparente, área segura ao redor da marca e arquivo de até 2 MB. O sistema ajusta a imagem automaticamente para evitar cortes.', accept: 'image/png,image/svg+xml,image/webp' },
  { key: 'logo_on_light_url', type: 'logo-on-light', label: 'Logo para fundo claro', help: 'Use uma versão preta ou escura. Recomendado: logo horizontal em PNG, SVG ou WebP, entre 600–1200 px de largura e 160–320 px de altura, preferencialmente com fundo transparente, área segura ao redor da marca e arquivo de até 2 MB. O sistema ajusta a imagem automaticamente para evitar cortes.', accept: 'image/png,image/svg+xml,image/webp' },
  { key: 'card_bg_dark_image_1_url', type: 'card-bg-dark-1', label: 'Imagem escura 1', help: 'JPG, PNG ou WebP. Recomendado: 1600 × 1000 px ou maior.', accept: 'image/png,image/jpeg,image/webp' },
  { key: 'card_bg_dark_image_2_url', type: 'card-bg-dark-2', label: 'Imagem escura 2', help: 'JPG, PNG ou WebP. Recomendado: 1600 × 1000 px ou maior.', accept: 'image/png,image/jpeg,image/webp' },
  { key: 'card_bg_light_image_3_url', type: 'card-bg-light-3', label: 'Imagem clara 1', help: 'JPG, PNG ou WebP. Recomendado: 1600 × 1000 px ou maior.', accept: 'image/png,image/jpeg,image/webp' },
  { key: 'card_bg_light_image_4_url', type: 'card-bg-light-4', label: 'Imagem clara 2', help: 'JPG, PNG ou WebP. Recomendado: 1600 × 1000 px ou maior.', accept: 'image/png,image/jpeg,image/webp' },
]

function getImageDimensions(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => { const image = new Image(); const url = URL.createObjectURL(file); image.onload = () => { resolve({ width: image.naturalWidth, height: image.naturalHeight }); URL.revokeObjectURL(url) }; image.onerror = () => { reject(new Error('Não foi possível ler as dimensões da imagem.')); URL.revokeObjectURL(url) }; image.src = url })
}

const colorFields: Array<{ key: ColorKey; label: string }> = [
  { key: 'primary_color', label: 'Cor primária' },
  { key: 'secondary_color', label: 'Cor secundária/acento' },
  { key: 'background_color', label: 'Cor de fundo' },
  { key: 'surface_color', label: 'Cor de superfície' },
  { key: 'text_color', label: 'Cor de texto' },
]

export default function AdminBrandSettingsPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { setSettings } = useBrandSettings()
  const [values, setValues] = useState(defaultBrandSettings)
  const [booting, setBooting] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<BrandAssetType | ''>('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    let mounted = true
    void (async () => {
      if (!(await getCurrentSession())) return navigate('/admin/login', { replace: true })
      await requireAdmin()
      const loaded = await getBrandSettings()
      if (mounted) { setValues(loaded); setBooting(false) }
    })().catch(() => navigate('/admin/login', { replace: true }))
    return () => { mounted = false }
  }, [navigate])

  function update<K extends keyof BrandSettings>(key: K, value: BrandSettings[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    setSuccess('')
  }

  async function upload(event: ChangeEvent<HTMLInputElement>, type: BrandAssetType, key: AssetUrlKey) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(type); setError(''); setSuccess('')
    try {
      if (file.type === 'image/png' && (type === 'favicon' || type === 'apple-touch-icon')) { const dimensions = await getImageDimensions(file); if (dimensions.width !== dimensions.height) toast.info('Recomendamos uma imagem quadrada para este ícone.'); else if (type === 'apple-touch-icon' && (dimensions.width !== 180 || dimensions.height !== 180)) toast.info('O tamanho recomendado para o Ícone Apple Touch é 180 × 180 px.') }
      const url = await uploadBrandAsset(file, type); update(key, url); await recordAuditLog({ action: 'brand_asset_uploaded', targetType: 'brand_settings', targetLabel: type, afterData: { type, url } }); toast.success('Imagem enviada com sucesso. Salve as configurações para aplicar.')
    }
    catch (uploadError) { const message = getFriendlyErrorMessage(uploadError); setError(message); toast.error(message) }
    finally { setUploading(''); event.target.value = '' }
  }

  async function save() {
    const invalid = colorFields.find(({ key }) => !isValidHexColor(values[key]))
    if (invalid) { const message = `${invalid.label}: informe uma cor hexadecimal no formato #050505.`; setError(message); toast.error(message); return }
    setSaving(true); setError(''); setSuccess('')
    try {
      const saved = await updateBrandSettings(values)
      await recordAuditLog({ action: 'brand_settings_updated', targetType: 'brand_settings', targetId: saved.id, targetLabel: 'Identidade visual', afterData: saved })
      const message = 'Identidade visual atualizada com sucesso.'
      setValues(saved); setSettings(saved); setSuccess(message); toast.success(message)
    } catch (saveError) { const message = getFriendlyErrorMessage(saveError); setError(message); toast.error(message) }
    finally { setSaving(false) }
  }

  if (booting) return <main className="admin-login-shell"><div className="admin-login-card">Carregando configurações...</div></main>

  const previewStyle = {
    '--preview-background': values.background_color,
    '--preview-surface': values.surface_color,
    '--preview-text': values.text_color,
    '--preview-primary': values.primary_color,
    '--preview-accent': values.secondary_color,
  } as CSSProperties

  return (
    <AdminLayout title="Configurações" subtitle="Gerencie os assets e as cores da identidade visual do sistema.">
      {error ? <p className="admin-error" role="alert">{error}</p> : null}
      {success ? <p className="admin-success" role="status">{success}</p> : null}
      <div className="brand-settings-grid">
        <div className="brand-settings-form">
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

          <section className="brand-settings-section">
            <h2>Cores</h2>
            <div className="brand-color-grid">
              {colorFields.map(({ key, label }) => <label className="color-field" key={key}><span>{label}</span><span className="color-input-row"><input type="color" value={isValidHexColor(values[key]) ? values[key] : defaultBrandSettings[key]} onChange={(event) => update(key, event.target.value)} /><input value={values[key]} onChange={(event) => update(key, event.target.value)} maxLength={7} /></span></label>)}
            </div>
          </section>
          <section className="brand-settings-section">
            <h2>Imagem de fundo</h2>
            <p className="field-help">JPG, PNG ou WebP com até 5 MB. Um overlay escuro preserva a legibilidade.</p>
            {values.background_image_url ? <img className="brand-asset-preview background" src={values.background_image_url} alt="Imagem de fundo atual" /> : <p className="field-help">O fundo padrão está ativo.</p>}
            <label>URL da imagem<input value={values.background_image_url} onChange={(event) => update('background_image_url', event.target.value)} /></label>
            <label>Enviar imagem<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void upload(event, 'background', 'background_image_url')} /></label>
            <button className="secondary-button compact-button" type="button" onClick={() => update('background_image_url', '')}>Remover imagem e restaurar fundo padrão</button>
          </section>
          <section className="brand-settings-section visual-variants-settings">
            <h2>Variações visuais do cartão</h2>
            <p className="field-help">Configure os logos oficiais por contraste. O logo para fundo escuro deve ser branco/claro. O logo para fundo claro deve ser preto/escuro.</p>
            <div className="institutional-assets-grid">{institutionalAssets.map((asset) => <div className="institutional-asset-field" key={asset.key}><h3>{asset.label}</h3><p className="field-help">{asset.help}</p>{values[asset.key] ? <img className={`brand-asset-preview ${asset.type.startsWith('logo') ? 'logo' : 'background'}`} src={values[asset.key]} alt={`Prévia: ${asset.label}`} /> : null}<label>URL<input value={values[asset.key]} onChange={(event) => update(asset.key, event.target.value)} /></label><label>Enviar arquivo<input type="file" accept={asset.accept} onChange={(event) => void upload(event, asset.type, asset.key)} /></label><button className="secondary-button compact-button" type="button" onClick={() => update(asset.key, '')}>Remover e restaurar fallback</button></div>)}</div>
            <div className="visual-variants-preview" aria-label="Prévia das seis variações">{publicVisualVariantOptions.map((option) => <article className={`visual-variant-thumbnail ${getVariantClassName(values, option.value)}`} style={getVariantStyle(values, option.value)} key={option.value}><img src={getVariantLogo(values, option.value)} alt="Invest RS" /><strong>{option.label}</strong><span>Contato institucional</span></article>)}</div>
          </section>
        </div>

        <aside className="brand-preview" style={previewStyle} aria-label="Prévia da identidade visual">
          <img src={values.logo_on_dark_url || values.logo_url || defaultBrandSettings.logo_url} alt="Invest RS" />
          <div className="brand-preview-card"><p>Cartão institucional</p><h2>Identidade Invest RS</h2><span>Texto de exemplo para conferir contraste e legibilidade.</span><div><button type="button">Botão primário</button><button type="button">Secundário</button></div></div>
        </aside>
      </div>
      <div className="brand-settings-actions"><button className="primary-button" type="button" disabled={saving || Boolean(uploading)} onClick={() => void save()}>{uploading ? 'Enviando asset...' : saving ? 'Salvando...' : 'Salvar configurações'}</button></div>
    </AdminLayout>
  )
}
