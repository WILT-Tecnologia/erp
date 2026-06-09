import { api } from "@/services/api"
import type { User, AuthTokens, LoginCredentials } from "@/types"

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post<{
      user: User
      tokens: AuthTokens
    }>("/auth/login", credentials)
    return response
  },

  async logout() {
    return api.post("/auth/logout")
  },

  async me() {
    return api.get<User>("/auth/me")
  },

  async refreshToken(refreshToken: string) {
    return api.post<AuthTokens>("/auth/refresh", {
      refresh_token: refreshToken,
    })
  },
}
