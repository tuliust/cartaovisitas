import { ImagePlus, Trash2, Upload } from 'lucide-react'
import { useRef, useState, type CSSProperties, type DragEvent } from 'react'
import {
  templateColorPalette,
  type BrandAssetType,
  type BrandSettings,
  type TemplateColor,
  type VisualVariantSettings,
} from '../../lib/brandSettings'
import { getVariantClassName, getVariantStyle, publicVisualVariantOptions, type PublicVisualVariant } from '../../lib/cardVisualVariants'

type AssetUrlKey = 'logo_on_dark_url' | 'logo_on_light_url' | 'card_bg_dark_image_1_url' | 'card_bg_dark_image_2_url' | 'card_bg_light_image_3_url' | 'card_bg_light_image_4_url'
type EditableColorKey = 'background_color' | 'surface_color' | 'border_color' | 'icon_color' | 'primary_button_color' | 'secondary_button_color' | 'auxiliary_button_color'
type EditableOpacityKey = 'background_opacity' | 'surface_opacity' | 'border_opacity' | 'icon_opacity' | 'primary_button_opacity' | 'secondary_button_opacity' | 'auxiliary_button_opacity'
type ElementKey = 'background' | 'surface' | 'border' | 'icon' | 'font' | 'primary' | 'secondary' | 'auxiliary'

type TemplateOptionsEditorProps = {
  activeVariant: PublicVisualVariant
  values: BrandSettings
  uploading: BrandAssetType | ''
  onActiveVariantChange: (variant: PublicVisualVariant) => void
  onAssetChange: (key: AssetUrlKey, value: string) => void
  onUpload: (file: File, type: BrandAssetType, key: AssetUrlKey) => Promise<void>
  onVariantChange: <K extends keyof VisualVariantSettings>(key: K, value: VisualVariantSettings[K]) => void
}

const elementOptions: Array<{ key: ElementKey; label: string; color?: EditableColorKey; opacity?: EditableOpacityKey }> = [
  { key: 'background', label: 'Background', color: 'background_color', opacity: 'background_opacity' },
  { key: 'surface', label: 'Caixa de texto', color: 'surface_color', opacity: 'surface_opacity' },
  { key: 'border', label: 'Borda', color: 'border_color', opacity: 'border_opacity' },
  { key: 'icon', label: 'Ícones', color: 'icon_color', opacity: 'icon_opacity' },
  { key: 'font', label: 'Fontes' },
  { key: 'primary', label: 'Principal', color: 'primary_button_color', opacity: 'primary_button_opacity' },
  { key: 'secondary', label: 'Secundário', color: 'secondary_button_color', opacity: 'secondary_button_opacity' },
  { key: 'auxiliary', label: 'Auxiliar', color: 'auxiliary_button_color', opacity: 'auxiliary_button_opacity' },
]

const backgroundAssets: Partial<Record<PublicVisualVariant, { key: AssetUrlKey; type: BrandAssetType }>> = {
  dark_image_1: { key: 'card_bg_dark_image_1_url', type: 'card-bg-dark-1' },
  dark_image_2: { key: 'card_bg_dark_image_2_url', type: 'card-bg-dark-2' },
  light_image_3: { key: 'card_bg_light_image_3_url', type: 'card-bg-light-3' },
  light_image_4: { key: 'card_bg_light_image_4_url', type: 'card-bg-light-4' },
}

function AssetUploadCard({ accept, alt, help, loading, title, url, onRemove, onUpload }: { accept: string; alt: string; help: string; loading: boolean; title: string; url: string; onRemove: () => void; onUpload: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  function select(file?: File) { if (file) onUpload(file) }
  function drop(event: DragEvent<HTMLDivElement>) { event.preventDefault(); setDragging(false); select(event.dataTransfer.files?.[0]) }
  return <div className={`template-asset-editor${dragging ? ' is-dragging' : ''}`} onDragEnter={(event) => { event.preventDefault(); setDragging(true) }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false) }} onDrop={drop}>
    <div className="template-asset-heading"><strong>{title}</strong><small>{help}</small></div>
    <input ref={inputRef} type="file" hidden tabIndex={-1} accept={accept} onChange={(event) => { select(event.target.files?.[0]); event.target.value = '' }} />
    {url ? <div className="template-asset-stage" role="group" tabIndex={0} aria-label={`${title}. Use Tab para acessar as ações da imagem.`}>
      <img src={url} alt={alt} />
      <div className="template-asset-actions" role="group" aria-label={`Ações de ${title}`}>
        <button type="button" aria-label={`Excluir ${title}`} title="Excluir" onClick={onRemove}><Trash2 aria-hidden="true" /></button>
        <button type="button" aria-label={`Substituir ${title}`} title="Substituir" onClick={() => inputRef.current?.click()}><ImagePlus aria-hidden="true" /></button>
      </div>
    </div> : <button className="template-upload-empty" type="button" disabled={loading} onClick={() => inputRef.current?.click()}><Upload aria-hidden="true" /><span>{loading ? 'Enviando...' : 'Upload'}</span><small>ou arraste o arquivo para esta área</small></button>}
  </div>
}

export function TemplateOptionsEditor({ activeVariant, values, uploading, onActiveVariantChange, onAssetChange, onUpload, onVariantChange }: TemplateOptionsEditorProps) {
  const [activeElement, setActiveElement] = useState<ElementKey>('background')
  const tokens = values.visual_variant_settings[activeVariant]
  const element = elementOptions.find(({ key }) => key === activeElement) ?? elementOptions[0]
  const backgroundAsset = backgroundAssets[activeVariant]
  const dark = activeVariant.startsWith('dark_')
  const logo = dark
    ? { key: 'logo_on_dark_url' as const, type: 'logo-on-dark' as const, title: 'Logo claro', url: values.logo_on_dark_url }
    : { key: 'logo_on_light_url' as const, type: 'logo-on-light' as const, title: 'Logo escuro', url: values.logo_on_light_url }
  const opacity = element.opacity ? Math.round(tokens[element.opacity] * 100) : 100

  return <section className="brand-settings-section template-options-editor">
    <div><h2>Opções de Template</h2><p className="field-help">Escolha um template e ajuste seus elementos. A prévia é atualizada em tempo real.</p></div>
    {(['dark', 'light'] as const).map((group) => <div className="template-mode-group" key={group}>
      <h3>{group === 'dark' ? 'Modo Escuro' : 'Modo Claro'}</h3>
      <div className="template-picker-grid" role="tablist" aria-label={group === 'dark' ? 'Templates escuros' : 'Templates claros'}>
        {publicVisualVariantOptions.filter(({ value }) => value.startsWith(`${group}_`)).map((option) => <button type="button" role="tab" aria-selected={activeVariant === option.value} className={activeVariant === option.value ? 'active' : ''} key={option.value} onClick={() => onActiveVariantChange(option.value)}>
          <span className={`template-picker-preview ${getVariantClassName(values, option.value)}`} style={getVariantStyle(values, option.value)} aria-hidden="true" />
          <span>{option.label}</span>
        </button>)}
      </div>
    </div>)}

    <div className="template-assets-grid">
      <AssetUploadCard accept="image/png,image/svg+xml,image/webp" alt={`Prévia do ${logo.title.toLowerCase()}`} help="PNG, SVG ou WebP · até 2 MB · 1200 × 320 px" loading={uploading === logo.type} title={logo.title} url={logo.url} onRemove={() => onAssetChange(logo.key, '')} onUpload={(file) => void onUpload(file, logo.type, logo.key)} />
      {backgroundAsset ? <AssetUploadCard accept="image/png,image/jpeg,image/webp" alt={`Background de ${publicVisualVariantOptions.find(({ value }) => value === activeVariant)?.label}`} help="PNG, JPG ou WebP · até 5 MB · 1600 × 1000 px" loading={uploading === backgroundAsset.type} title="Background" url={String(values[backgroundAsset.key] || '')} onRemove={() => onAssetChange(backgroundAsset.key, '')} onUpload={(file) => void onUpload(file, backgroundAsset.type, backgroundAsset.key)} /> : <div className="template-solid-note"><strong>Background sólido</strong><small>Este template utiliza somente a cor de fundo selecionada.</small></div>}
    </div>

    <label className="template-element-select">Elemento<select value={activeElement} onChange={(event) => setActiveElement(event.target.value as ElementKey)}>{elementOptions.map((option) => <option value={option.key} key={option.key}>{option.label}</option>)}</select></label>
    {element.color && element.opacity ? <div className="template-token-controls">
      <fieldset><legend>Cor</legend><div className="template-palette">{templateColorPalette.map((color) => <button type="button" className={tokens[element.color!] === color ? 'active' : ''} aria-label={`Usar cor ${color}`} aria-pressed={tokens[element.color!] === color} title={color} key={color} style={{ '--template-swatch': color } as CSSProperties} onClick={() => onVariantChange(element.color!, color as TemplateColor)} />)}</div></fieldset>
      <label className="opacity-field"><span>Opacidade <output>{opacity}%</output></span><input type="range" min="0" max="100" step="1" value={opacity} onChange={(event) => onVariantChange(element.opacity!, Number(event.target.value) / 100)} /></label>
    </div> : <div className="template-font-token"><span>Cor fixa deste modo</span><strong><i style={{ background: tokens.text_color }} />{tokens.text_color.toUpperCase()}</strong><small>Tipografia e tamanhos seguem o padrão das páginas.</small></div>}
  </section>
}
