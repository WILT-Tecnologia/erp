export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status: number
}

export type AdminStatus = "active" | "inactive"

export interface Admin {
  id: string
  name: string
  email: string
  avatar: string | null
  phone: string | null
  locale: string | null
  timezone: string | null
  status: AdminStatus
  settings: Record<string, unknown> | null
  last_login_at: string | null
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
  device_name?: string
}

export interface LoginResponse {
  token: string
  admin: Admin
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}
