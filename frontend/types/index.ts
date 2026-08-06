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

export interface PermissionDefinition {
  id: string
  name: string
  label: string
  description: string | null
  created_at: string
  updated_at: string
}

export type ContactStage =
  "novo" | "contato" | "qualificado" | "proposta" | "ganho" | "perdido"

export interface ContactActivity {
  id: string
  type: "whatsapp" | "call" | "email" | "note"
  text: string
  user: string | null
  occurred_at: string | null
}

export interface ContactTask {
  id: string
  label: string
  due_date: string | null
  done: boolean
}

export interface Contact {
  id: string
  organization_id: string
  name: string
  email: string | null
  phone: string | null
  assignee: string | null
  status: ContactStage
  value: number
  tags: string[]
  notes: string | null
  activities: ContactActivity[]
  tasks: ContactTask[]
  created_at: string
  updated_at: string
}

export type DashboardPeriod = "week" | "month" | "quarter" | "year" | "custom"

export interface DashboardGrowthPoint {
  month: string
  total: number
}

export interface DashboardRevenueExpensePoint {
  month: string
  revenue: number
  expense: number
}

export interface DashboardActivity {
  id: string
  type: "organization" | "admin" | "subscription"
  text: string
  created_at: string | null
}

export interface DashboardRecentUser {
  name: string
  created_at: string | null
  organization: string
}

export interface DashboardStats {
  admins_count: number
  common_users_count: number
  organizations_count: number
  active_organizations_count: number
  active_congregations_count: number
  plans_count: number
  revenue_month: number
  churn_amount: number
  past_due_amount: number
  balance_month: number
  growth: DashboardGrowthPoint[]
  revenue_expense_trend: DashboardRevenueExpensePoint[]
  recent_activities: DashboardActivity[]
  recent_users: DashboardRecentUser[]
  period: { from: string; to: string }
}

export interface MenuRoute {
  id: string
  title: string
  slug: string
  icon: string | null
  category: string
  sort_order: number
  parent_id: string | null
  is_active: boolean
  permissions: PermissionDefinition[]
  children: MenuRoute[]
  children_count: number | null
  created_at: string
  updated_at: string
}
