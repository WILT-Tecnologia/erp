const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7 // 7 dias

export function setAuthCookie(name: string, value: string, maxAge = DEFAULT_MAX_AGE) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

export function removeAuthCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
}
