import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useBrandSettings } from '../contexts/BrandSettingsContext'
import { useVisualMode } from '../contexts/VisualModeContext'
import { getVariantClassName, getVariantImage, getVariantStyle } from '../lib/cardVisualVariants'

export default function VisualModeSelector() {
  const { settings } = useBrandSettings()
  const { visualMode, setVisualMode, visualModeOptions } = useVisualMode()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const activeOption = visualModeOptions.find(({ value }) => value === visualMode)

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
    <button className="visual-mode-trigger" type="button" aria-label={`Escolher visual. Atual: ${activeOption?.label ?? 'Preto institucional'}`} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
      <span className={`visual-mode-trigger-swatch ${getVariantClassName(settings, visualMode)}`} style={getVariantStyle(settings, visualMode)} aria-hidden="true" />
      <span>Visual</span>
      <ChevronDown className={open ? 'open' : ''} size={15} aria-hidden="true" />
    </button>

    {open ? <section className="visual-mode-popover" role="dialog" aria-label="Escolha o visual">
      <p>Escolha o visual</p>
      <div className="visual-mode-grid">
        {visualModeOptions.map((option) => {
          const hasImage = Boolean(getVariantImage(settings, option.value))
          const active = visualMode === option.value
          return <button
            className={`visual-mode-option${active ? ' active' : ''}`}
            type="button"
            aria-label={`Usar visual: ${option.label}`}
            aria-pressed={active}
            key={option.value}
            onClick={() => { setVisualMode(option.value); setOpen(false) }}
          >
            <span className={`visual-mode-option-preview visual-mode-option-${option.value.replace(/_/g, '-')}${hasImage ? ' has-image' : ''} ${getVariantClassName(settings, option.value)}`} style={getVariantStyle(settings, option.value)} aria-hidden="true">
              {active ? <span className="visual-mode-option-check"><Check size={13} /></span> : null}
            </span>
            <span>{option.label}</span>
          </button>
        })}
      </div>
    </section> : null}
  </div>
}
