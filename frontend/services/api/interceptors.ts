import type { ApiRequestInterceptors } from "./types"

export const authInterceptor: ApiRequestInterceptors = {
  onRequest: async (config) => {
    if (config.skipAuth) return config

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token")
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        }
      }
    }

    return config
  },

  onError: async (error) => {
    if (error.message.includes("401")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("refresh_token")
        window.location.href = "/login"
      }
    }
    return error
  },
}
