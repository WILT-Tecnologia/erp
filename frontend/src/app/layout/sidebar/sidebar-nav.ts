export type MenuGroupKey = 'admin' | 'organization';

export interface SidebarNavItem {
  title: string;
  /** Classic Material Icons ligature name (the font loaded in index.html). */
  icon: string;
  /** Route slug relative to the group's prefix, e.g. '/dashboard'. */
  slug: string;
}

export interface SidebarNavGroup {
  key: MenuGroupKey;
  label: string;
  /** Icon shown for this group's header when the sidebar is collapsed to a rail. */
  icon: string;
  items: SidebarNavItem[];
}

/**
 * Navigation is defined here, on the frontend, instead of being driven by the
 * backend's `MenuRoute` tree (`/admin/menu-routes/tree`). Two reasons:
 * - Most organization-scoped routes (churches, members, families, ...) were
 *   never seeded as `MenuRoute` rows, so relying on that tree silently
 *   dropped them from the sidebar.
 * - `MenuRoute.icon` values seeded in the backend are lucide-react icon
 *   names (e.g. "layout-dashboard"), but the app loads the classic Material
 *   Icons ligature font — those names don't match, so some items rendered
 *   as broken/blank icons.
 * The `/admin/global-services/menu-routes` CRUD page still manages the
 * backend `MenuRoute` table for whatever future purpose, it's just no
 * longer the sidebar's data source. Update this list whenever a new route
 * is implemented in `app.routes.ts`.
 */
export const SIDEBAR_NAV: SidebarNavGroup[] = [
  {
    key: 'admin',
    label: 'Administração Geral',
    icon: 'security',
    items: [
      { title: 'Dashboard', icon: 'dashboard', slug: '/dashboard' },
      { title: 'Organizações', icon: 'business', slug: '/organizations' },
      { title: 'Administradores', icon: 'supervisor_account', slug: '/admins' },
      { title: 'Planos', icon: 'credit_card', slug: '/plans' },
      { title: 'CRM', icon: 'contacts', slug: '/crm' },
      { title: 'Rotas de Menu', icon: 'tune', slug: '/global-services/menu-routes' },
      { title: 'Usuários Globais', icon: 'group', slug: '/global-services/users' },
      { title: 'Perfis', icon: 'assignment_ind', slug: '/global-services/profiles' },
      { title: 'Módulos', icon: 'extension', slug: '/global-services/modules' },
    ],
  },
  {
    key: 'organization',
    label: 'Organização',
    icon: 'domain',
    items: [
      { title: 'Dashboard', icon: 'dashboard', slug: '/dashboard' },
      { title: 'Igrejas', icon: 'account_balance', slug: '/churches' },
      { title: 'Congregações', icon: 'groups', slug: '/congregations' },
      { title: 'Membros', icon: 'group', slug: '/members' },
      { title: 'Famílias', icon: 'family_restroom', slug: '/families' },
      { title: 'Departamentos', icon: 'apartment', slug: '/departments' },
      { title: 'Eventos', icon: 'event', slug: '/events' },
      { title: 'Financeiro', icon: 'account_balance_wallet', slug: '/financial' },
      { title: 'Usuários', icon: 'manage_accounts', slug: '/users' },
      { title: 'Relatórios', icon: 'bar_chart', slug: '/reports' },
      { title: 'Configurações', icon: 'settings', slug: '/settings' },
      { title: 'Educacional', icon: 'school', slug: '/educational' },
      { title: 'Projetos', icon: 'assignment', slug: '/projects' },
      { title: 'Recursos Humanos', icon: 'badge', slug: '/hr' },
      { title: 'Patrimônio', icon: 'inventory_2', slug: '/assets' },
      { title: 'Business Intelligence', icon: 'insights', slug: '/bi' },
    ],
  },
];

/**
 * Resolves a nav item's slug into absolute route segments. Admin items
 * always resolve (no organization context needed). Organization items only
 * resolve once an `organizationId` is available (i.e. the super admin has
 * drilled into a specific organization) — otherwise `null`, meaning the
 * item is still shown in the sidebar but rendered as non-navigable.
 */
export function resolveNavLink(group: MenuGroupKey, slug: string, organizationId: string | null): string[] | null {
  const parts = slug.split('/').filter(Boolean);
  if (group === 'admin') return ['/admin', ...parts];
  return organizationId ? ['/organizations', organizationId, ...parts] : null;
}
