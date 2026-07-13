import { publicVisualVariantOptions, type PublicVisualVariant } from '../../lib/cardVisualVariants'
import { VisualVariantThumbnail } from '../VisualVariantThumbnail'

type CardVisualVariantPickerProps = { value: PublicVisualVariant; onChange: (value: PublicVisualVariant) => void }

export function CardVisualVariantPicker({ value, onChange }: CardVisualVariantPickerProps) {
  return <div className="card-visual-variant-picker">
    {(['dark', 'light'] as const).map((group) => <section key={group} aria-labelledby={`card-variant-${group}`}>
      <h3 id={`card-variant-${group}`}>{group === 'dark' ? 'Modo Escuro' : 'Modo Claro'}</h3>
      <div className="card-visual-variant-grid">
        {publicVisualVariantOptions.filter((option) => option.value.startsWith(`${group}_`)).map((option) => <button key={option.value} type="button" className={value === option.value ? 'active' : ''} aria-label={`Selecionar visual: ${option.label}`} aria-pressed={value === option.value} title={option.label} onClick={() => onChange(option.value)}>
          <VisualVariantThumbnail variant={option.value} selected={value === option.value} />
          <span>{option.label}</span>
        </button>)}
      </div>
    </section>)}
  </div>
}
