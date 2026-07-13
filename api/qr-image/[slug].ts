import QRCode from 'qrcode'

type Request = { method?: string; query: Record<string, string | string[] | undefined>; headers?: Record<string, string | string[] | undefined> }
type Response = { setHeader: (name: string, value: string) => void; status: (code: number) => Response; send: (body: Buffer) => void; json: (body: unknown) => void }
type Language = 'pt' | 'es' | 'en'

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function language(value: string | string[] | undefined): Language {
  const candidate = first(value)
  return candidate === 'es' || candidate === 'en' ? candidate : 'pt'
}

function vercelHost(value: string | undefined) {
  if (!value) return ''
  const host = value.replace(/^https?:\/\//, '').replace(/\/$/, '')
  return /^[a-z0-9.-]+$/i.test(host) ? `https://${host}` : ''
}

function requestOrigin(req: Request) {
  const configured = process.env.VITE_APP_BASE_URL?.replace(/\/$/, '')
  if (configured?.startsWith('https://')) return configured
  const productionHost = vercelHost(process.env.VERCEL_PROJECT_PRODUCTION_URL)
  if (productionHost) return productionHost
  const deploymentHost = vercelHost(process.env.VERCEL_URL)
  if (deploymentHost) return deploymentHost
  const forwardedHost = first(req.headers?.['x-forwarded-host']) || first(req.headers?.host)
  if (forwardedHost && /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(forwardedHost)) return `http://${forwardedHost}`
  return ''
}

export default async function handler(req: Request, res: Response) {
  if (req.method && req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed.' })
    return
  }
  const slug = first(req.query.slug)
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    res.status(400).json({ error: 'Invalid slug.' })
    return
  }
  const origin = requestOrigin(req)
  if (!origin) {
    res.status(503).json({ error: 'Public application URL is not configured.' })
    return
  }
  const target = `${origin}/api/vcard/${encodeURIComponent(slug)}?lang=${language(req.query.lang)}`
  try {
    const png = await QRCode.toBuffer(target, { type: 'png', width: 360, margin: 3, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } })
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Content-Disposition', 'inline')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400')
    res.status(200).send(png)
  } catch {
    res.status(500).json({ error: 'Unable to generate QR Code.' })
  }
}
