import { createClient } from '@supabase/supabase-js'

type InviteDraft = { email?: unknown; full_name?: unknown; job_title?: unknown; department?: unknown }
type Request = { method?: string; headers: Record<string, string | string[] | undefined>; body?: { email?: unknown; users?: unknown; sendInvite?: unknown } | string }
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

  let body: { email?: unknown; users?: unknown; sendInvite?: unknown } | undefined
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) as { email?: unknown; users?: unknown; sendInvite?: unknown } : req.body }
  catch { res.status(400).json({ error: 'Dados do convite inválidos.' }); return }
  const rawUsers = Array.isArray(body?.users) ? body.users as InviteDraft[] : [{ email: body?.email }]
  const sendInvite = body?.sendInvite !== false
  if (!rawUsers.length || rawUsers.length > 20) { res.status(400).json({ error: 'Cadastre entre 1 e 20 pessoas por ação.' }); return }
  const users = rawUsers.map((draft) => ({
    email: typeof draft.email === 'string' ? draft.email.trim().toLowerCase() : '',
    full_name: typeof draft.full_name === 'string' ? draft.full_name.trim() || null : null,
    job_title: typeof draft.job_title === 'string' ? draft.job_title.trim() || null : null,
    department: typeof draft.department === 'string' ? draft.department.trim() || null : null,
  }))
  if (users.some((user) => !/^[^\s@]+@investrs\.org\.br$/i.test(user.email))) { res.status(400).json({ error: 'Informe apenas e-mails institucionais @investrs.org.br.' }); return }
  if (new Set(users.map((user) => user.email)).size !== users.length) { res.status(400).json({ error: 'Remova os e-mails duplicados.' }); return }

  const authClient = createClient(url, anonKey)
  const { data: authData, error: authError } = await authClient.auth.getUser(token)
  if (authError || !authData.user?.email) { res.status(401).json({ error: 'Sessão administrativa inválida.' }); return }

  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  const { data: actor } = await admin.from('user_profiles').select('role,status').eq('id', authData.user.id).maybeSingle()
  if (!actor || actor.role !== 'admin' || actor.status === 'blocked') { res.status(403).json({ error: 'Você não tem permissão para enviar convites.' }); return }

  const now = new Date().toISOString()
  const redirectTo = `${(process.env.PUBLIC_SITE_URL || 'https://cartaovisitas.vercel.app').replace(/\/$/, '')}/definir-senha`
  for (const user of users) {
    let authUserId: string | null = null
    if (sendInvite) {
      const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(user.email, { redirectTo, data: { full_name: user.full_name, job_title: user.job_title, department: user.department } })
      if (inviteError || !invited.user) { res.status(400).json({ error: `${user.email}: ${inviteError?.message || 'não foi possível enviar o convite.'}` }); return }
      authUserId = invited.user.id
      const { error: profileError } = await admin.from('user_profiles').upsert({ id: authUserId, email: user.email, full_name: user.full_name, role: 'user', status: 'pending', invited_at: now, updated_at: now }, { onConflict: 'id' })
      if (profileError) { res.status(500).json({ error: `Convite enviado para ${user.email}, mas o perfil não foi atualizado.` }); return }
    }
    const { error: registrationError } = await admin.from('user_pre_registrations').upsert({ ...user, status: sendInvite ? 'pending' : 'inactive', auth_user_id: authUserId, updated_at: now }, { onConflict: 'email' })
    if (registrationError) { res.status(500).json({ error: `Não foi possível registrar ${user.email}.` }); return }
    await admin.from('audit_logs').insert({ actor_id: authData.user.id, actor_email: authData.user.email, action: sendInvite ? 'user_invited' : 'user_registered_inactive', target_type: 'user', target_id: authUserId, target_label: user.email, metadata: { source: 'admin_batch', full_name: user.full_name, job_title: user.job_title, department: user.department } })
  }
  res.status(200).json({ message: sendInvite ? `${users.length} convite${users.length === 1 ? '' : 's'} enviado${users.length === 1 ? '' : 's'}.` : `${users.length} usuário${users.length === 1 ? '' : 's'} registrado${users.length === 1 ? '' : 's'} como inativo${users.length === 1 ? '' : 's'}.` })
}
