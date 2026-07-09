import { useEffect, useState, type FormEvent } from 'react'
import { type CardFormValues, normalizeSlug } from '../../lib/adminCards'

type CardFormProps = {
  initialValues: CardFormValues
  submitLabel: string
  loading?: boolean
  onSubmit: (values: CardFormValues) => Promise<void> | void
}

export default function CardForm({
  initialValues,
  submitLabel,
  loading = false,
  onSubmit,
}: CardFormProps) {
  const [values, setValues] = useState<CardFormValues>(initialValues)

  useEffect(() => {
    setValues(initialValues)
  }, [initialValues])

  function updateField<K extends keyof CardFormValues>(field: K, value: CardFormValues[K]) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSubmit({
      ...values,
      slug: normalizeSlug(values.slug),
    })
  }

  const requiredMissing = !values.full_name.trim() || !values.slug.trim()

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <section className="admin-form-section">
        <h2>Identificação</h2>

        <label>
          Nome completo *
          <input
            required
            value={values.full_name}
            onChange={(event) => updateField('full_name', event.target.value)}
            placeholder="Alexandre Elmi"
          />
        </label>

        <label>
          Nome de exibição
          <input
            value={values.display_name}
            onChange={(event) => updateField('display_name', event.target.value)}
            placeholder="Alexandre Elmi"
          />
        </label>

        <div className="admin-field-with-action">
          <label>
            Slug da página *
            <input
              required
              value={values.slug}
              onChange={(event) => updateField('slug', normalizeSlug(event.target.value))}
              placeholder="alexandre-elmi"
            />
          </label>

          <button
            type="button"
            className="secondary-button compact-button"
            onClick={() => updateField('slug', normalizeSlug(values.full_name))}
          >
            Gerar slug
          </button>
        </div>

        <label>
          Status
          <select
            value={values.is_active ? 'true' : 'false'}
            onChange={(event) => updateField('is_active', event.target.value === 'true')}
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </label>
      </section>

      <section className="admin-form-section">
        <h2>Dados profissionais</h2>

        <label>
          Cargo
          <input
            value={values.job_title}
            onChange={(event) => updateField('job_title', event.target.value)}
            placeholder="Executive Communication Advisor"
          />
        </label>

        <label>
          Área/departamento
          <input
            value={values.department}
            onChange={(event) => updateField('department', event.target.value)}
            placeholder="Communication"
          />
        </label>

        <label>
          Empresa
          <input
            value={values.company}
            onChange={(event) => updateField('company', event.target.value)}
            placeholder="Invest RS"
          />
        </label>
      </section>

      <section className="admin-form-section">
        <h2>Contato</h2>

        <label>
          Celular
          <input
            value={values.mobile_phone}
            onChange={(event) => updateField('mobile_phone', event.target.value)}
            placeholder="+55 51 99999-9999"
          />
        </label>

        <label>
          Telefone comercial
          <input
            value={values.work_phone}
            onChange={(event) => updateField('work_phone', event.target.value)}
            placeholder="+55 51 2630-0300"
          />
        </label>

        <label>
          E-mail
          <input
            type="email"
            value={values.email}
            onChange={(event) => updateField('email', event.target.value)}
            placeholder="nome.sobrenome@investrs.org.br"
          />
        </label>

        <label>
          Site
          <input
            type="url"
            value={values.website}
            onChange={(event) => updateField('website', event.target.value)}
            placeholder="https://investrs.org.br"
          />
        </label>
      </section>

      <section className="admin-form-section">
        <h2>Endereço</h2>

        <label>
          Endereço
          <input
            value={values.address_line}
            onChange={(event) => updateField('address_line', event.target.value)}
            placeholder="Av. Dolores Alcaraz Caldas, 90"
          />
        </label>

        <div className="admin-form-grid">
          <label>
            Cidade
            <input value={values.city} onChange={(event) => updateField('city', event.target.value)} />
          </label>

          <label>
            Estado
            <input value={values.state} onChange={(event) => updateField('state', event.target.value)} />
          </label>

          <label>
            País
            <input
              value={values.country}
              onChange={(event) => updateField('country', event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="admin-form-section">
        <h2>Links e imagem</h2>

        <label>
          LinkedIn
          <input
            type="url"
            value={values.linkedin_url}
            onChange={(event) => updateField('linkedin_url', event.target.value)}
            placeholder="https://www.linkedin.com/in/..."
          />
        </label>

        <label>
          Instagram
          <input
            type="url"
            value={values.instagram_url}
            onChange={(event) => updateField('instagram_url', event.target.value)}
            placeholder="https://www.instagram.com/..."
          />
        </label>

        <label>
          URL da foto/avatar
          <input
            type="url"
            value={values.avatar_url}
            onChange={(event) => updateField('avatar_url', event.target.value)}
            placeholder="https://..."
          />
        </label>

        <label>
          URL do logo
          <input
            type="url"
            value={values.logo_url}
            onChange={(event) => updateField('logo_url', event.target.value)}
            placeholder="https://..."
          />
        </label>
      </section>

      <div className="admin-form-actions">
        <button className="primary-button" type="submit" disabled={loading || requiredMissing}>
          {loading ? 'Salvando...' : submitLabel}
        </button>
      </div>
    </form>
  )
}