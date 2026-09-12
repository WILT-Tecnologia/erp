export const API_ENDPOINTS = {
  auth: {
    login: '/admin/login',
    logout: '/admin/logout',
    me: '/admin/me',
  },
  tenantAuth: {
    login: '/tenant/login',
    logout: '/tenant/logout',
    me: '/tenant/me',
  },
  tenantMenuRoutes: {
    tree: '/tenant/menu-routes/tree',
  },
  dashboard: {
    stats: '/admin/dashboard/stats',
  },
  admins: '/admin/admins',
  organizations: {
    base: '/admin/organizations',
    checkSlug: (slug: string) => `/admin/organizations/check-slug/${slug}`,
    suspend: (id: string | number) => `/admin/organizations/${id}/suspend`,
    activate: (id: string | number) => `/admin/organizations/${id}/activate`,
    force: (id: string | number) => `/admin/organizations/${id}/force`,
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
  tenantAuthToken: 'tenant_auth_token',
  tenantAuthUser: 'tenant_auth_user',
  tenantAuthOrganization: 'tenant_auth_organization',
  theme: 'theme',
  sidebarCollapsed: 'sidebar_collapsed',
} as const;
