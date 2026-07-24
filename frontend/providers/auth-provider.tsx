"use client"

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react"
import { useAuthStore } from "@/store/auth.store"
import { authService } from "@/features/auth/services/auth.service"
import type { Admin } from "@/types"

interface AuthContextData {
  isAuthenticated: boolean
  admin: Admin | null
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    admin,
    isAuthenticated,
    isLoading,
    setAdmin,
    setLoading,
    logout: storeLogout,
  } = useAuthStore()

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token && !admin) {
      setLoading(true)
      authService
        .me()
        .then((response) => setAdmin(response))
        .catch(storeLogout)
        .finally(() => setLoading(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        admin,
        isLoading,
        logout: storeLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
