import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useBrandSettings } from '../contexts/BrandSettingsContext'
import { useVisualMode } from '../contexts/VisualModeContext'
import { getVariantClassName, getVariantStyle } from '../lib/cardVisualVariants'

export default function VisualModeSelector() {
  const { settings } = useBrandSettings()
  const { visualMode, setVisualMode, visualModeOptions } = useVisualMode()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function closeOnOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return <div className="visual-mode-selector" ref={containerRef}>
    <button className="visual-mode-trigger" type="button" aria-label="Escolher modo visual" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
      <span className={`visual-mode-current-swatch ${getVariantClassName(settings, visualMode)}`} style={getVariantStyle(settings, visualMode)} aria-hidden="true" />
      <ChevronDown size={15} aria-hidden="true" />
    </button>
    {open ? <div className="visual-mode-menu" role="menu" aria-label="Modos visuais">
      {visualModeOptions.map((option) => <button className={visualMode === option.value ? 'active' : ''} type="button" role="menuitem" key={option.value} onClick={() => { setVisualMode(option.value); setOpen(false) }}>
        <span className={`visual-mode-option-swatch ${getVariantClassName(settings, option.value)}`} style={getVariantStyle(settings, option.value)} aria-hidden="true" />
        <span>{option.label}</span>
        {visualMode === option.value ? <Check size={16} aria-label="Ativo" /> : null}
      </button>)}
    </div> : null}
  </div>
}
