import { readFile } from 'node:fs/promises'
import path from 'node:path'
import forge from 'node-forge'
import { PKPass } from 'passkit-generator'

export type WalletCard = {
  id: string
  slug: string
  full_name: string
  display_name: string | null
  job_title: string | null
  job_title_pt: string | null
  department: string | null
  department_pt: string | null
  company: string | null
  mobile_phone: string | null
  work_phone: string | null
  email: string | null
  website: string | null
  address_line: string | null
  city: string | null
  state: string | null
  country: string | null
}

type PassColors = { backgroundColor: string; foregroundColor: string; labelColor: string }

export class AppleWalletConfigurationError extends Error {}

function requiredEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new AppleWalletConfigurationError('Apple Wallet ainda não está configurado para este ambiente.')
  return value
}

function decodeCertificate(base64: string) {
  try {
    const buffer = Buffer.from(base64, 'base64')
    const text = buffer.toString('utf8')
    if (text.includes('BEGIN CERTIFICATE')) return Buffer.from(text)
    const certificate = forge.pki.certificateFromAsn1(forge.asn1.fromDer(buffer.toString('binary')))
    return Buffer.from(forge.pki.certificateToPem(certificate))
  } catch {
    throw new AppleWalletConfigurationError('Não foi possível carregar o certificado Apple WWDR configurado.')
  }
}

function extractSignerFromP12(base64: string, password: string) {
  try {
    const der = Buffer.from(base64, 'base64').toString('binary')
    const p12 = forge.pkcs12.pkcs12FromAsn1(forge.asn1.fromDer(der), false, password)
    const certBag = p12.getBags({ bagType: forge.pki.oids.certBag })[forge.pki.oids.certBag]?.[0]
    const keyBags = [
      ...(p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })[forge.pki.oids.pkcs8ShroudedKeyBag] ?? []),
      ...(p12.getBags({ bagType: forge.pki.oids.keyBag })[forge.pki.oids.keyBag] ?? []),
    ]
    const keyBag = keyBags[0]
    if (!certBag?.cert || !keyBag?.key) throw new Error('Certificado ou chave ausente no PKCS#12.')
    return {
      signerCert: Buffer.from(forge.pki.certificateToPem(certBag.cert)),
      signerKey: Buffer.from(forge.pki.privateKeyToPem(keyBag.key)),
    }
  } catch {
    throw new AppleWalletConfigurationError('Não foi possível carregar o certificado Apple Wallet configurado.')
  }
}

async function getPassAssets() {
  const walletDirectory = path.join(process.cwd(), 'public', 'wallet')
  const entries = await Promise.all(['icon.png', 'icon@2x.png', 'logo.png', 'logo@2x.png'].map(async (name) => [name, await readFile(path.join(walletDirectory, name))] as const))
  return Object.fromEntries(entries)
}

function address(card: WalletCard) {
  return [card.address_line, card.city, card.state, card.country].filter(Boolean).join(', ')
}

export async function generateAppleWalletPass(card: WalletCard, baseUrl: string, colors?: Partial<PassColors>) {
  if (process.env.APPLE_WALLET_ENABLED !== 'true') {
    throw new AppleWalletConfigurationError('Apple Wallet ainda não está configurado para este ambiente.')
  }

  const passTypeIdentifier = requiredEnv('APPLE_PASS_TYPE_IDENTIFIER')
  const teamIdentifier = requiredEnv('APPLE_TEAM_IDENTIFIER')
  const organizationName = requiredEnv('APPLE_ORGANIZATION_NAME')
  const signer = extractSignerFromP12(requiredEnv('APPLE_PASS_CERT_BASE64'), requiredEnv('APPLE_PASS_CERT_PASSWORD'))
  const wwdr = decodeCertificate(requiredEnv('APPLE_WWDR_CERT_BASE64'))
  const publicUrl = `${baseUrl}/${card.slug}`
  const vcardUrl = `${baseUrl}/api/vcard/${card.slug}`
  const name = card.display_name || card.full_name

  const pass = new PKPass(await getPassAssets(), { ...signer, wwdr }, {
    formatVersion: 1,
    serialNumber: card.id,
    passTypeIdentifier,
    teamIdentifier,
    organizationName,
    description: `Cartão digital de ${name}`,
    logoText: 'Invest RS',
    backgroundColor: colors?.backgroundColor || 'rgb(5, 5, 5)',
    foregroundColor: colors?.foregroundColor || 'rgb(255, 255, 255)',
    labelColor: colors?.labelColor || 'rgb(190, 190, 190)',
  })

  pass.type = 'generic'
  pass.headerFields.push({ key: 'organization', label: 'ORGANIZAÇÃO', value: 'Invest RS' })
  pass.primaryFields.push({ key: 'name', label: 'CONTATO', value: name })
  const jobTitle = card.job_title_pt || card.job_title
  const department = card.department_pt || card.department
  if (jobTitle) pass.secondaryFields.push({ key: 'jobTitle', label: 'CARGO', value: jobTitle })
  if (department) pass.secondaryFields.push({ key: 'department', label: 'ÁREA', value: department })
  if (card.email) pass.auxiliaryFields.push({ key: 'email', label: 'E-MAIL', value: card.email })
  if (card.mobile_phone) pass.auxiliaryFields.push({ key: 'mobile', label: 'CELULAR', value: card.mobile_phone })
  if (card.work_phone) pass.auxiliaryFields.push({ key: 'workPhone', label: 'TELEFONE', value: card.work_phone })
  pass.backFields.push({ key: 'publicPage', label: 'Página pública', value: publicUrl })
  pass.backFields.push({ key: 'vcard', label: 'vCard', value: vcardUrl })
  if (card.website) pass.backFields.push({ key: 'website', label: 'Site institucional', value: card.website })
  const fullAddress = address(card)
  if (fullAddress) pass.backFields.push({ key: 'address', label: 'Endereço institucional', value: fullAddress })
  pass.setBarcodes({ format: 'PKBarcodeFormatQR', message: publicUrl, messageEncoding: 'iso-8859-1', altText: card.slug })

  return pass.getAsBuffer()
}
