import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '../../auth/auth.service';
import { TenantAuthService } from '../../auth/tenant-auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tenantAuthService = inject(TenantAuthService);

  const token = req.url.includes('/tenant/') ? tenantAuthService.token() : authService.token();

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
