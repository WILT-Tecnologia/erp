import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { TenantContextService } from '../../tenant/tenant-context.service';

/**
 * Attaches X-Tenant-Id when navigating inside an organization's context.
 * Advisory only on the admin-tenant path — the backend's
 * InitializeTenancyForAdmin middleware resolves the organization from the
 * authorized route segment, never from this header, so a stale/bogus value
 * here has no effect on which schema is used.
 */
export const tenantContextInterceptor: HttpInterceptorFn = (req, next) => {
  const tenantContext = inject(TenantContextService);
  const organization = tenantContext.organization();

  if (!organization || !req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { 'X-Tenant-Id': organization.id },
    }),
  );
};
