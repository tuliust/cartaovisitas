import QRCode from 'qrcode'

export function generateQrCodeDataUrl(value: string): Promise<string> {
  return QRCode.toDataURL(value, {
    width: 720,
    margin: 2,
    errorCorrectionLevel: 'M',
  })
}

export async function downloadQrCodePng(value: string, filename: string): Promise<void> {
  const dataUrl = await generateQrCodeDataUrl(value)
  const anchor = document.createElement('a')

  anchor.href = dataUrl
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}
