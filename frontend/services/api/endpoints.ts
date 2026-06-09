import { API_CONFIG } from "./config"

export function buildEndpoint(path: string): string {
  const base = API_CONFIG.BASE_URL.replace(/\/+$/, "")
  const cleanPath = path.replace(/^\/+/, "")
  return `${base}/${cleanPath}`
}
