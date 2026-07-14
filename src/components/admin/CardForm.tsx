import { Check, Crop, ImagePlus, LoaderCircle, Trash2, Upload, X } from 'lucide-react'
import { useEffect, useRef, useState, type DragEvent, type FormEvent, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { type CardFormValues, normalizeSlug } from '../../lib/adminCards'
import { getFriendlyErrorMessage } from '../../lib/errors'
import { buildInvestEmail, getInvestEmailPrefix, INVEST_EMAIL_DOMAIN, normalizeInvestEmailInput } from '../../lib/investEmail'
import { formatBrazilianPhone } from '../../lib/phone'
import { buildInstagramUrl, buildLinkedinUrl, getInstagramProfile, getLinkedinProfile } from '../../lib/socialLinks'
import { uploadCardAvatar, uploadCardLogo, validateAvatarFile } from '../../lib/storage'
import { checkSlugAvailability } from '../../lib/cardsValidation'
import ImageCropModal from './ImageCropModal'
import { useToast } from '../../contexts/ToastContext'
import { useBrandSettings } from '../../contexts/BrandSettingsContext'
import { getVariantImage } from '../../lib/cardVisualVariants'
import { CardVisualVariantPicker } from './CardVisualVariantPicker'

type Language = 'pt' | 'es' | 'en'
type CardFormProps = {
  initialValues: CardFormValues
  submitLabel: string
  loading?: boolean
  onChange?: (values: CardFormValues) => void
  onSubmit: (values: CardFormValues) => Promise<void> | void
  mode?: 'admin' | 'employee'
  lockedEmail?: string
  allowStatusEdit?: boolean
  allowLogoUpload?: boolean
  allowAvatarUpload?: boolean
  lockInstitutionalFields?: boolean
  currentCardId?: string
  onPreview?: () => void
  previewButtonRef?: RefObject<HTMLButtonElement | null>
  formId?: string
  autoGenerateSlug?: boolean
  desktopActionsTarget?: HTMLElement | null
}

type SlugAvailability = 'idle' | 'checking' | 'available' | 'unavailable' | 'error'
const COLLABORATOR_PAGE_DISPLAY_BASE = 'investrs.org.br/rs-em-dados/usuario/'

const languageLabels: Record<Language, string> = { pt: 'PT', es: 'ES', en: 'EN' }

function buildSlugFromName(fullName: string) {
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean)
  if (nameParts.length === 0) return ''
  const firstName = nameParts[0]
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
  return normalizeSlug([firstName, lastName].filter(Boolean).join('-'))
}

export default function CardForm({
  initialValues,
  submitLabel,
  loading = false,
  onChange,
  onSubmit,
  mode = 'admin',
  lockedEmail,
  allowStatusEdit = mode === 'admin',
  allowLogoUpload = mode === 'admin',
  allowAvatarUpload = true,
  lockInstitutionalFields = mode === 'employee',
  currentCardId,
  onPreview,
  previewButtonRef,
  formId,
  autoGenerateSlug = false,
  desktopActionsTarget,
}: CardFormProps) {
  const toast = useToast()
  const { settings } = useBrandSettings()
  const [values, setValues] = useState<CardFormValues>(initialValues)
  const [language, setLanguage] = useState<Language>('pt')
  const [uploading, setUploading] = useState<'avatar' | 'logo' | ''>('')
  const [uploadError, setUploadError] = useState('')
  const [avatarToCrop, setAvatarToCrop] = useState<File | string | null>(null)
  const [avatarDragActive, setAvatarDragActive] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!autoGenerateSlug)
  const [slugAvailability, setSlugAvailability] = useState<SlugAvailability>(initialValues.slug ? 'checking' : 'idle')
  const [slugValidationError, setSlugValidationError] = useState('')
  const [validatingSlugOnSubmit, setValidatingSlugOnSubmit] = useState(false)

  useEffect(() => { onChange?.(values) }, [onChange, values])

  useEffect(() => {
    const slug = normalizeSlug(values.slug)
    if (!slug) return

    let cancelled = false

    const timer = window.setTimeout(() => {
      void checkSlugAvailability(slug, currentCardId)
        .then((available) => {
          if (!cancelled) setSlugAvailability(available ? 'available' : 'unavailable')
        })
        .catch((error) => {
          if (!cancelled) {
            setSlugAvailability('error')
            const message = getFriendlyErrorMessage(error)
            setSlugValidationError(message)
            toast.error(message)
          }
        })
    }, 500)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [currentCardId, toast, values.slug])

  function updateField<K extends keyof CardFormValues>(field: K, value: CardFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function updateSlug(value: string) {
    const slug = normalizeSlug(value)
    updateField('slug', slug)
    setSlugAvailability(slug ? 'checking' : 'idle')
    setSlugValidationError('')
  }

  function updateFullName(value: string) {
    const generatedSlug = autoGenerateSlug && !slugManuallyEdited ? buildSlugFromName(value) : null
    setValues((current) => ({
      ...current,
      full_name: value,
      ...(generatedSlug !== null ? { slug: generatedSlug } : {}),
    }))
    if (generatedSlug !== null) {
      setSlugAvailability(generatedSlug ? 'checking' : 'idle')
      setSlugValidationError('')
    }
  }

  function editSlug(value: string) {
    setSlugManuallyEdited(true)
    updateSlug(value)
  }

  function updateLocalizedField(kind: 'job_title' | 'department', value: string) {
    const localizedField = `${kind}_${language}` as keyof CardFormValues
    setValues((current) => ({
      ...current,
      [localizedField]: value,
      ...(language === 'pt' ? { [kind]: value } : {}),
    }))
  }

  async function uploadImage(kind: 'avatar' | 'logo', file: File) {
    setUploading(kind); setUploadError('')
    try {
      const slug = normalizeSlug(values.slug || values.full_name)
      const url = kind === 'avatar' ? await uploadCardAvatar(file, slug) : await uploadCardLogo(file, slug)
      updateField(kind === 'avatar' ? 'avatar_url' : 'logo_url', url)
      setAvatarToCrop(null)
      toast.success(kind === 'avatar' ? 'Foto enviada com sucesso.' : 'Logo enviado com sucesso.')
      return true
    } catch (err) {
      const message = getFriendlyErrorMessage(err)
      setUploadError(message)
      toast.error(message)
      return false
    } finally { setUploading('') }
  }

  function selectAvatar(file?: File) {
    if (!file) return
    try {
      validateAvatarFile(file)
      if (mode === 'employee') setAvatarToCrop(file)
      else void uploadImage('avatar', file)
    } catch (err) { const message = getFriendlyErrorMessage(err); setUploadError(message); toast.error(message) }
  }

  function handleAvatarDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setAvatarDragActive(false)
    selectAvatar(event.dataTransfer.files?.[0])
  }

  function openAvatarFilePicker() {
    avatarInputRef.current?.click()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const slug = normalizeSlug(values.slug)
    setValidatingSlugOnSubmit(true)
    setSlugAvailability('checking')
    setSlugValidationError('')

    try {
      const available = await checkSlugAvailability(slug, currentCardId)
      setSlugAvailability(available ? 'available' : 'unavailable')
      if (!available) { toast.error('Este slug já está em uso. Escolha outro endereço.'); return }

      await onSubmit({ ...values, slug, job_title: values.job_title_pt || values.job_title, department: values.department_pt || values.department })
    } catch (error) {
      setSlugAvailability('error')
      const message = getFriendlyErrorMessage(error)
      setSlugValidationError(message)
      toast.error(message)
    } finally {
      setValidatingSlugOnSubmit(false)
    }
  }

  const localizedJob = values[`job_title_${language}`]
  const localizedDepartment = values[`department_${language}`]
  const requiredMissing = !values.full_name.trim() || !values.slug.trim()
  const submitDisabled = loading || validatingSlugOnSubmit || Boolean(uploading) || requiredMissing || slugAvailability === 'unavailable'
  const submitText = validatingSlugOnSubmit ? 'Verificando...' : loading ? 'Salvando...' : submitLabel
  const slugStatusText = slugAvailability === 'checking'
    ? 'Verificando disponibilidade.'
    : slugAvailability === 'available'
      ? 'Link disponível.'
      : slugAvailability === 'unavailable'
        ? 'Link já utilizado.'
        : slugAvailability === 'error'
          ? slugValidationError
          : ''
  const institutionalFieldClass = lockInstitutionalFields ? 'institutional-field' : undefined

  return <>
    <form id={formId} className={`admin-form admin-card-form${mode === 'employee' ? ' employee-card-form' : ''}`} aria-busy={loading || validatingSlugOnSubmit || Boolean(uploading)} onSubmit={handleSubmit}>
      <section className="admin-form-section admin-card-form-section">
        <h2>Identificação</h2>
        <label>Nome completo *<input required value={values.full_name} onChange={(event) => updateFullName(event.target.value)} placeholder="Alexandre Elmi" /></label>
        <label>Nome de exibição<input value={values.display_name} onChange={(event) => updateField('display_name', event.target.value)} placeholder="Alexandre Elmi" /></label>
        {mode === 'employee' ? <label>Link da página *<span className={`slug-input-field slug-input-field--${slugAvailability}`}><input required value={values.slug} onChange={(event) => editSlug(event.target.value)} placeholder="alexandre-elmi" aria-describedby="slug-help slug-availability" aria-invalid={slugAvailability === 'unavailable' || slugAvailability === 'error'} />{slugAvailability !== 'idle' ? <span className="slug-input-status-icon" aria-hidden="true">{slugAvailability === 'checking' ? <LoaderCircle className="spin" /> : slugAvailability === 'available' ? <Check /> : <X />}</span> : null}</span><small className="field-help slug-preview" id="slug-help">Sua página será: <span>{COLLABORATOR_PAGE_DISPLAY_BASE}{values.slug || ':slug'}</span></small><small className="sr-only" id="slug-availability" aria-live="polite" role="status">{slugStatusText}</small></label> : <div className="admin-field-with-action">
          <label>Slug da página *<input required value={values.slug} onChange={(event) => updateSlug(event.target.value)} placeholder="alexandre-elmi" aria-describedby="slug-help slug-availability" aria-invalid={slugAvailability === 'unavailable' || slugAvailability === 'error'} /><small className="field-help slug-preview" id="slug-help">Sua página será: <span>{COLLABORATOR_PAGE_DISPLAY_BASE}{values.slug || ':slug'}</span></small><small className={`slug-status slug-status--${slugAvailability}`} id="slug-availability" aria-live="polite" role="status">{slugAvailability === 'checking' ? 'Verificando disponibilidade...' : slugAvailability === 'available' ? 'Endereço disponível.' : slugAvailability === 'unavailable' ? 'Endereço já utilizado.' : slugAvailability === 'error' ? slugValidationError : ''}</small></label>
          <button type="button" className="secondary-button compact-button" onClick={() => updateSlug(values.full_name)}>Gerar slug</button>
        </div>}
        {allowStatusEdit ? <label>Status<select value={values.is_active ? 'true' : 'false'} onChange={(event) => updateField('is_active', event.target.value === 'true')}><option value="true">Ativo</option><option value="false">Inativo</option></select></label> : null}
      </section>

      <section className="admin-form-section admin-card-form-section">
        <h2>Visual do cartão</h2>
        <p className="field-help">{mode === 'employee' ? 'Escolha entre os modelos claros ou escuros. Você poderá alterar as cores depois.' : 'Escolha uma das seis variações institucionais aprovadas.'}</p>
        <CardVisualVariantPicker value={values.public_visual_variant} onChange={(variant) => updateField('public_visual_variant', variant)} />
        {values.public_visual_variant.includes('image') && !getVariantImage(settings, values.public_visual_variant) ? <p className="visual-variant-warning">Imagem institucional ainda não configurada. Será usado o fallback.</p> : null}
      </section>

      <section className="admin-form-section admin-card-form-section">
        <div className="form-section-heading"><h2>Dados profissionais</h2>{mode === 'employee' ? <div className="language-toggle" aria-label="Idioma dos dados profissionais">{(['pt', 'es', 'en'] as const).map((item) => <button key={item} type="button" className={language === item ? 'active' : ''} aria-pressed={language === item} onClick={() => setLanguage(item)}>{languageLabels[item]}</button>)}</div> : null}</div>
        {mode === 'employee' ? <><p className="field-help">Informe o cargo e a área, depois preencha em outros idiomas, clicando nos botões acima.</p><label>Cargo ({languageLabels[language]})<input value={localizedJob} onChange={(event) => updateLocalizedField('job_title', event.target.value)} placeholder={language === 'pt' ? 'Assessor de Comunicação' : language === 'es' ? 'Asesor de Comunicación' : 'Communication Advisor'} /></label><label>Área/departamento ({languageLabels[language]})<input value={localizedDepartment} onChange={(event) => updateLocalizedField('department', event.target.value)} placeholder={language === 'pt' ? 'Comunicação' : language === 'es' ? 'Comunicación' : 'Communication'} /></label></> : <><label>Cargo<input value={values.job_title} onChange={(event) => setValues((current) => ({ ...current, job_title: event.target.value, job_title_pt: event.target.value }))} /></label><label>Área/departamento<input value={values.department} onChange={(event) => setValues((current) => ({ ...current, department: event.target.value, department_pt: event.target.value }))} /></label></>}
        <label className={institutionalFieldClass}>Empresa<input value={values.company} onChange={(event) => updateField('company', event.target.value)} disabled={lockInstitutionalFields} /></label>
      </section>

      <section className="admin-form-section admin-card-form-section">
        <h2>Contato</h2>
        <label>Celular<input inputMode="numeric" value={values.mobile_phone} onChange={(event) => updateField('mobile_phone', formatBrazilianPhone(event.target.value))} placeholder="+55 51 99999-9999" /></label>
        <label className={institutionalFieldClass}>Telefone comercial<input inputMode="numeric" value={values.work_phone} onChange={(event) => updateField('work_phone', formatBrazilianPhone(event.target.value))} disabled={lockInstitutionalFields} /></label>
        <label>E-mail<span className="email-suffix-field"><input className="email-suffix-input" value={getInvestEmailPrefix(values.email)} onChange={(event) => updateField('email', buildInvestEmail(normalizeInvestEmailInput(event.target.value)))} disabled={Boolean(lockedEmail)} /><span className="email-suffix-label">{INVEST_EMAIL_DOMAIN}</span></span></label>
        <label className={institutionalFieldClass}>Site<input type="url" value={values.website} onChange={(event) => updateField('website', event.target.value)} placeholder="https://investrs.org.br" disabled={lockInstitutionalFields} /></label>
      </section>

      <section className="admin-form-section admin-card-form-section">
        <h2>Endereço institucional</h2>
        <label className={institutionalFieldClass}>Endereço<input value={values.address_line} onChange={(event) => updateField('address_line', event.target.value)} disabled={lockInstitutionalFields} /></label>
        <div className="admin-form-grid"><label className={institutionalFieldClass}>Cidade<input value={values.city} onChange={(event) => updateField('city', event.target.value)} disabled={lockInstitutionalFields} /></label><label className={institutionalFieldClass}>Estado<input value={values.state} onChange={(event) => updateField('state', event.target.value)} disabled={lockInstitutionalFields} /></label><label className={institutionalFieldClass}>País<input value={values.country} onChange={(event) => updateField('country', event.target.value)} disabled={lockInstitutionalFields} /></label></div>
      </section>

      <section className="admin-form-section admin-card-form-section">
        <h2>Links e foto</h2>
        {mode === 'employee' ? <><label>LinkedIn<span className="url-prefix-field"><span className="url-prefix-label">linkedin.com/in/</span><input className="url-prefix-input" value={getLinkedinProfile(values.linkedin_url)} onChange={(event) => updateField('linkedin_url', buildLinkedinUrl(event.target.value))} placeholder="seu-perfil" /></span></label><label>Instagram<span className="url-prefix-field"><span className="url-prefix-label">instagram.com/</span><input className="url-prefix-input" value={getInstagramProfile(values.instagram_url)} onChange={(event) => updateField('instagram_url', buildInstagramUrl(event.target.value))} placeholder="seu.perfil" /></span></label></> : <><label>LinkedIn<input type="url" value={values.linkedin_url} onChange={(event) => updateField('linkedin_url', event.target.value)} /></label><label>Instagram<input type="url" value={values.instagram_url} onChange={(event) => updateField('instagram_url', event.target.value)} /></label></>}
        {mode === 'admin' ? <label>URL da foto/avatar<input type="url" value={values.avatar_url} onChange={(event) => updateField('avatar_url', event.target.value)} /></label> : null}
        {allowAvatarUpload && mode === 'employee' ? <div className={`avatar-editor${avatarDragActive ? ' is-dragging' : ''}`} onDragEnter={(event) => { event.preventDefault(); setAvatarDragActive(true) }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setAvatarDragActive(false) }} onDrop={handleAvatarDrop}>
          <span className="avatar-editor-label">Enviar foto</span>
          <input ref={avatarInputRef} className="avatar-file-input" type="file" hidden tabIndex={-1} accept="image/png,image/jpeg,image/webp" onChange={(event) => { selectAvatar(event.target.files?.[0]); event.target.value = '' }} />
          {values.avatar_url ? <div className="avatar-photo-stage" role="group" tabIndex={0} aria-label="Foto atual. Use Tab para acessar as ações da foto.">
            <img src={values.avatar_url} alt="Prévia da foto" />
            <div className="avatar-photo-actions" role="group" aria-label="Ações da foto">
              <button type="button" aria-label="Remover foto" title="Remover" onClick={() => updateField('avatar_url', '')}><Trash2 aria-hidden="true" /></button>
              <button type="button" aria-label="Alterar foto" title="Alterar" onClick={openAvatarFilePicker}><ImagePlus aria-hidden="true" /></button>
              <button type="button" aria-label="Reposicionar e ajustar zoom da foto" title="Reposicionar e ajustar zoom" onClick={() => setAvatarToCrop(values.avatar_url)}><Crop aria-hidden="true" /></button>
            </div>
          </div> : <button className="avatar-upload-empty" type="button" onClick={openAvatarFilePicker}><Upload aria-hidden="true" /><span>Upload</span><small>ou arraste a fotografia para esta área</small></button>}
        </div> : null}
        {allowAvatarUpload && mode === 'admin' ? <label>Enviar foto<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => selectAvatar(event.target.files?.[0])} /></label> : null}
        <label className="admin-checkbox-field"><input type="checkbox" checked={values.show_avatar_public} onChange={(event) => updateField('show_avatar_public', event.target.checked)} /><span>Exibir foto no cartão público</span></label>
        {mode === 'admin' && values.avatar_url ? <img className="asset-preview" src={values.avatar_url} alt="Prévia do avatar" /> : null}
        {allowLogoUpload ? <><label>URL do logo<input type="url" value={values.logo_url} onChange={(event) => updateField('logo_url', event.target.value)} /></label><label>Enviar logo<input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage('logo', file) }} /></label>{values.logo_url ? <img className="asset-preview logo" src={values.logo_url} alt="Prévia do logo" /> : null}</> : null}
        {uploading ? <p className="admin-muted">Enviando {uploading === 'avatar' ? 'foto' : 'logo'}...</p> : null}{uploadError ? <p className="admin-error">{uploadError}</p> : null}
      </section>
      <div className="admin-form-actions admin-card-form-actions"><button className="primary-button" type="submit" disabled={submitDisabled}>{submitText}</button>{onPreview ? <button className="secondary-button mobile-preview-button" type="button" onClick={onPreview} ref={previewButtonRef}>Ver Preview</button> : null}</div>
    </form>
    {desktopActionsTarget && formId ? createPortal(<div className="desktop-card-save-actions"><button className="primary-button" type="submit" form={formId} disabled={submitDisabled}>{submitText}</button></div>, desktopActionsTarget) : null}
    {avatarToCrop ? <ImageCropModal image={avatarToCrop} onCancel={() => setAvatarToCrop(null)} onConfirm={async (file) => { if (!(await uploadImage('avatar', file))) throw new Error('Não foi possível enviar a foto. Tente novamente.') }} /> : null}
  </>
}
