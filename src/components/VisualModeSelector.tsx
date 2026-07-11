import { Aperture } from 'lucide-react'
import { useRef, type KeyboardEvent } from 'react'
import { useBrandSettings } from '../contexts/BrandSettingsContext'
import { useVisualMode } from '../contexts/VisualModeContext'
import { getVariantClassName, getVariantImage, getVariantStyle } from '../lib/cardVisualVariants'

export default function VisualModeSelector() {
  const { settings } = useBrandSettings()
  const { visualMode, setVisualMode, visualModeOptions } = useVisualMode()
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const lastIndex = visualModeOptions.length - 1
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? lastIndex
        : event.key === 'ArrowRight' || event.key === 'ArrowDown'
          ? (index + 1) % visualModeOptions.length
          : (index - 1 + visualModeOptions.length) % visualModeOptions.length
    const nextOption = visualModeOptions[nextIndex]
    setVisualMode(nextOption.value)
    optionRefs.current[nextIndex]?.focus()
  }

  return <div className="visual-mode-selector" role="radiogroup" aria-label="Escolha o fundo visual">
    <div className="visual-mode-wheel">
      {visualModeOptions.map((option, index) => {
        const hasImage = Boolean(getVariantImage(settings, option.value))
        return <button
          className={`visual-mode-segment visual-mode-option-${option.value.replace(/_/g, '-')}${hasImage ? ' has-image' : ''} ${getVariantClassName(settings, option.value)}${visualMode === option.value ? ' active' : ''}`}
          style={getVariantStyle(settings, option.value)}
          type="button"
          role="radio"
          aria-checked={visualMode === option.value}
          aria-label={`Usar fundo: ${option.label}`}
          title={option.label}
          key={option.value}
          ref={(element) => { optionRefs.current[index] = element }}
          onClick={() => setVisualMode(option.value)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        />
      })}
      <span className="visual-mode-wheel-center" aria-hidden="true"><Aperture size={22} /></span>
    </div>
    <span className="sr-only" aria-live="polite">Fundo ativo: {visualModeOptions.find(({ value }) => value === visualMode)?.label}</span>
  </div>
}
