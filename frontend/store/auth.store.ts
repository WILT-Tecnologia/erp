import { STORAGE_KEYS } from "@/constants"
import { removeAuthCookie, setAuthCookie } from "@/lib/cookies"
import type { Admin } from "@/types"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
  admin: Admin | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  hasHydrated: boolean

  setAdmin: (admin: Admin | null) => void
  setLoading: (isLoading: boolean) => void
  setHasHydrated: (hasHydrated: boolean) => void
  login: (admin: Admin, token: string) => void
  logout: () => void
  updateAdmin: (admin: Partial<Admin>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false,

      setAdmin: (admin) => set({ admin, isAuthenticated: !!admin }),

      setLoading: (isLoading) => set({ isLoading }),

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),

      login: (admin, token) => {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
        setAuthCookie(STORAGE_KEYS.AUTH_TOKEN, token)
        set({ admin, token, isAuthenticated: true, isLoading: false })
      },

      logout: () => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        removeAuthCookie(STORAGE_KEYS.AUTH_TOKEN)
        set({ admin: null, token: null, isAuthenticated: false })
      },

      updateAdmin: (adminData) =>
        set((state) => ({
          admin: state.admin ? { ...state.admin, ...adminData } : null,
        })),
    }),
    {
      name: STORAGE_KEYS.USER,
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
