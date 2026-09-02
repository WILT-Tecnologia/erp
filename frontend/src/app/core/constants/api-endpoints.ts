export const API_ENDPOINTS = {
  auth: {
    login: '/admin/login',
    logout: '/admin/logout',
    me: '/admin/me',
  },
  dashboard: {
    stats: '/admin/dashboard/stats',
  },
  admins: '/admin/admins',
  organizations: {
    base: '/admin/organizations',
    suspend: (id: string | number) => `/admin/organizations/${id}/suspend`,
    activate: (id: string | number) => `/admin/organizations/${id}/activate`,
    tenantContext: (slug: string) => `/admin/organizations/${slug}/tenant-context`,
  },
  plans: '/admin/plans',
  permissionDefinitions: '/admin/permission-definitions',
  menuRoutes: {
    base: '/admin/menu-routes',
    tree: '/admin/menu-routes/tree',
  },
  contacts: {
    base: '/admin/contacts',
    activities: (contactId: string | number) => `/admin/contacts/${contactId}/activities`,
    tasks: (contactId: string | number) => `/admin/contacts/${contactId}/tasks`,
  },
} as const;

export const STORAGE_KEYS = {
  authToken: 'auth_token',
  authUser: 'auth_user',
  theme: 'theme',
  sidebarCollapsed: 'sidebar_collapsed',
} as const;
