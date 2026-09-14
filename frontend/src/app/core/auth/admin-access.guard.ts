import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { TenantAuthService } from './tenant-auth.service';

/**
 * Guards the `admin` route group. A tenant user (no central Admin session)
 * has no business inside the central/admin app — send them back to their
 * own org's dashboard instead.
 */
export const adminAccessGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const tenantAuthService = inject(TenantAuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  const slug = tenantAuthService.organization()?.slug;
  return router.createUrlTree(slug ? ['/organizations', slug, 'dashboard'] : ['/login']);
};
