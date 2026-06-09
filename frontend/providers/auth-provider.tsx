"use client"

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react"
import { useAuthStore } from "@/store/auth.store"
import { api } from "@/services/api"
import type { User } from "@/types"

interface AuthContextData {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setLoading,
    logout: storeLogout,
  } = useAuthStore()

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token && !user) {
      setLoading(true)
      api
        .get<User>("/auth/me")
        .then((response) => setUser(response))
        .catch(() => {
          localStorage.removeItem("auth_token")
          storeLogout()
        })
        .finally(() => setLoading(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        logout: storeLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
