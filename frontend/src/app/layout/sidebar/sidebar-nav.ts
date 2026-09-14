import { type Route, type Routes } from '@angular/router';

import { type MenuRoute } from '../../features/menu-routes/menu-route.model';

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

/** Header icon for a `menu_routes.category` — the API has no per-category icon field, only per-item ones. */
const CATEGORY_ICONS: Record<string, string> = {
  CRM: 'contacts',
  Educacional: 'school',
  Financeiro: 'account_balance_wallet',
  Igreja: 'church',
  'Recursos Humanos': 'badge',
  'Gestão de Projetos': 'assignment',
  Patrimônio: 'inventory_2',
  'Business Intelligence': 'insights',
  Configurações: 'settings',
};

const DEFAULT_CATEGORY_ICON = 'folder';

/** Display order for categories coming back from the API — ties in `sort_order` across categories aren't otherwise ordered. */
const CATEGORY_ORDER = [
  'CRM',
  'Educacional',
  'Financeiro',
  'Igreja',
  'Recursos Humanos',
  'Gestão de Projetos',
  'Patrimônio',
  'Business Intelligence',
  'Configurações',
];

const TENANT_BASE_PATH = ['organizations', ':organizationId'];

/**
 * Builds the tenant sidebar sections from the `menu_routes` tree (see
 * `MenuRouteService.tenantTree()`) instead of the static route config —
 * `menu_routes` is meant to become the editable source of truth for a
 * tenant's navigation and per-item permission requirements. The `/admin`
 * super-admin sidebar is unaffected and keeps using `buildSidebarNav` above.
 *
 * Every `slug` is validated against `routerConfig`'s real registered routes
 * — a menu entry that doesn't correspond to a shipped page is dropped
 * entirely rather than rendered as a dead link, since `menu_routes` can be
 * edited independently of what's actually been built in the app.
 */
export function buildTenantMenuSections(
  menuRoutes: MenuRoute[],
  routerConfig: Routes,
  hasAnyPermission: (permissionNames: string[]) => boolean,
): SidebarNavSection[] {
  const validPaths = collectValidPaths(routerConfig, 'organizations/:organizationId');

  const byCategory = new Map<string, MenuRoute[]>();
  for (const node of menuRoutes) {
    if (node.category === 'Administração' || node.category === 'Geral') continue;
    if (!byCategory.has(node.category)) byCategory.set(node.category, []);
    byCategory.get(node.category)!.push(node);
  }

  const orderedCategories = [
    ...CATEGORY_ORDER.filter((category) => byCategory.has(category)),
    ...[...byCategory.keys()].filter((category) => !CATEGORY_ORDER.includes(category)),
  ];

  const sections: SidebarNavSection[] = [];

  const dashboard = menuRoutes.find((node) => node.category === 'Geral' && node.slug === '/dashboard');
  if (dashboard && hasAnyPermission(dashboard.permissions.map((p) => p.name)) && validPaths.has('dashboard')) {
    sections.push(bareSection(dashboard));
  }

  for (const category of orderedCategories) {
    const roots = byCategory
      .get(category)!
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((node) => buildMenuNavItem(node, validPaths, hasAnyPermission))
      .filter((item): item is SidebarNavItem => item !== null);

    if (roots.length === 0) continue;

    sections.push({
      key: category,
      label: category,
      icon: CATEGORY_ICONS[category] ?? DEFAULT_CATEGORY_ICON,
      basePath: TENANT_BASE_PATH,
      bare: false,
      items: roots,
    });
  }

  const reports = menuRoutes.find((node) => node.category === 'Geral' && node.slug === '/reports');
  if (reports && hasAnyPermission(reports.permissions.map((p) => p.name)) && validPaths.has('reports')) {
    sections.push(bareSection(reports));
  }

  return sections;
}

function bareSection(node: MenuRoute): SidebarNavSection {
  return {
    key: node.slug!.slice(1),
    label: node.title,
    icon: node.icon ?? DEFAULT_CATEGORY_ICON,
    basePath: TENANT_BASE_PATH,
    bare: true,
    items: [{ title: node.title, icon: node.icon ?? DEFAULT_CATEGORY_ICON, path: [node.slug!.slice(1)] }],
  };
}

function buildMenuNavItem(
  node: MenuRoute,
  validPaths: Set<string>,
  hasAnyPermission: (permissionNames: string[]) => boolean,
  stripPrefix: string[] = [],
): SidebarNavItem | null {
  if (!node.slug || !node.is_active) return null;
  if (!hasAnyPermission(node.permissions.map((p) => p.name))) return null;

  const allSegments = node.slug.split('/').filter(Boolean);
  const segments = arrayStartsWith(allSegments, stripPrefix) ? allSegments.slice(stripPrefix.length) : allSegments;
  const exists = validPaths.has(segments.join('/'));

  const children = (node.children ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((child) => buildMenuNavItem(child, validPaths, hasAnyPermission, stripPrefix))
    .filter((item): item is SidebarNavItem => item !== null);

  if (!exists && children.length === 0) return null;

  return {
    title: node.title,
    icon: node.icon ?? DEFAULT_CATEGORY_ICON,
    path: segments,
    children: children.length ? children : undefined,
  };
}

function arrayStartsWith(segments: string[], prefix: string[]): boolean {
  return prefix.length > 0 && prefix.every((segment, i) => segments[i] === segment);
}

const ADMIN_BASE_PATH = ['admin'];

/**
 * Builds the super-admin sidebar's `/admin` section from the `menu_routes`
 * tree (category "Administração"), instead of the static route config —
 * same source of truth as `buildTenantMenuSections`. No permission
 * filtering: only a super admin ever reaches this section, and `Admin`
 * (unlike `TenantUser`) has no `permissions` list to check against.
 */
export function buildAdminMenuSections(menuRoutes: MenuRoute[], routerConfig: Routes): SidebarNavSection[] {
  const validPaths = collectValidPaths(routerConfig, 'admin');

  const items = menuRoutes
    .filter((node) => node.category === 'Administração')
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((node) => buildMenuNavItem(node, validPaths, () => true, ADMIN_BASE_PATH))
    .filter((item): item is SidebarNavItem => item !== null);

  if (items.length === 0) return [];

  return [
    {
      key: 'admin',
      label: 'Administração Geral',
      icon: 'security',
      basePath: ADMIN_BASE_PATH,
      bare: false,
      items,
    },
  ];
}

/** Every real, navigable relative path under the given top-level route segment, as `'segment/segment'` strings. */
function collectValidPaths(routerConfig: Routes, rootPath: string): Set<string> {
  const shellRoute = routerConfig.find((route) => route.path === '' && !!route.children);
  const rootRoute = shellRoute?.children?.find((route) => route.path === rootPath);

  const paths = new Set<string>();
  walkRoutes(rootRoute?.children ?? [], [], paths);
  return paths;
}

function walkRoutes(routes: Route[], parentPath: string[], paths: Set<string>): void {
  for (const route of routes) {
    if (!route.path || route.path === '**' || route.redirectTo !== undefined) continue;

    const path = [...parentPath, route.path];
    paths.add(path.join('/'));

    if (route.children?.length) walkRoutes(route.children, path, paths);
  }
}
