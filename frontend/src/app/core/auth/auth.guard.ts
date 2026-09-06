import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { TenantAuthService } from './tenant-auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const tenantAuthService = inject(TenantAuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() || tenantAuthService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const tenantAuthService = inject(TenantAuthService);
  const router = inject(Router);

  if (tenantAuthService.isAuthenticated()) {
    const slug = tenantAuthService.organization()?.slug;
    return router.createUrlTree(slug ? ['/organizations', slug, 'dashboard'] : ['/admin/dashboard']);
  }

  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/admin/dashboard']);
  }

  return true;
};
