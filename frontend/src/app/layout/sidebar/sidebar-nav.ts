import { Route, Routes } from '@angular/router';

export type MenuGroupKey = 'admin' | 'organization';

export interface SidebarNavItem {
  title: string;
  /** Classic Material Icons ligature name (the font loaded in index.html). */
  icon: string;
  /** Route segments relative to the group's prefix, e.g. ['churches', 'dashboard']. */
  path: string[];
  /** Nested routes (a route whose own `children` are themselves navigable routes) render as an accordion. */
  children?: SidebarNavItem[];
}

export interface SidebarNavGroup {
  key: MenuGroupKey;
  label: string;
  /** Icon shown for this group's header when the sidebar is collapsed to a rail. */
  icon: string;
  items: SidebarNavItem[];
}

/** Fixed presentation chrome for the sidebar's two groups (not route data). */
const GROUP_META: Record<MenuGroupKey, { label: string; icon: string }> = {
  admin: { label: 'Administração Geral', icon: 'security' },
  organization: { label: 'Organização', icon: 'domain' },
};

const GROUP_PATHS: Record<MenuGroupKey, string> = {
  admin: 'admin',
  organization: 'organizations/:organizationId',
};

/**
 * Builds the sidebar's nav groups directly from the app's route config
 * (`app.routes.ts`), so routes stay the single source of truth for what
 * appears in the sidebar, its titles, and its icons (`data.icon` on each
 * leaf route). Routes without `data.icon` — redirect stubs, container
 * routes — are skipped automatically.
 *
 * Takes the raw `Router.config` array rather than importing `app.routes.ts`
 * directly, since this module is imported by `SidebarComponent`, which is
 * rendered by `ShellComponent`, which is declared in `app.routes.ts` —
 * a static import of the routes here would be circular.
 */
export function buildSidebarNav(routerConfig: Routes): SidebarNavGroup[] {
  const shellRoute = routerConfig.find((route) => route.path === '' && !!route.children);
  const shellChildren = shellRoute?.children ?? [];

  return (Object.keys(GROUP_META) as MenuGroupKey[]).map((key) => {
    const groupRoute = shellChildren.find((route) => route.path === GROUP_PATHS[key]);
    const items = buildNavItems(groupRoute?.children ?? []);

    return { key, label: GROUP_META[key].label, icon: GROUP_META[key].icon, items };
  });
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
 * Resolves a nav item's path segments into absolute route segments. Admin
 * items always resolve (no organization context needed). Organization items
 * only resolve once an `organizationId` is available (i.e. the super admin
 * has drilled into a specific organization) — otherwise `null`, meaning the
 * item is still shown in the sidebar but rendered as non-navigable.
 */
export function resolveNavLink(group: MenuGroupKey, path: string[], organizationId: string | null): string[] | null {
  if (group === 'admin') return ['/admin', ...path];
  return organizationId ? ['/organizations', organizationId, ...path] : null;
}
