import { api } from "@/services/api"
import { API_ENDPOINTS } from "@/constants"
import type { Admin, LoginCredentials, LoginResponse } from "@/types"

export const authService = {
  async login(credentials: LoginCredentials) {
    return api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials, {
      skipAuth: true,
    })
  },

  async logout() {
    return api.post(API_ENDPOINTS.AUTH.LOGOUT)
  },

  async me() {
    const response = await api.get<{ data: Admin }>(API_ENDPOINTS.AUTH.ME)
    return response.data
  },
}
