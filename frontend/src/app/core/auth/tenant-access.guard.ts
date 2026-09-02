import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { TenantContextService } from '../tenant/tenant-context.service';

export const tenantAccessGuard: CanActivateFn = () => {
  const tenantContext = inject(TenantContextService);
  const router = inject(Router);

  if (tenantContext.isSuperAdmin()) {
    return true;
  }

  return router.createUrlTree(['/admin/dashboard']);
};
