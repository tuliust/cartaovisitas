import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' }
const json = (body: Record<string, string>, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })

async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (request.method !== 'POST') return json({ error: 'Método não permitido.' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  const publicSiteUrl = (Deno.env.get('PUBLIC_SITE_URL') ?? '').replace(/\/$/, '')
  const rateLimitSalt = Deno.env.get('PASSWORD_RESET_RATE_LIMIT_SALT') ?? ''
  if (!supabaseUrl || !serviceRoleKey || !anonKey || !publicSiteUrl || !rateLimitSalt) return json({ error: 'Serviço temporariamente indisponível.' }, 503)

  let email = ''
  try { const body = await request.json() as { email?: unknown }; email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '' } catch { return json({ error: 'Solicitação inválida.' }, 400) }
  if (email.length > 254 || !/^[^\s@]+@investrs\.org\.br$/.test(email)) return json({ error: 'Informe um e-mail institucional @investrs.org.br.' }, 400)

  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('cf-connecting-ip') || 'unknown'
  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const keys = await Promise.all([sha256(`${rateLimitSalt}:ip:${forwarded}`), sha256(`${rateLimitSalt}:email:${email}`)])
  for (const key of keys) {
    const { data, error } = await admin.rpc('consume_password_reset_rate_limit', { p_key_hash: key, p_limit: 5, p_window_seconds: 900 })
    if (error) return json({ error: 'Serviço temporariamente indisponível.' }, 503)
    if (!data) return json({ error: 'Muitas tentativas. Aguarde e tente novamente.' }, 429)
  }

  let exists = false
  for (let page = 1; page <= 100; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) return json({ error: 'Serviço temporariamente indisponível.' }, 503)
    exists = data.users.some((user) => user.email?.toLowerCase() === email)
    if (exists || data.users.length < 1000) break
  }
  if (!exists) return json({ status: 'not_registered' })

  const authClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const { error } = await authClient.auth.resetPasswordForEmail(email, { redirectTo: `${publicSiteUrl}/definir-senha` })
  if (error) return json({ error: 'Não foi possível solicitar a recuperação de senha.' }, 400)
  return json({ status: 'sent' })
})
