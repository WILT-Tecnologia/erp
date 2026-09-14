import { inject } from '@angular/core';
import { type ActivatedRouteSnapshot, type CanActivateFn, Router } from '@angular/router';

import { TenantContextService } from '../tenant/tenant-context.service';

/**
 * Opt-in, per-route permission check: reads `data.requiredPermission` (a
 * permission name, or a list of names where any one is sufficient). Routes
 * that don't declare it are unaffected — this exists so modules can adopt
 * permission gating incrementally as `menu_routes`/`permission_definitions`
 * get wired up, without having to touch every route at once.
 */
export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const tenantContext = inject(TenantContextService);
  const router = inject(Router);

  const required = route.data['requiredPermission'] as string | string[] | undefined;
  if (!required) return true;

  const names = Array.isArray(required) ? required : [required];
  if (tenantContext.hasAnyPermission(names)) return true;

  const slug = tenantContext.organizationSlug();
  return router.createUrlTree(slug ? ['/organizations', slug, 'dashboard'] : ['/login']);
};
