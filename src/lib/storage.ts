import { supabase } from './supabase'

const BUCKET = 'business-card-assets'
const MAX_FILE_SIZE = 2 * 1024 * 1024
const AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const LOGO_TYPES = [...AVATAR_TYPES, 'image/svg+xml']

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase não configurado. Verifique as variáveis de ambiente.')
  }

  return supabase
}

function getExtension(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase()

  if (extension) {
    return extension
  }

  if (file.type === 'image/jpeg') {
    return 'jpg'
  }

  if (file.type === 'image/svg+xml') {
    return 'svg'
  }

  return file.type.replace('image/', '') || 'png'
}

function validateImage(file: File, allowedTypes: string[], label: string) {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`${label}: use PNG, JPEG${allowedTypes.includes('image/svg+xml') ? ', WebP ou SVG' : ' ou WebP'}.`)
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`${label}: o arquivo deve ter até 2MB.`)
  }
}

export function validateAvatarFile(file: File) {
  validateImage(file, AVATAR_TYPES, 'Avatar')
}

function safeSlug(slug: string) {
  return slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-') || 'cartao'
}

async function uploadCardAsset(file: File, slug: string, folder: 'avatars' | 'logos') {
  const client = requireSupabase()
  const path = `${folder}/${safeSlug(slug)}-${Date.now()}.${getExtension(file)}`

  const { error } = await client.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type,
  })

  if (error) {
    throw error
  }

  const { data } = client.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function uploadCardAvatar(file: File, slug: string): Promise<string> {
  validateAvatarFile(file)
  return uploadCardAsset(file, slug, 'avatars')
}

export async function uploadCardLogo(file: File, slug: string): Promise<string> {
  validateImage(file, LOGO_TYPES, 'Logo')
  return uploadCardAsset(file, slug, 'logos')
}
