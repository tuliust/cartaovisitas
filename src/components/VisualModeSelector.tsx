import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useBrandSettings } from '../contexts/BrandSettingsContext'
import { useVisualMode } from '../contexts/VisualModeContext'
import { getVariantClassName, getVariantImage, getVariantStyle } from '../lib/cardVisualVariants'

type VisualModeSelectorProps = { variant?: 'default' | 'compact' }

export default function VisualModeSelector({ variant = 'default' }: VisualModeSelectorProps) {
  const { settings } = useBrandSettings()
  const { visualMode, setVisualMode, visualModeOptions } = useVisualMode()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const activeOption = visualModeOptions.find(({ value }) => value === visualMode)

  useEffect(() => {
    if (!open) return
    function closeAndRestoreFocus() { setOpen(false); window.requestAnimationFrame(() => triggerRef.current?.focus()) }
    function closeOnOutsideClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) closeAndRestoreFocus()
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') closeAndRestoreFocus()
    }
    const close = () => closeAndRestoreFocus()
    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [open])

  const compact = variant === 'compact'
  return <div className={`visual-mode-selector${compact ? ' visual-mode-selector--compact' : ''}`} ref={containerRef}>
    <button ref={triggerRef} className="visual-mode-trigger" type="button" aria-label={`Escolher visual. Atual: ${activeOption?.label ?? 'Preto institucional'}`} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
      <span className={`visual-mode-trigger-swatch ${getVariantClassName(settings, visualMode)}`} style={getVariantStyle(settings, visualMode)} aria-hidden="true" />
      {!compact ? <><span>Visual</span><ChevronDown className={open ? 'open' : ''} size={15} aria-hidden="true" /></> : null}
    </button>

    {open ? <section className="visual-mode-popover" role="dialog" aria-label="Escolha o visual">
      {(['dark', 'light'] as const).map((group) => <div className="visual-mode-group" key={group}>
      {!compact ? <p>{group === 'dark' ? 'Modo Escuro' : 'Modo Claro'}</p> : null}
      <div className="visual-mode-grid">
        {visualModeOptions.filter(({ value }) => value.startsWith(`${group}_`)).map((option) => {
          const hasImage = Boolean(getVariantImage(settings, option.value))
          const active = visualMode === option.value
          return <button
            className={`visual-mode-option${active ? ' active' : ''}`}
            type="button"
            aria-label={`Usar visual: ${option.label}`}
            title={option.label}
            aria-pressed={active}
            key={option.value}
            onClick={() => { setVisualMode(option.value); setOpen(false); window.requestAnimationFrame(() => triggerRef.current?.focus()) }}
          >
            <span className={`visual-mode-option-preview visual-mode-option-${option.value.replace(/_/g, '-')}${hasImage ? ' has-image' : ''} ${getVariantClassName(settings, option.value)}`} style={getVariantStyle(settings, option.value)} aria-hidden="true">
              {active && !compact ? <span className="visual-mode-option-check"><Check size={13} /></span> : null}
            </span>
          </button>
        })}
      </div>
      </div>)}
    </section> : null}
  </div>
}
