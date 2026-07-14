import type { AdminBusinessCard } from './adminCards'
import type { BrandSettings } from './brandSettings'
import { getLocalizedProfessionalData, type PublicCardLanguage } from './publicCardLocale'

export type EmailSignatureLanguage = PublicCardLanguage
export type EmailSignatureOptions = { department: boolean; phone: boolean; email: boolean; website: boolean; confidentiality: boolean }
export type EmailSignatureContact = { kind: 'phone' | 'email' | 'website' | 'address'; text: string; href: string; iconUrl: string; alt: string }
export type EmailSignatureModel = {
  language: EmailSignatureLanguage
  name: string
  jobTitle: string
  department: string
  logoUrl: string
  qrImageUrl: string
  vcardUrl: string
  contacts: EmailSignatureContact[]
  confidentiality: string
}

export const emailSignatureLanguageLabels: Record<EmailSignatureLanguage, string> = { pt: 'PT', es: 'ES', en: 'EN' }
export const requiredEmailSignatureOptions: EmailSignatureOptions = { department: true, phone: true, email: true, website: true, confidentiality: true }
export const emailSignatureAddress = 'Av. Dolores Alcaraz Caldas, 90 - 8˚ andar - Praia de Belas - Porto Alegre/RS - 90110-180'
export const emailSignatureAddressUrl = 'https://maps.app.goo.gl/iEinqkPpjQzXgerr5'

export const emailSignatureConfidentiality: Record<EmailSignatureLanguage, string> = {
  pt: 'Esta mensagem e seus anexos podem conter informações confidenciais e/ou protegidas pela legislação vigente, incluindo a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD). O conteúdo desta comunicação é de uso exclusivo do destinatário e não deve ser compartilhado com terceiros sem autorização expressa. Se você não for o destinatário correto, fica expressamente proibida qualquer divulgação, distribuição ou reprodução deste e-mail. Caso o tenha recebido por engano, favor notificar o remetente e excluí-lo imediatamente. A Invest RS não se responsabiliza por conclusões, decisões ou ações tomadas com base neste e-mail sem confirmação formal de seu conteúdo.',
  es: 'Este mensaje y sus archivos adjuntos pueden contener información confidencial y/o protegida por la legislación vigente, incluida la Ley General de Protección de Datos Personales de Brasil (Ley n.º 13.709/2018 - LGPD). El contenido de esta comunicación es de uso exclusivo del destinatario y no debe compartirse con terceros sin autorización expresa. Si usted no es el destinatario correcto, queda expresamente prohibida cualquier divulgación, distribución o reproducción de este correo electrónico. Si lo ha recibido por error, le solicitamos que notifique al remitente y lo elimine inmediatamente. Invest RS no se responsabiliza por conclusiones, decisiones o acciones tomadas con base en este correo electrónico sin la confirmación formal de su contenido.',
  en: 'This message and its attachments may contain confidential information and/or information protected by applicable law, including Brazil’s General Data Protection Law (Law No. 13,709/2018 – LGPD). The content of this communication is intended solely for the recipient and must not be shared with third parties without express authorization. If you are not the intended recipient, any disclosure, distribution, or reproduction of this email is expressly prohibited. If you have received it in error, please notify the sender and delete it immediately. Invest RS is not responsible for conclusions, decisions, or actions taken based on this email without formal confirmation of its content.',
}

const iconPaths = { phone: '/email-signature/whatsapp.png', email: '/email-signature/email.png', website: '/email-signature/website.png', address: '/email-signature/address.svg' } as const
const trim = (value: string | null | undefined) => value?.trim() ?? ''
const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character)
const escapeAttribute = escapeHtml

function safeHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : ''
  } catch {
    return ''
  }
}

function publicAssetUrl(value: string, origin: string) {
  try {
    const url = new URL(value, origin)
    return url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname)) ? url.toString() : ''
  } catch {
    return ''
  }
}

function safeSlug(value: string) {
  return /^[a-z0-9-]+$/.test(value) ? value : ''
}

export function buildEmailSignatureModel(
  card: AdminBusinessCard,
  settings: BrandSettings,
  language: EmailSignatureLanguage,
  options: EmailSignatureOptions,
  origin: string,
): EmailSignatureModel {
  const slug = safeSlug(trim(card.slug))
  const normalizedOrigin = origin.replace(/\/$/, '')
  const vcardUrl = slug ? `${normalizedOrigin}/api/vcard/${encodeURIComponent(slug)}?lang=${language}` : ''
  const qrImageUrl = slug ? `${normalizedOrigin}/api/qr-image/${encodeURIComponent(slug)}?lang=${language}` : ''
  const localized = getLocalizedProfessionalData(card, language)
  const phoneText = options.phone ? trim(card.mobile_phone) : ''
  const phoneDigits = phoneText.replace(/\D/g, '')
  const email = options.email ? trim(card.email) : ''
  const website = options.website ? safeHttpUrl(trim(card.website)) : ''
  const addressUrl = safeHttpUrl(emailSignatureAddressUrl)
  const contacts: EmailSignatureContact[] = []

  if (phoneText && phoneDigits) {
    contacts.push({ kind: 'phone', text: phoneText, href: `https://wa.me/${phoneDigits}`, iconUrl: publicAssetUrl(iconPaths.phone, normalizedOrigin), alt: 'WhatsApp' })
  }
  if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    contacts.push({ kind: 'email', text: email, href: `mailto:${email}`, iconUrl: publicAssetUrl(iconPaths.email, normalizedOrigin), alt: 'E-mail' })
  }
  if (website) {
    contacts.push({ kind: 'website', text: website.replace(/\/$/, ''), href: website, iconUrl: publicAssetUrl(iconPaths.website, normalizedOrigin), alt: 'Site' })
  }
  if (addressUrl) {
    contacts.push({ kind: 'address', text: emailSignatureAddress, href: addressUrl, iconUrl: publicAssetUrl(iconPaths.address, normalizedOrigin), alt: 'Endereço' })
  }

  const configuredLogo = trim(settings.logo_on_light_url) || trim(settings.logo_on_dark_url) || trim(settings.logo_url) || '/invest-rs-logo.png'

  return {
    language,
    name: trim(card.display_name) || trim(card.full_name),
    jobTitle: trim(localized.jobTitle),
    department: options.department ? trim(localized.department) : '',
    logoUrl: publicAssetUrl(configuredLogo, normalizedOrigin) || publicAssetUrl('/invest-rs-logo.png', normalizedOrigin),
    qrImageUrl: publicAssetUrl(qrImageUrl, normalizedOrigin),
    vcardUrl: publicAssetUrl(vcardUrl, normalizedOrigin),
    contacts,
    confidentiality: options.confidentiality ? emailSignatureConfidentiality[language] : '',
  }
}

function contactHtml(contact: EmailSignatureContact) {
  const icon = contact.iconUrl ? `<a href="${escapeAttribute(contact.href)}" style="text-decoration:none"><img src="${escapeAttribute(contact.iconUrl)}" alt="${escapeAttribute(contact.alt)}" width="15" height="15" style="display:block;width:15px;height:15px;border:0"></a>` : '&nbsp;'
  return `<tr><td style="width:22px;padding:2px 7px 2px 0;vertical-align:middle">${icon}</td><td style="padding:2px 0;vertical-align:middle;font:12px/1.45 Arial,Helvetica,sans-serif;color:#444444"><a href="${escapeAttribute(contact.href)}" style="color:#444444;text-decoration:none">${escapeHtml(contact.text)}</a></td></tr>`
}

export function buildEmailSignatureHtml(model: EmailSignatureModel) {
  const department = model.department ? `<div style="font:12px/1.45 Arial,Helvetica,sans-serif;color:#444444">${escapeHtml(model.department)}</div>` : ''
  const contacts = model.contacts.length ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse">${model.contacts.map(contactHtml).join('')}</table>` : ''
  const notice = model.confidentiality ? `<tr><td colspan="2" style="padding:16px 0 0;font:italic 9px/1.45 Arial,Helvetica,sans-serif;color:#777777">${escapeHtml(model.confidentiality)}</td></tr>` : ''

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="580" style="width:580px;max-width:580px;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;color:#111111"><tr><td width="182" style="width:182px;padding:0 18px 0 0;vertical-align:top;border-right:2px solid #111111"><img src="${escapeAttribute(model.logoUrl)}" alt="Invest RS" width="164" style="display:block;width:164px;max-width:164px;height:auto;border:0"><div style="height:14px;line-height:14px">&nbsp;</div><a href="${escapeAttribute(model.vcardUrl)}" style="display:block;width:164px;text-align:center;text-decoration:none"><img src="${escapeAttribute(model.qrImageUrl)}" alt="QR Code para adicionar contato" width="88" height="88" style="display:block;width:88px;height:88px;margin:0 auto;border:0;background:#ffffff"></a></td><td style="padding:0 0 0 20px;vertical-align:top"><div style="font:bold 17px/1.3 Arial,Helvetica,sans-serif;color:#111111">${escapeHtml(model.name)}</div>${model.jobTitle ? `<div style="font:14px/1.45 Arial,Helvetica,sans-serif;color:#111111">${escapeHtml(model.jobTitle)}</div>` : ''}${department}<div style="height:16px;line-height:16px">&nbsp;</div>${contacts}</td></tr>${notice}</table>`
}

export function buildEmailSignaturePlainText(model: EmailSignatureModel) {
  const professional = [model.name, model.jobTitle, model.department].filter(Boolean)
  const contacts = model.contacts.map(({ text }) => text)
  return [...professional, ...(contacts.length ? ['', ...contacts] : []), ...(model.confidentiality ? ['', model.confidentiality] : [])].join('\n')
}
