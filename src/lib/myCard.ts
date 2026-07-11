import { getCurrentUser } from './auth'
import {
  buildCardPayload,
  defaultCardFormValues,
  normalizeSlug,
  toCardFormValues,
  type AdminBusinessCard,
  type CardFormValues,
} from './adminCards'
import { recordAuditLog } from './audit'
import { getInvestEmailPrefix } from './investEmail'
import { supabase } from './supabase'

const auditableCardFields = Object.keys(defaultCardFormValues) as Array<keyof CardFormValues>

function client() {
  if (!supabase) throw new Error('Supabase não configurado.')
  return supabase
}

async function identity() {
  const user = await getCurrentUser()
  if (!user?.email) throw new Error('Sua sessão expirou. Faça login novamente.')
  return { id: user.id, email: user.email.toLowerCase() }
}

function getChangedCardFields(before: CardFormValues, after: CardFormValues) {
  return auditableCardFields.filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]))
}

export async function getMyCard() {
  const user = await identity()
  const byOwner = await client()
    .from('business_cards')
    .select('*')
    .eq('created_by', user.id)
    .limit(1)
    .maybeSingle()

  if (byOwner.error) throw byOwner.error
  if (byOwner.data) return byOwner.data as AdminBusinessCard

  const byEmail = await client()
    .from('business_cards')
    .select('*')
    .ilike('email', user.email)
    .limit(1)
    .maybeSingle()

  if (byEmail.error) throw byEmail.error
  return byEmail.data as AdminBusinessCard | null
}

export async function createMyCardDraft(): Promise<CardFormValues> {
  const user = await identity()
  const prefix = getInvestEmailPrefix(user.email)

  return {
    ...defaultCardFormValues,
    email: user.email,
    slug: normalizeSlug(prefix),
    company: 'Invest RS',
    website: 'https://investrs.org.br',
    address_line: 'Av. Dolores Alcaraz Caldas, 90',
    city: 'Porto Alegre',
    state: 'RS',
    country: 'Brasil',
    work_phone: '+55 51 2630-0300',
    is_active: true,
  }
}

export function toMyCardFormValues(card: AdminBusinessCard): CardFormValues {
  const values = toCardFormValues(card)

  return {
    ...values,
    job_title_pt: values.job_title_pt || values.job_title,
    department_pt: values.department_pt || values.department,
    address_line: values.address_line || 'Av. Dolores Alcaraz Caldas, 90',
    city: values.city || 'Porto Alegre',
    state: values.state || 'RS',
    country: values.country || 'Brasil',
    work_phone: values.work_phone || '+55 51 2630-0300',
  }
}

export async function upsertMyCard(values: CardFormValues) {
  const user = await identity()
  const existing = await getMyCard()
  const safeValues = {
    ...values,
    email: user.email,
    company: 'Invest RS',
    is_active: existing?.is_active ?? true,
    logo_url: existing?.logo_url ?? '',
    work_phone: existing?.work_phone || '+55 51 2630-0300',
    address_line: existing?.address_line || 'Av. Dolores Alcaraz Caldas, 90',
    city: existing?.city || 'Porto Alegre',
    state: existing?.state || 'RS',
    country: existing?.country || 'Brasil',
    job_title: values.job_title_pt || values.job_title,
    department: values.department_pt || values.department,
  }
  const payload = buildCardPayload(safeValues)

  if (existing) {
    const beforeValues = toMyCardFormValues(existing)
    const { data, error } = await client()
      .from('business_cards')
      .update(payload)
      .eq('id', existing.id)
      .select('*')
      .single()

    if (error) throw error

    const updatedCard = data as AdminBusinessCard
    const afterValues = toMyCardFormValues(updatedCard)
    const changedFields = getChangedCardFields(beforeValues, afterValues)

    if (changedFields.length > 0) {
      const action = changedFields.length === 1 && changedFields[0] === 'avatar_url'
        ? 'profile_photo_updated'
        : 'employee_card_updated'

      await recordAuditLog({
        action,
        targetType: 'business_card',
        targetId: updatedCard.id,
        targetLabel: updatedCard.slug,
        beforeData: beforeValues,
        afterData: afterValues,
        metadata: { changed_fields: changedFields },
      })
    }

    return updatedCard
  }

  const { data, error } = await client()
    .from('business_cards')
    .insert({ ...payload, created_by: user.id, email: user.email })
    .select('*')
    .single()

  if (error) throw error

  const createdCard = data as AdminBusinessCard
  await recordAuditLog({
    action: 'employee_card_created',
    targetType: 'business_card',
    targetId: createdCard.id,
    targetLabel: createdCard.slug,
    afterData: toMyCardFormValues(createdCard),
  })

  return createdCard
}

export async function getMyCardOrCreateDraft() {
  const card = await getMyCard()
  return card ?? createMyCardDraft()
}
