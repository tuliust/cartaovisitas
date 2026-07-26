import { useEffect, useRef, useState } from 'react'
import {
  INVEST_EMAIL_DOMAIN,
  parseInvestEmailInput,
} from '../../lib/investEmail'

type InstitutionalEmailFieldProps = {
  id: string
  value: string
  onChange: (value: string) => void
  name?: string
  required?: boolean
  autoComplete?: string
}

export default function InstitutionalEmailField({
  id,
  value,
  onChange,
  name = 'username',
  required = true,
  autoComplete = 'username',
}: InstitutionalEmailFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const domainDescriptionId = `${id}-domain`
  const errorId = `${id}-error`

  useEffect(() => {
    if (!value) {
      setError('')
      inputRef.current?.setCustomValidity('')
    }
  }, [value])

  return (
    <div className="auth-form-field institutional-email-field">
      <label htmlFor={id}>E-mail institucional</label>
      <span className="email-suffix-field">
        <input
          ref={inputRef}
          required={required}
          id={id}
          name={name}
          type="text"
          inputMode="email"
          autoComplete={autoComplete}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          aria-describedby={`${domainDescriptionId}${error ? ` ${errorId}` : ''}`}
          aria-invalid={error ? true : undefined}
          onChange={(event) => {
            const parsed = parseInvestEmailInput(event.target.value)
            onChange(parsed.prefix)
            setError(parsed.error)
            event.currentTarget.setCustomValidity(parsed.error)
          }}
          placeholder="seu.nome"
        />
        <span id={domainDescriptionId} className="email-suffix-label">
          {INVEST_EMAIL_DOMAIN}
        </span>
      </span>
      {error ? (
        <small id={errorId} className="auth-inline-error" role="alert">
          {error}
        </small>
      ) : null}
    </div>
  )
}
