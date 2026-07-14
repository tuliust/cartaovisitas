import { useCallback, useMemo, useRef, useState } from 'react'
import type { AdminBusinessCard } from './adminCards'
import { recordCardEvent } from './cards'
import { downloadQrCodePng } from './qrcode'
import { canShareVCardFile } from './shareSupport'
import { generateVCard } from './vcard'
import { getAppleWalletUrl, isIosDevice, isWalletPublicEnabled } from './wallet'

export type CollaboratorAction = 'share' | 'copy-vcard' | 'qr' | 'wallet'

function baseUrl() { return (import.meta.env.VITE_APP_BASE_URL || window.location.origin).replace(/\/$/, '') }
function downloadBlob(blob: Blob, filename: string) { const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url) }

export function useCollaboratorCardActions(card: AdminBusinessCard | null, notify: { success: (message: string) => void; error: (message: string) => void; info: (message: string) => void }) {
  const [running, setRunning] = useState<CollaboratorAction | null>(null)
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [canShareVCard] = useState(() => canShareVCardFile())
  const runningRef = useRef(false)
  const vcardUrl = useMemo(() => card ? `${baseUrl()}/api/vcard/${encodeURIComponent(card.slug)}?lang=pt` : '', [card])
  const qrValue = useMemo(() => card ? generateVCard(card) : '', [card])

  const run = useCallback(async (action: CollaboratorAction, task: () => Promise<void>) => {
    if (!card || runningRef.current) return
    runningRef.current = true
    setRunning(action)
    try { await task() } finally { runningRef.current = false; setRunning(null) }
  }, [card])

  const copyVCard = useCallback(() => run('copy-vcard', async () => {
    try { await navigator.clipboard.writeText(vcardUrl); notify.success('URL do vCard copiada.'); if (card) void recordCardEvent(card.id, 'vcard') }
    catch { notify.error('Não foi possível copiar o link do vCard.') }
  }), [card, notify, run, vcardUrl])

  const downloadQrCode = useCallback(() => run('qr', async () => {
    if (!card) return
    try { await downloadQrCodePng(qrValue, `qr-code-${card.slug}.png`); notify.success('QR Code baixado com sucesso.') }
    catch { notify.error('Não foi possível baixar o QR Code.') }
  }), [card, notify, qrValue, run])

  const shareVCard = useCallback(() => run('share', async () => {
    if (!card) return
    try {
      const response = await fetch(vcardUrl, { headers: { Accept: 'text/vcard' } })
      if (!response.ok) throw new Error('Falha ao carregar vCard.')
      const blob = await response.blob()
      const file = new File([blob], `${card.slug}.vcf`, { type: blob.type || 'text/vcard;charset=utf-8' })
      const shareData = { files: [file], title: `${card.display_name || card.full_name} | ${card.company || 'Invest RS'}`, text: 'Meu cartão de contato institucional.' }
      if (typeof navigator.share === 'function' && typeof navigator.canShare === 'function' && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        notify.success('Cartão compartilhado com sucesso.')
      } else {
        downloadBlob(blob, file.name)
        notify.success('vCard baixado para compartilhamento.')
      }
      void recordCardEvent(card.id, 'share')
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      notify.error('Não foi possível compartilhar o cartão agora.')
    }
  }), [card, notify, run, vcardUrl])

  const openWallet = useCallback(() => run('wallet', async () => {
    if (!card) return
    if (!isWalletPublicEnabled()) { setWalletModalOpen(true); notify.info('Wallet em breve.'); return }
    if (isIosDevice()) { window.location.assign(getAppleWalletUrl(card.slug)); return }
    setWalletModalOpen(true)
  }), [card, notify, run])

  return {
    running,
    vcardUrl,
    qrValue,
    canShareVCard,
    shareSupportChecked: true,
    copyVCard,
    downloadQrCode,
    shareVCard,
    openWallet,
    walletModalOpen,
    closeWalletModal: () => setWalletModalOpen(false),
  }
}

export type CollaboratorCardActions = ReturnType<typeof useCollaboratorCardActions>
