export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "auth_user",
  THEME: "theme",
} as const

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  USERS: "/users",
  USERS_CREATE: "/users/create",
  USERS_EDIT: (id: number) => `/users/${id}/edit`,
  USERS_SHOW: (id: number) => `/users/${id}`,
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
  },
  USERS: "/users",
  USER: (id: number) => `/users/${id}`,
} as const
