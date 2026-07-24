"use client"

import { useAuthStore } from "@/store/auth.store"

/**
 * A API central hoje não expõe roles/permissions para o Admin (apenas
 * autenticação via Sanctum). Este hook fica pronto para plugar um sistema
 * de papéis quando o backend passar a retorná-los em `/admin/me`.
 */
export function usePermissions() {
  const admin = useAuthStore((state) => state.admin)

  const hasRole = (): boolean => false

  const hasPermission = (): boolean => false

  const can = (): boolean => false

  return {
    hasRole,
    hasPermission,
    can,
    roles: [] as string[],
    permissions: [] as string[],
    isAuthenticated: !!admin,
  }
}
