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

type ColorKey = 'primary_color' | 'secondary_color' | 'background_color' | 'surface_color' | 'text_color'

const colorFields: Array<{ key: ColorKey; label: string }> = [
  { key: 'primary_color', label: 'Cor primária' },
  { key: 'secondary_color', label: 'Cor secundária/acento' },
  { key: 'background_color', label: 'Cor de fundo' },
  { key: 'surface_color', label: 'Cor de superfície' },
  { key: 'text_color', label: 'Cor de texto' },
]

export default function AdminBrandSettingsPage() {
  const navigate = useNavigate()
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

  async function upload(event: ChangeEvent<HTMLInputElement>, type: BrandAssetType, key: 'logo_url' | 'favicon_url' | 'og_image_url' | 'background_image_url') {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(type); setError(''); setSuccess('')
    try { update(key, await uploadBrandAsset(file, type)) }
    catch (uploadError) { setError(getFriendlyErrorMessage(uploadError)) }
    finally { setUploading(''); event.target.value = '' }
  }

  async function save() {
    const invalid = colorFields.find(({ key }) => !isValidHexColor(values[key]))
    if (invalid) { setError(`${invalid.label}: informe uma cor hexadecimal no formato #050505.`); return }
    setSaving(true); setError(''); setSuccess('')
    try {
      const saved = await updateBrandSettings(values)
      setValues(saved); setSettings(saved); setSuccess('Identidade visual atualizada com sucesso.')
    } catch (saveError) { setError(getFriendlyErrorMessage(saveError)) }
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
            <h2>Logo</h2>
            <img className="brand-asset-preview logo" src={values.logo_url || defaultBrandSettings.logo_url} alt="Logo atual" />
            <label>URL do logo<input value={values.logo_url} onChange={(event) => update('logo_url', event.target.value)} /></label>
            <label>Enviar logo<input type="file" accept="image/png,image/svg+xml,image/webp" onChange={(event) => void upload(event, 'logo', 'logo_url')} /></label>
            <button className="secondary-button compact-button" type="button" onClick={() => update('logo_url', defaultBrandSettings.logo_url)}>Restaurar padrão</button>
          </section>

          <section className="brand-settings-section">
            <h2>Favicon</h2>
            <img className="brand-asset-preview favicon" src={values.favicon_url || defaultBrandSettings.favicon_url} alt="Favicon atual" />
            <label>URL do favicon<input value={values.favicon_url} onChange={(event) => update('favicon_url', event.target.value)} /></label>
            <label>Enviar favicon<input type="file" accept=".ico,image/x-icon,image/vnd.microsoft.icon,image/svg+xml,image/png" onChange={(event) => void upload(event, 'favicon', 'favicon_url')} /></label>
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
        </div>

        <aside className="brand-preview" style={previewStyle} aria-label="Prévia da identidade visual">
          <img src={values.logo_url || defaultBrandSettings.logo_url} alt="Invest RS" />
          <div className="brand-preview-card"><p>Cartão institucional</p><h2>Identidade Invest RS</h2><span>Texto de exemplo para conferir contraste e legibilidade.</span><div><button type="button">Botão primário</button><button type="button">Secundário</button></div></div>
        </aside>
      </div>
      <div className="brand-settings-actions"><button className="primary-button" type="button" disabled={saving || Boolean(uploading)} onClick={() => void save()}>{uploading ? 'Enviando asset...' : saving ? 'Salvando...' : 'Salvar configurações'}</button></div>
    </AdminLayout>
  )
}
