import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { TenantResolutionService } from '../../tenant/tenant-resolution.service';

/**
 * When the app is loaded from a tenant's own subdomain (e.g.
 * `igreja-central.localhost:4200`), rewrites API calls from the configured
 * `environment.apiUrl` origin to that same hostname on the API's port
 * (e.g. `igreja-central.localhost:8989`), so the backend's
 * InitializeTenancyByDomain middleware can identify the tenant from the
 * request's Host header without the frontend needing to know/send a
 * tenant id explicitly.
 */
export const tenantHostRewriteInterceptor: HttpInterceptorFn = (req, next) => {
  const tenantResolution = inject(TenantResolutionService);

  if (!tenantResolution.isTenantHost() || !req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const rewrittenUrl = req.url.replace(environment.apiUrl, `${tenantResolution.tenantApiOrigin()}/api`);

  return next(req.clone({ url: rewrittenUrl }));
};
