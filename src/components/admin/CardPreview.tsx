import type { CardFormValues } from '../../lib/adminCards'

type CardPreviewProps = {
  values: CardFormValues
}

function buildAddress(values: CardFormValues) {
  return [values.address_line, values.city, values.state, values.country].filter(Boolean).join(', ')
}

export default function CardPreview({ values }: CardPreviewProps) {
  const name = values.display_name || values.full_name || 'Nome completo'
  const phone = values.mobile_phone || values.work_phone
  const address = buildAddress(values)
  const logoUrl = values.logo_url || '/invest-rs-logo.png'

  return (
    <aside className="card-preview" aria-label="Prévia do cartão">
      <div className="card-preview-top">
        <img className="card-preview-logo" src={logoUrl} alt="Invest RS" />
        <span className={values.is_active ? 'status-pill active' : 'status-pill inactive'}>
          {values.is_active ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      <div className="card-preview-person">
        <p className="label">Contato institucional</p>
        <h2>{name}</h2>
        {values.job_title ? <p>{values.job_title}</p> : null}
        {values.department ? <p>{values.department}</p> : null}
      </div>

      <div className="card-preview-footer">
        <div className="contact-list">
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
