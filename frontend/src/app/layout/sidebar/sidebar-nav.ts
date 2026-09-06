import { type Route, type Routes } from '@angular/router';

export interface SidebarNavItem {
  title: string;
  /** Classic Material Icons ligature name (the font loaded in index.html). */
  icon: string;
  /** Route segments relative to the section's own `basePath`, e.g. ['contacts']. */
  path: string[];
  /** Nested routes (a route whose own `children` are themselves navigable routes) render as an accordion. */
  children?: SidebarNavItem[];
}

export interface SidebarNavSection {
  key: string;
  label: string;
  /** Icon shown for this section's header (or, for a bare section, the item itself) when collapsed to a rail. */
  icon: string;
  /** Route segments from the app root to this section's own route, ':organizationId' as a placeholder. */
  basePath: string[];
  /** True for the tenant's own Dashboard/Relatórios links: a single item rendered with no accordion header. */
  bare: boolean;
  items: SidebarNavItem[];
}

interface TenantSectionMeta {
  key: string;
  label: string;
  icon: string;
  /** Path segment identifying this section's route among the organization route's children. */
  routeSegment: string;
  bare?: boolean;
}

/** One entry per first-class tenant module, in sidebar display order. */
const TENANT_SECTIONS: TenantSectionMeta[] = [
  { key: 'org-dashboard', label: '', icon: '', routeSegment: 'dashboard', bare: true },
  { key: 'crm', label: 'CRM', icon: 'contacts', routeSegment: 'crm' },
  { key: 'educational', label: 'Educacional', icon: 'school', routeSegment: 'educational' },
  { key: 'financial', label: 'Financeiro', icon: 'account_balance_wallet', routeSegment: 'financial' },
  { key: 'church', label: 'Igreja', icon: 'church', routeSegment: 'church' },
  { key: 'hr', label: 'Recursos Humanos', icon: 'badge', routeSegment: 'hr' },
  { key: 'projects', label: 'Projetos', icon: 'assignment', routeSegment: 'projects' },
  { key: 'patrimony', label: 'Patrimônio', icon: 'inventory_2', routeSegment: 'patrimony' },
  { key: 'bi', label: 'Business Intelligence', icon: 'insights', routeSegment: 'bi' },
  { key: 'settings', label: 'Configurações', icon: 'settings', routeSegment: 'settings' },
  { key: 'org-reports', label: '', icon: '', routeSegment: 'reports', bare: true },
];

/**
 * Builds the sidebar's nav sections directly from the app's route config
 * (`app.routes.ts`), so routes stay the single source of truth for what
 * appears in the sidebar, its titles, and its icons (`data.icon` on each
 * leaf route). Routes without `data.icon` — redirect stubs, container
 * routes — are skipped automatically.
 *
 * Each first-class tenant module (CRM, Educacional, Financeiro, ...) is its
 * own top-level section rather than being nested inside one generic
 * "Organização" umbrella, matching the ERP's target information
 * architecture. `/admin` remains a single distinct super-admin-only section.
 *
 * Takes the raw `Router.config` array rather than importing `app.routes.ts`
 * directly, since this module is imported by `SidebarComponent`, which is
 * rendered by `ShellComponent`, which is declared in `app.routes.ts` —
 * a static import of the routes here would be circular.
 */
export function buildSidebarNav(routerConfig: Routes): SidebarNavSection[] {
  const shellRoute = routerConfig.find((route) => route.path === '' && !!route.children);
  const shellChildren = shellRoute?.children ?? [];

  const adminRoute = shellChildren.find((route) => route.path === 'admin');
  const orgRoute = shellChildren.find((route) => route.path === 'organizations/:organizationId');
  const orgChildren = orgRoute?.children ?? [];

  const sections: SidebarNavSection[] = [
    {
      key: 'admin',
      label: 'Administração Geral',
      icon: 'security',
      basePath: ['admin'],
      bare: false,
      items: buildNavItems(adminRoute?.children ?? []),
    },
  ];

  for (const meta of TENANT_SECTIONS) {
    const route = orgChildren.find((r) => r.path === meta.routeSegment);
    if (!route) continue;

    if (meta.bare) {
      if (!route.title || !route.data?.['icon']) continue;
      sections.push({
        key: meta.key,
        label: route.title as string,
        icon: route.data['icon'] as string,
        basePath: ['organizations', ':organizationId'],
        bare: true,
        items: [{ title: route.title as string, icon: route.data['icon'] as string, path: [meta.routeSegment] }],
      });
      continue;
    }

    sections.push({
      key: meta.key,
      label: meta.label,
      icon: meta.icon,
      basePath: ['organizations', ':organizationId', meta.routeSegment],
      bare: false,
      items: buildNavItems(route.children ?? []),
    });
  }

  return sections;
}

/**
 * Walks a route subtree recursively, keeping only routes with a `title` and
 * `data.icon` (redirects and structural/guard-only routes are skipped). A
 * route whose own `children` are themselves navigable routes gets a
 * `children` array here too, so the sidebar can render it as an accordion.
 */
function buildNavItems(routes: Route[], parentPath: string[] = []): SidebarNavItem[] {
  const items: SidebarNavItem[] = [];

  for (const route of routes) {
    if (!route.path || route.path === '**' || route.redirectTo !== undefined) continue;

    const path = [...parentPath, route.path];
    const children = route.children?.length ? buildNavItems(route.children, path) : undefined;

    if (!route.title || !route.data?.['icon']) continue;

    items.push({
      title: route.title as string,
      icon: route.data['icon'] as string,
      path,
      children: children?.length ? children : undefined,
    });
  }

  return items;
}

/**
 * Resolves a nav item's path segments into absolute route segments, using
 * the section's own `basePath` (which may contain a ':organizationId'
 * placeholder). Returns `null` when the item needs an organization context
 * that isn't available yet — the item is still shown in the sidebar but
 * rendered as non-navigable.
 */
export function resolveNavLink(basePath: string[], path: string[], organizationId: string | null): string[] | null {
  if (!basePath.includes(':organizationId')) return ['/', ...basePath, ...path];
  if (!organizationId) return null;

  const resolvedBase = basePath.map((segment) => (segment === ':organizationId' ? organizationId : segment));
  return ['/', ...resolvedBase, ...path];
}
