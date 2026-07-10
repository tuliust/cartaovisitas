import type { BusinessCard } from './cards'

export type PublicCardLanguage = 'pt' | 'es' | 'en'

export const publicCardLanguageLabels: Record<PublicCardLanguage, string> = {
  pt: 'PT',
  es: 'ES',
  en: 'EN',
}

export const publicCardCopy = {
  pt: {
    institutionalContact: 'Contato institucional', phone: 'Telefone', email: 'E-mail', website: 'Site', address: 'Endereço',
    quickActions: 'Ações rápidas', actionTitle: 'Salve ou compartilhe este contato.', saveContact: 'Salvar contato', call: 'Ligar', share: 'Compartilhar cartão',
    otherFeatures: 'Outras funcionalidades', edit: 'Editar', copyVcard: 'Copiar vCard', downloadQr: 'Baixar QR-Code', wallet: 'Adicionar à Wallet',
    vcardCopied: 'Link do vCard copiado.', walletSoon: 'Em breve: integração com Wallet.', linkCopied: 'Link copiado',
  },
  es: {
    institutionalContact: 'Contacto institucional', phone: 'Teléfono', email: 'Correo', website: 'Sitio web', address: 'Dirección',
    quickActions: 'Acciones rápidas', actionTitle: 'Guarda o comparte este contacto.', saveContact: 'Guardar contacto', call: 'Llamar', share: 'Compartir tarjeta',
    otherFeatures: 'Otras funcionalidades', edit: 'Editar', copyVcard: 'Copiar vCard', downloadQr: 'Descargar QR-Code', wallet: 'Añadir a Wallet',
    vcardCopied: 'Enlace de vCard copiado.', walletSoon: 'Próximamente: integración con Wallet.', linkCopied: 'Enlace copiado',
  },
  en: {
    institutionalContact: 'Business Card', phone: 'Phone', email: 'Email', website: 'Website', address: 'Address',
    quickActions: 'Quick actions', actionTitle: 'Save or share this contact.', saveContact: 'Save contact', call: 'Call', share: 'Share card',
    otherFeatures: 'Other features', edit: 'Edit', copyVcard: 'Copy vCard', downloadQr: 'Download QR Code', wallet: 'Add to Wallet',
    vcardCopied: 'vCard link copied.', walletSoon: 'Coming soon: Wallet integration.', linkCopied: 'Link copied',
  },
} as const

export function getLocalizedProfessionalData(card: BusinessCard, language: PublicCardLanguage) {
  const jobTitle = language === 'pt' ? card.job_title_pt : language === 'es' ? card.job_title_es : card.job_title_en
  const department = language === 'pt' ? card.department_pt : language === 'es' ? card.department_es : card.department_en

  return {
    jobTitle: jobTitle || card.job_title_pt || card.job_title || '',
    department: department || card.department_pt || card.department || '',
  }
}

export function getStoredPublicCardLanguage(): PublicCardLanguage {
  const stored = window.localStorage.getItem('invest-rs-public-card-language')
  return stored === 'es' || stored === 'en' ? stored : 'pt'
}

export function storePublicCardLanguage(language: PublicCardLanguage) {
  window.localStorage.setItem('invest-rs-public-card-language', language)
}
