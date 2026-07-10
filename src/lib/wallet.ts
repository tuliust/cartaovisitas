export function getAppleWalletUrl(slug: string) {
  return `/api/wallet/apple/${encodeURIComponent(slug)}`
}

export function isWalletPublicEnabled() {
  return import.meta.env.VITE_WALLET_PUBLIC_ENABLED === 'true'
}

export function isIosDevice() {
  const userAgent = window.navigator.userAgent
  return /iPhone|iPad|iPod/i.test(userAgent) || (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)
}

export function isAndroidDevice() {
  return /Android/i.test(window.navigator.userAgent)
}

export function getWalletSupportMessage() {
  if (isAndroidDevice()) return 'Google Wallet será disponibilizado em uma próxima etapa.'
  return 'Abra esta página no iPhone para adicionar ao Apple Wallet.'
}
