"use client"

import { SWRConfig } from "swr"
import type { ReactNode } from "react"

interface SWRProviderProps {
  children: ReactNode
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        shouldRetryOnError: true,
        errorRetryCount: 3,
        onError: (error) => {
          if (error.status === 401) {
            localStorage.removeItem("auth_token")
            window.location.href = "/login"
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}
