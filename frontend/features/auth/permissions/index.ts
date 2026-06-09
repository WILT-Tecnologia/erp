"use client"

import { useAuthStore } from "@/store/auth.store"

export function usePermissions() {
  const user = useAuthStore((state) => state.user)

  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) ?? false
  }

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) ?? false
  }

  const can = (action: string, resource?: string): boolean => {
    const permission = resource ? `${resource}:${action}` : action
    return hasPermission(permission)
  }

  return {
    hasRole,
    hasPermission,
    can,
    roles: user?.roles ?? [],
    permissions: user?.permissions ?? [],
  }
}
