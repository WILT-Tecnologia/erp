export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER: "auth_user",
  THEME: "theme",
} as const

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  ADMINS: "/admins",
  ADMINS_CREATE: "/admins/create",
  ADMINS_EDIT: (id: string) => `/admins/${id}/edit`,
  ADMINS_SHOW: (id: string) => `/admins/${id}`,
  ORGANIZATIONS: "/organizations",
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/admin/login",
    LOGOUT: "/admin/logout",
    ME: "/admin/me",
  },
  ADMINS: "/admin/admins",
  ADMIN: (id: string) => `/admin/admins/${id}`,
  ORGANIZATIONS: "/admin/organizations",
  ORGANIZATION: (id: string) => `/admin/organizations/${id}`,
  ORGANIZATION_SUSPEND: (id: string) => `/admin/organizations/${id}/suspend`,
  ORGANIZATION_ACTIVATE: (id: string) => `/admin/organizations/${id}/activate`,
  PLANS: "/admin/plans",
} as const
