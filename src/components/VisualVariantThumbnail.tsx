import { useBrandSettings } from '../contexts/BrandSettingsContext'
import { getVariantClassName, getVariantImage, getVariantStyle, type PublicVisualVariant } from '../lib/cardVisualVariants'

type VisualVariantThumbnailProps = { variant: PublicVisualVariant; selected?: boolean }

export function VisualVariantThumbnail({ variant, selected = false }: VisualVariantThumbnailProps) {
  const { settings } = useBrandSettings()
  const hasImage = Boolean(getVariantImage(settings, variant))
  return <span className={`card-visual-variant-thumbnail ${getVariantClassName(settings, variant)}${hasImage ? ' has-image' : ''}${selected ? ' selected' : ''}`} style={getVariantStyle(settings, variant)} aria-hidden="true" />
}
