import { createClient } from '@supabase/supabase-js'

type Request = { method?: string; headers: Record<string, string | string[] | undefined>; body?: { email?: unknown } | string }
type Response = { status: (code: number) => Response; json: (body: unknown) => void }

function header(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value }

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') { res.status(405).json({ error: 'Método não permitido.' }); return }
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !anonKey) { res.status(503).json({ error: 'Serviço temporariamente indisponível.' }); return }
  if (!serviceKey) { res.status(503).json({ error: 'Convites ainda não estão configurados neste ambiente.' }); return }

  const authorization = header(req.headers.authorization)
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) { res.status(401).json({ error: 'Sessão administrativa inválida.' }); return }

  let body: { email?: unknown } | undefined
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) as { email?: unknown } : req.body }
  catch { res.status(400).json({ error: 'Dados do convite inválidos.' }); return }
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!/^[^\s@]+@investrs\.org\.br$/i.test(email)) { res.status(400).json({ error: 'Informe um e-mail institucional @investrs.org.br.' }); return }

  const authClient = createClient(url, anonKey)
  const { data: authData, error: authError } = await authClient.auth.getUser(token)
  if (authError || !authData.user?.email) { res.status(401).json({ error: 'Sessão administrativa inválida.' }); return }

  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  const { data: actor } = await admin.from('user_profiles').select('role,status').eq('id', authData.user.id).maybeSingle()
  if (!actor || actor.role !== 'admin' || actor.status === 'blocked') { res.status(403).json({ error: 'Você não tem permissão para enviar convites.' }); return }

  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, { redirectTo: `${(process.env.PUBLIC_SITE_URL || 'https://cartaovisitas.vercel.app').replace(/\/$/, '')}/definir-senha` })
  if (inviteError || !invited.user) { res.status(400).json({ error: inviteError?.message || 'Não foi possível enviar o convite.' }); return }

  const now = new Date().toISOString()
  const { error: profileError } = await admin.from('user_profiles').upsert({ id: invited.user.id, email, role: 'user', status: 'pending', invited_at: now, updated_at: now }, { onConflict: 'id' })
  if (profileError) { res.status(500).json({ error: 'Convite enviado, mas não foi possível atualizar o perfil.' }); return }
  await admin.from('audit_logs').insert({ actor_id: authData.user.id, actor_email: authData.user.email, action: 'user_invited', target_type: 'user', target_id: invited.user.id, target_label: email, metadata: { source: 'supabase_auth_admin' } })
  res.status(200).json({ message: `Convite enviado para ${email}.` })
}
