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
  MENU_ROUTES: "/global-services/menu-routes",
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
  PLAN: (id: string) => `/admin/plans/${id}`,
  PERMISSION_DEFINITIONS: "/admin/permission-definitions",
  PERMISSION_DEFINITION: (id: string) => `/admin/permission-definitions/${id}`,
  MENU_ROUTES: "/admin/menu-routes",
  MENU_ROUTE: (id: string) => `/admin/menu-routes/${id}`,
  MENU_ROUTES_TREE: "/admin/menu-routes/tree",
  DASHBOARD_STATS: "/admin/dashboard/stats",
  CONTACTS: "/admin/contacts",
  CONTACT: (id: string) => `/admin/contacts/${id}`,
  CONTACT_ACTIVITIES: (contactId: string) =>
    `/admin/contacts/${contactId}/activities`,
  CONTACT_TASKS: (contactId: string) => `/admin/contacts/${contactId}/tasks`,
  CONTACT_TASK: (contactId: string, taskId: string) =>
    `/admin/contacts/${contactId}/tasks/${taskId}`,
} as const
