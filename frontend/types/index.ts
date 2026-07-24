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

export type PlanStatus = "active" | "inactive"

export interface Plan {
  id: string
  name: string
  slug: string
  description: string | null
  price_monthly: number
  price_yearly: number
  trial_days: number
  max_users: number
  max_members: number
  max_storage_gb: number
  features: string[]
  is_public: boolean
  sort_order: number
  status: PlanStatus
  created_at: string
  updated_at: string
}

export type OrganizationStatus = "active" | "suspended" | "inactive"

export interface Organization {
  id: string
  name: string
  legal_name: string | null
  slug: string
  cnpj: string | null
  email: string | null
  phone: string | null
  whatsapp: string | null
  logo: string | null
  cover_image: string | null
  description: string | null
  founded_at: string | null
  status: OrganizationStatus
  timezone: string
  language: string
  settings: Record<string, unknown> | null
  plan: Plan | null
  owner_admin: Admin | null
  domains: string[]
  schema_name: string
  created_at: string
  updated_at: string
}
