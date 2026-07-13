export function canShareVCardFile() {
  if (typeof navigator.share !== 'function' || typeof navigator.canShare !== 'function' || typeof File !== 'function') return false
  try {
    const testFile = new File(['BEGIN:VCARD\nVERSION:3.0\nEND:VCARD'], 'contact.vcf', { type: 'text/vcard;charset=utf-8' })
    return navigator.canShare({ files: [testFile] })
  } catch {
    return false
  }
}
