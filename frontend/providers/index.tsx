"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "./theme-provider"
import { AuthProvider } from "./auth-provider"
import { SWRProvider } from "./swr-provider"
import { ToastProvider } from "./toast-provider"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <SWRProvider>
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
      </SWRProvider>
    </ThemeProvider>
  )
}
