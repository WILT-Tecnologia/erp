import { inject } from '@angular/core';
import { type ActivatedRouteSnapshot, type CanActivateFn, Router } from '@angular/router';

import { TenantContextService } from '../tenant/tenant-context.service';

/**
 * Guards `organizations/:organizationId`. Super admins may cross into any
 * organization. A tenant user may only access their own organization's
 * routes — this is a frontend guard rail only; real isolation is enforced
 * backend-side via per-schema tokens (a tenant-A token simply cannot
 * authenticate against tenant-B's schema).
 */
export const tenantAccessGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const tenantContext = inject(TenantContextService);
  const router = inject(Router);

  if (tenantContext.isSuperAdmin()) {
    return true;
  }

  if (tenantContext.isTenantUser()) {
    const requestedSlug = route.paramMap.get('organizationId');
    if (requestedSlug === tenantContext.organizationSlug()) {
      return true;
    }
    return router.createUrlTree(['/organizations', tenantContext.organizationSlug()!, 'dashboard']);
  }

  return router.createUrlTree(['/login']);
};
