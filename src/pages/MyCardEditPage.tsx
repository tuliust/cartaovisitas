import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CardForm from '../components/admin/CardForm'
import CardPreview from '../components/admin/CardPreview'
import { getCurrentSession, signOut } from '../lib/auth'
import { defaultCardFormValues, toCardFormValues, type CardFormValues } from '../lib/adminCards'
import { getFriendlyErrorMessage } from '../lib/errors'
import { createMyCardDraft, getMyCard, upsertMyCard } from '../lib/myCard'

export default function MyCardEditPage() {
  const navigate = useNavigate(); const [booting, setBooting] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState(''); const [savedSlug, setSavedSlug] = useState('')
  const [values, setValues] = useState<CardFormValues>({ ...defaultCardFormValues }); const [preview, setPreview] = useState<CardFormValues>({ ...defaultCardFormValues })
  useEffect(() => { void (async () => { const session = await getCurrentSession(); if (!session) return navigate('/entrar', { replace: true }); const card = await getMyCard(); const initial = card ? toCardFormValues(card) : await createMyCardDraft(); setValues(initial); setPreview(initial); setSavedSlug(card?.slug ?? ''); setBooting(false) })().catch((err) => { setError(getFriendlyErrorMessage(err)); setBooting(false) }) }, [navigate])
  async function save(form: CardFormValues) { setSaving(true); setError(''); try { const card = await upsertMyCard(form); const current = toCardFormValues(card); setValues(current); setPreview(current); setSavedSlug(card.slug) } catch (err) { setError(getFriendlyErrorMessage(err)) } finally { setSaving(false) } }
  async function logout() { await signOut(); navigate('/entrar', { replace: true }) }
  if (booting) return <main className="admin-login-shell"><div className="admin-login-card">Carregando formulário...</div></main>
  return <main className="admin-shell"><header className="admin-topbar"><Link className="admin-brand" to="/">Invest RS</Link><nav className="admin-nav">{savedSlug ? <Link to={`/${savedSlug}`}>Ver meu cartão</Link> : null}<button onClick={logout}>Sair</button></nav></header><section className="admin-page"><div className="admin-page-header"><div><p className="eyebrow">Área do colaborador</p><h1>Meu cartão</h1><p>Atualize os dados do seu cartão digital.</p></div>{savedSlug ? <Link className="secondary-button" to={`/${savedSlug}`}>Ver meu cartão</Link> : null}</div>{error ? <p className="admin-error">{error}</p> : null}<div className="admin-form-preview-layout"><CardForm initialValues={values} submitLabel="Salvar alterações" loading={saving} onChange={setPreview} onSubmit={save} mode="employee" lockedEmail={values.email} allowStatusEdit={false} /><CardPreview values={preview} /></div></section></main>
}
