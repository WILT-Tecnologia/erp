export type TenantUserRole =
  | "Administrador"
  | "Gestor"
  | "Pastor"
  | "Financeiro"
  | "Operador"

export type TenantUserStatus = "Ativo" | "Inativo" | "Suspenso"

export interface TenantUser {
  id: string
  name: string
  email: string
  phone: string
  role: TenantUserRole
  organization: string
  status: TenantUserStatus
  last_login_at: string | null
}
