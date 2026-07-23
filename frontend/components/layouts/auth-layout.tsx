"use client"

import { Church } from "lucide-react"
import { FadeIn } from "@/components/shared/animations"
import type { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  description?: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <FadeIn className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-600 shadow-sm">
            <Church className="size-5 text-white" />
          </div>
          <span className="text-sm font-semibold text-foreground">ERP Sistema</span>
        </div>
        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="mt-2 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {children}
        </div>
      </FadeIn>
    </div>
  )
}
