import { useState, type FormEvent } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { updatePassword } from '../lib/auth'
import { getFriendlyErrorMessage } from '../lib/errors'
import { useBrandSettings } from '../contexts/BrandSettingsContext'
import { useVisualMode } from '../contexts/VisualModeContext'
import { getVariantLogo } from '../lib/cardVisualVariants'
import { useToast } from '../contexts/ToastContext'

export default function PasswordUpdatePage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { settings } = useBrandSettings()
  const { visualMode } = useVisualMode()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()

    if (password !== confirm) {
      toast.error('As senhas não coincidem.')
      return
    }

    if (password.length < 6) {
      toast.error('Use uma senha mais segura.')
      return
    }

    setLoading(true)

    try {
      await updatePassword(password)
      toast.success('Senha redefinida com sucesso.')
      navigate('/meu-cartao', { replace: true })
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-login-shell auth-page-shell">
      <section className="admin-login-card auth-page-card">
        <img
          className="auth-logo auth-page-logo"
          src={getVariantLogo(settings, visualMode)}
          alt="Invest RS"
        />

        <h1 className="auth-page-title">Definir senha</h1>
        <p className="auth-page-description">Escolha sua nova senha de acesso.</p>

        <form className="auth-page-form" onSubmit={submit}>
          <div className="auth-form-field">
            <label htmlFor="password-update-new">Nova senha</label>
            <span className="password-input-field">
              <input
                required
                id="password-update-new"
                name="password"
                minLength={6}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                className="password-visibility-button"
                type="button"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                aria-pressed={showPassword}
                title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </button>
            </span>
          </div>

          <div className="auth-form-field">
            <label htmlFor="password-update-confirm">Confirmar nova senha</label>
            <span className="password-input-field">
              <input
                required
                id="password-update-confirm"
                name="password-confirmation"
                minLength={6}
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
              />
              <button
                className="password-visibility-button"
                type="button"
                aria-label={showConfirmPassword ? 'Ocultar senha' : 'Exibir senha'}
                aria-pressed={showConfirmPassword}
                title={showConfirmPassword ? 'Ocultar senha' : 'Exibir senha'}
                onClick={() => setShowConfirmPassword((current) => !current)}
              >
                {showConfirmPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </button>
            </span>
          </div>

          <button className="primary-button auth-page-submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Definir nova senha'}
          </button>
        </form>

        <div className="auth-links auth-page-links">
          <Link to="/entrar">Voltar</Link>
        </div>
      </section>
    </main>
  )
}
