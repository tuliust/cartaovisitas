import { Check, ChevronDown, ImagePlus, Trash2, Upload } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type DragEvent } from 'react'
import {
  templateColorPalette,
  type BrandAssetType,
  type BrandSettings,
  type TemplateColor,
  type VisualVariantSettings,
} from '../../lib/brandSettings'
import {
  brandTemplateElementGroups,
  brandTemplateElements,
  getBrandTemplateElement,
  type TemplateElementDefinition,
  type TemplateElementKey,
} from '../../lib/brandTemplateElements'
import { getVariantClassName, getVariantStyle, publicVisualVariantOptions, type PublicVisualVariant } from '../../lib/cardVisualVariants'

type AssetUrlKey = 'logo_on_dark_url' | 'logo_on_light_url' | 'card_bg_dark_image_1_url' | 'card_bg_dark_image_2_url' | 'card_bg_light_image_3_url' | 'card_bg_light_image_4_url'

type TemplateOptionsEditorProps = {
  activeVariant: PublicVisualVariant
  activeElement: TemplateElementKey
  values: BrandSettings
  uploading: BrandAssetType | ''
  onActiveVariantChange: (variant: PublicVisualVariant) => void
  onActiveElementChange: (element: TemplateElementKey) => void
  onAssetChange: (key: AssetUrlKey, value: string) => void
  onUpload: (file: File, type: BrandAssetType, key: AssetUrlKey) => Promise<void>
  onVariantChange: <K extends keyof VisualVariantSettings>(key: K, value: VisualVariantSettings[K]) => void
}

const backgroundAssets: Partial<Record<PublicVisualVariant, { key: AssetUrlKey; type: BrandAssetType }>> = {
  dark_image_1: { key: 'card_bg_dark_image_1_url', type: 'card-bg-dark-1' },
  dark_image_2: { key: 'card_bg_dark_image_2_url', type: 'card-bg-dark-2' },
  light_image_3: { key: 'card_bg_light_image_3_url', type: 'card-bg-light-3' },
  light_image_4: { key: 'card_bg_light_image_4_url', type: 'card-bg-light-4' },
}

function AssetUploadCard({ accept, alt, help, loading, title, url, onRemove, onUpload }: { accept: string; alt: string; help: string; loading: boolean; title: string; url: string; onRemove: () => void; onUpload: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const draggingRef = useRef(false)

  function select(file?: File) { if (file) onUpload(file) }
  function setDragging(element: HTMLDivElement, dragging: boolean) {
    draggingRef.current = dragging
    element.classList.toggle('is-dragging', dragging)
  }
  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(event.currentTarget, false)
    select(event.dataTransfer.files?.[0])
  }

  return <div className="template-asset-editor" onDragEnter={(event) => { event.preventDefault(); setDragging(event.currentTarget, true) }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(event.currentTarget, false) }} onDrop={drop}>
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

function getElementTokenSummary(tokens: VisualVariantSettings, element: TemplateElementDefinition) {
  const color = String(tokens[element.color])
  const opacity = element.opacity ? Math.round(Number(tokens[element.opacity]) * 100) : 100
  return { color, opacity }
}

function TemplateElementPicker({ activeElement, tokens, onChange }: { activeElement: TemplateElementKey; tokens: VisualVariantSettings; onChange: (element: TemplateElementKey) => void }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const active = getBrandTemplateElement(activeElement)
  const summary = getElementTokenSummary(tokens, active)

  useEffect(() => {
    if (!open) return
    function closeOutside(event: MouseEvent) { if (!rootRef.current?.contains(event.target as Node)) setOpen(false) }
    function closeEscape(event: KeyboardEvent) { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', closeOutside)
    document.addEventListener('keydown', closeEscape)
    return () => { document.removeEventListener('mousedown', closeOutside); document.removeEventListener('keydown', closeEscape) }
  }, [open])

  return <div className="template-element-picker" ref={rootRef}>
    <span className="template-element-picker-label">Elemento</span>
    <button className="template-element-picker-trigger" type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
      <span className="template-element-picker-copy"><strong>{active.label}</strong><small>{summary.color} · {summary.opacity}% de opacidade</small></span>
      <span className="template-element-picker-swatch" style={{ backgroundColor: summary.color, opacity: Math.max(0.18, summary.opacity / 100) }} aria-hidden="true" />
      <ChevronDown className={open ? 'open' : ''} aria-hidden="true" />
    </button>
    {open ? <div className="template-element-picker-menu" role="listbox" aria-label="Elementos de cor e opacidade">
      {brandTemplateElementGroups.map((group) => <section className="template-element-picker-group" key={group.key}>
        <h3>{group.label}</h3>
        {brandTemplateElements.filter((option) => option.group === group.key).map((option) => {
          const optionSummary = getElementTokenSummary(tokens, option)
          const selected = option.key === activeElement
          return <button className={`template-element-picker-option${selected ? ' active' : ''}`} type="button" role="option" aria-selected={selected} key={option.key} onClick={() => { onChange(option.key); setOpen(false) }}>
            <span className="template-element-picker-swatch" style={{ backgroundColor: optionSummary.color, opacity: Math.max(0.18, optionSummary.opacity / 100) }} aria-hidden="true" />
            <span><strong>{option.label}</strong><small>{optionSummary.color} · {optionSummary.opacity}%</small></span>
            {selected ? <Check aria-hidden="true" /> : null}
          </button>
        })}
      </section>)}
    </div> : null}
  </div>
}

export function TemplateOptionsEditor({ activeVariant, activeElement, values, uploading, onActiveVariantChange, onActiveElementChange, onAssetChange, onUpload, onVariantChange }: TemplateOptionsEditorProps) {
  const tokens = values.visual_variant_settings[activeVariant]
  const element = getBrandTemplateElement(activeElement)
  const backgroundAsset = backgroundAssets[activeVariant]
  const backgroundUrl = backgroundAsset ? String(values[backgroundAsset.key] || '') : ''
  const dark = activeVariant.startsWith('dark_')
  const logo = dark
    ? { key: 'logo_on_dark_url' as const, type: 'logo-on-dark' as const, title: 'Logo claro', url: values.logo_on_dark_url }
    : { key: 'logo_on_light_url' as const, type: 'logo-on-light' as const, title: 'Logo escuro', url: values.logo_on_light_url }
  const opacity = element.opacity ? Math.round(Number(tokens[element.opacity]) * 100) : null
  const selectedColor = String(tokens[element.color])

  return <section className="brand-settings-section template-options-editor">
    <div><h2>Opções de Template</h2><p className="field-help">Escolha um template e ajuste seus elementos. A prévia é atualizada em tempo real e destaca os componentes afetados.</p></div>
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
      {backgroundAsset ? <AssetUploadCard accept="image/png,image/jpeg,image/webp" alt={`Background de ${publicVisualVariantOptions.find(({ value }) => value === activeVariant)?.label}`} help="PNG, JPG ou WebP · até 5 MB · 1600 × 1000 px" loading={uploading === backgroundAsset.type} title="Background" url={backgroundUrl} onRemove={() => onAssetChange(backgroundAsset.key, '')} onUpload={(file) => void onUpload(file, backgroundAsset.type, backgroundAsset.key)} /> : <div className="template-solid-note"><strong>Background sólido</strong><small>Este template utiliza somente a cor de fundo selecionada.</small></div>}
    </div>
    {backgroundAsset && !backgroundUrl ? <p className="template-fallback-note">Sem uma imagem configurada, este modo utiliza automaticamente o background sólido da mesma família, preservando suas cores, superfícies e botões.</p> : null}

    <TemplateElementPicker activeElement={activeElement} tokens={tokens} onChange={onActiveElementChange} />

    <div className="template-element-context">
      <p>{element.description}</p>
      <strong>Componentes afetados</strong>
      <div className="template-affected-components">
        {element.affectedComponents.map((component) => <span key={component}>{component}</span>)}
      </div>
    </div>

    <div className="template-token-controls" key={activeElement}>
      <fieldset><legend>Cor atual</legend><div className="template-palette">{templateColorPalette.map((color) => <button type="button" className={selectedColor === color ? 'active' : ''} aria-label={`Usar cor ${color}`} aria-pressed={selectedColor === color} title={color} key={color} style={{ '--template-swatch': color } as CSSProperties} onClick={() => onVariantChange(element.color, color as TemplateColor)} />)}</div></fieldset>
      {element.opacity ? <label className="opacity-field"><span>Opacidade atual <output>{opacity}%</output></span><input type="range" min="0" max="100" step="1" value={opacity ?? 100} onChange={(event) => onVariantChange(element.opacity!, Number(event.target.value) / 100)} /></label> : <div className="template-token-no-opacity"><span>Opacidade atual</span><strong>100%</strong><small>Este elemento usa cor sólida para preservar o background base.</small></div>}
    </div>
    <p className="template-fallback-note">Tipografia institucional fixa: a família Inter/sistema, os pesos e os tamanhos permanecem padronizados. As cores de textos, ícones, fundos, superfícies, campos e botões agora são controladas por tokens independentes.</p>
    <p className="template-fallback-note">Escopo fixo: QR Code, cores semânticas de sucesso/alerta/erro e a assinatura de e-mail não mudam entre os seis modos. A assinatura mantém Arial e cores próprias para compatibilidade com Gmail e outros clientes.</p>
  </section>
}
