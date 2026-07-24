"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/providers/auth-provider"
import { useAuthStore } from "@/store/auth.store"
import { DashboardLayout } from "./dashboard-layout"
import { redirect } from "next/navigation"

interface AppLayoutProps {
  children: ReactNode
  requireAuth?: boolean
}

export function AppLayout({
  children,
  requireAuth = true,
}: AppLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  if (isLoading || !hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    redirect("/login")
  }

  return <DashboardLayout>{children}</DashboardLayout>
}
