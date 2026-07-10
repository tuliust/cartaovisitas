function cleanProfile(value: string, domain: string, pathPrefix = ''): string {
  let profile = value.trim()
  profile = profile.replace(/^https?:\/\/(?:www\.)?/i, '')
  profile = profile.replace(new RegExp(`^${domain.replace('.', '\\.')}/`, 'i'), '')
  if (pathPrefix) profile = profile.replace(new RegExp(`^${pathPrefix}`, 'i'), '')
  return profile.split(/[?#]/)[0].replace(/^@|\/+$/g, '').trim()
}

export function getLinkedinProfile(value: string): string {
  return cleanProfile(value, 'linkedin.com', 'in/')
}

export function buildLinkedinUrl(profile: string): string {
  const clean = getLinkedinProfile(profile)
  return clean ? `https://www.linkedin.com/in/${clean}` : ''
}

export function getInstagramProfile(value: string): string {
  return cleanProfile(value, 'instagram.com')
}

export function buildInstagramUrl(profile: string): string {
  const clean = getInstagramProfile(profile)
  return clean ? `https://www.instagram.com/${clean}` : ''
}
