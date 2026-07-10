type VercelResponse = { status: (code: number) => VercelResponse; json: (body: unknown) => void }

export default function handler(_req: unknown, res: VercelResponse) {
  res.status(501).json({ error: 'Google Wallet será disponibilizado em uma próxima etapa.' })
}
