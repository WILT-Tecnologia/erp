import { type HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { TenantAuthService } from '../../auth/tenant-auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tenantAuthService = inject(TenantAuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (req.url.includes('/tenant/')) {
          tenantAuthService.clearSession();
        } else {
          authService.clearSession();
        }
      }
      return throwError(() => error);
    }),
  );
};
