import type { CardFormValues } from '../../lib/adminCards'
import { useBrandSettings } from '../../contexts/BrandSettingsContext'
import { getVariantClassName, getVariantLogo, getVariantStyle } from '../../lib/cardVisualVariants'

type CardPreviewProps = {
  values: CardFormValues
}

function buildAddress(values: CardFormValues) {
  return [values.address_line, values.city, values.state, values.country].filter(Boolean).join(', ')
}

export default function CardPreview({ values }: CardPreviewProps) {
  const { settings } = useBrandSettings()
  const name = values.display_name || values.full_name || 'Nome completo'
  const phone = values.mobile_phone || values.work_phone
  const address = buildAddress(values)
  const logoUrl = getVariantLogo(settings, values.public_visual_variant, values.logo_url)

  return (
    <aside className={`card-preview card-preview--responsive ${getVariantClassName(settings, values.public_visual_variant)}`} style={getVariantStyle(settings, values.public_visual_variant)} aria-label="Prévia do cartão">
      <div className="card-preview-top">
        <img className="public-card-logo card-preview-logo" src={logoUrl} alt="Invest RS" />
        <div className="card-preview-top-actions">
          {values.show_avatar_public && values.avatar_url ? <div className="public-card-avatar-wrapper preview"><img className="public-card-avatar" src={values.avatar_url} alt={`Foto de ${name}`} /></div> : null}
          <span className={values.is_active ? 'status-pill active' : 'status-pill inactive'}>
            {values.is_active ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>

      <div className="card-preview-person">
        <p className="label">Contato institucional</p>
        <h2>{name}</h2>
        {values.job_title ? <p>{values.job_title}</p> : null}
        {values.department ? <p>{values.department}</p> : null}
      </div>

      <div className="card-preview-footer">
        <div className="contact-list card-preview-contact-list">
          {phone ? (
            <p>
              <span>Telefone</span>
              {phone}
            </p>
          ) : null}
          {values.email ? (
            <p>
              <span>E-mail</span>
              {values.email}
            </p>
          ) : null}
          {values.website ? (
            <p>
              <span>Site</span>
              {values.website.replace(/^https?:\/\//, '')}
            </p>
          ) : null}
          {address ? (
            <p>
              <span>Endereço</span>
              {address}
            </p>
          ) : null}
        </div>

        <div className="card-preview-qr" aria-label="QR Code">
          QR
        </div>
      </div>
    </aside>
  )
}
