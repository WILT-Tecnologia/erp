"use client"

import { useAuthStore } from "@/store/auth.store"

/**
 * Hoje o frontend só autentica Central Admins (guard api-admin), que não têm
 * sub-níveis de permissão — são sempre o "super admin" do SaaS. Por isso,
 * qualquer admin autenticado tem acesso irrestrito no contexto central.
 *
 * Quando o login de usuários de tenant existir, as permissões reais virão de
 * `/tenant/me` (roles/permissions do Spatie) e devem ser plugadas aqui no
 * lugar do array vazio abaixo — `hasPermission`/`hasAnyPermission` já fazem
 * a interseção correta, só falta a fonte de dados deixar de ser irrestrita.
 */
export function usePermissions() {
  const admin = useAuthStore((state) => state.admin)
  const isAuthenticated = !!admin
  const isSuperAdmin = isAuthenticated

  const permissions: string[] = []
  const roles: string[] = []

  const hasRole = (role: string): boolean =>
    isSuperAdmin || roles.includes(role)

  const hasPermission = (permission: string): boolean =>
    isSuperAdmin || permissions.includes(permission)

  const hasAnyPermission = (required: string[]): boolean =>
    required.length === 0 ||
    isSuperAdmin ||
    required.some((p) => permissions.includes(p))

  const can = hasPermission

  return {
    hasRole,
    hasPermission,
    hasAnyPermission,
    can,
    roles,
    permissions,
    isAuthenticated,
    isSuperAdmin,
  }
}
