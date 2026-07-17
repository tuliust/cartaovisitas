import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useBrandSettings } from '../contexts/BrandSettingsContext'
import { useVisualMode } from '../contexts/VisualModeContext'
import { getVariantClassName, getVariantImage, getVariantStyle } from '../lib/cardVisualVariants'

type VisualModeSelectorProps = {
  variant?: 'default' | 'compact'
  triggerContent?: ReactNode
  triggerClassName?: string
  popoverPlacement?: 'bottom-end' | 'top-end'
}

export default function VisualModeSelector({ variant = 'default', triggerContent, triggerClassName = '', popoverPlacement = 'bottom-end' }: VisualModeSelectorProps) {
  const { settings } = useBrandSettings()
  const { visualMode, setVisualMode, visualModeOptions, keepVisualModeAsDefault, setKeepVisualModeAsDefault } = useVisualMode()
  const [open, setOpen] = useState(false)
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLElement>(null)
  const activeOption = visualModeOptions.find(({ value }) => value === visualMode)

  function closeAndRestoreFocus() {
    setOpen(false)
    window.requestAnimationFrame(() => triggerRef.current?.focus())
  }

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const width = Math.min(340, window.innerWidth - 28)
    const left = Math.max(14, Math.min(rect.right - width, window.innerWidth - width - 14))
    setPopoverStyle({
      left,
      top: popoverPlacement === 'top-end' ? rect.top - 10 : rect.bottom + 10,
      width,
    })
  }, [open, popoverPlacement])

  useEffect(() => {
    if (!open) return
    function closeOnOutsideClick(event: MouseEvent) {
      const target = event.target as Node
      if (!containerRef.current?.contains(target) && !popoverRef.current?.contains(target)) closeAndRestoreFocus()
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
  const popover = open ? <section
    ref={popoverRef}
    className={`visual-mode-popover visual-mode-popover--portal${popoverPlacement === 'top-end' ? ' visual-mode-popover--top' : ''}`}
    style={popoverStyle}
    role="dialog"
    aria-label="Escolha o visual"
  >
    {compact ? <div className="visual-mode-grid">
      {visualModeOptions.map((option) => {
        const hasImage = Boolean(getVariantImage(settings, option.value))
        const active = visualMode === option.value
        return <button
          className={`visual-mode-option${active ? ' active' : ''}`}
          type="button"
          aria-label={`Usar visual: ${option.label}`}
          title={option.label}
          aria-pressed={active}
          key={option.value}
          onClick={() => setVisualMode(option.value)}
        >
          <span className={`visual-mode-option-preview visual-mode-option-${option.value.replace(/_/g, '-')}${hasImage ? ' has-image' : ''} ${getVariantClassName(settings, option.value)}`} style={getVariantStyle(settings, option.value)} aria-hidden="true" />
        </button>
      })}
    </div> : (['dark', 'light'] as const).map((group) => <div className="visual-mode-group" key={group}>
      <p>{group === 'dark' ? 'Modo Escuro' : 'Modo Claro'}</p>
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
            onClick={() => setVisualMode(option.value)}
          >
            <span className={`visual-mode-option-preview visual-mode-option-${option.value.replace(/_/g, '-')}${hasImage ? ' has-image' : ''} ${getVariantClassName(settings, option.value)}`} style={getVariantStyle(settings, option.value)} aria-hidden="true">
              {active ? <span className="visual-mode-option-check"><Check size={13} /></span> : null}
            </span>
          </button>
        })}
      </div>
    </div>)}
    <label className="visual-mode-default-option">
      <input type="checkbox" checked={keepVisualModeAsDefault} onChange={(event) => setKeepVisualModeAsDefault(event.target.checked)} />
      <span>Manter como padrão</span>
    </label>
  </section> : null

  return <div className={`visual-mode-selector${compact ? ' visual-mode-selector--compact' : ''}`} ref={containerRef}>
    <button ref={triggerRef} className={`visual-mode-trigger${triggerClassName ? ` ${triggerClassName}` : ''}`} type="button" aria-label={`Escolher visual. Atual: ${activeOption?.label ?? 'Modo Escuro 1'}`} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
      {triggerContent ?? <>
        <span className={`visual-mode-trigger-swatch ${getVariantClassName(settings, visualMode)}`} style={getVariantStyle(settings, visualMode)} aria-hidden="true" />
        {!compact ? <><span>Visual</span><ChevronDown className={open ? 'open' : ''} size={15} aria-hidden="true" /></> : null}
      </>}
    </button>
    {popover && typeof document !== 'undefined' ? createPortal(popover, document.body) : null}
  </div>
}
