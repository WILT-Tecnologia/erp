import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { type ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideEnvironmentNgxMask } from 'ngx-mask';

import { routes } from './app.routes';
import { AuthService } from './core/auth/auth.service';
import { TenantAuthService } from './core/auth/tenant-auth.service';
import { authInterceptor } from './core/http/interceptors/auth.interceptor';
import { errorInterceptor } from './core/http/interceptors/error.interceptor';
import { tenantContextInterceptor } from './core/http/interceptors/tenant-context.interceptor';
import { tenantHostRewriteInterceptor } from './core/http/interceptors/tenant-host-rewrite.interceptor';
import { PtBrPaginatorIntl } from './shared/i18n/pt-br-paginator-intl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      const tenantAuthService = inject(TenantAuthService);

      if (tenantAuthService.isAuthenticated()) {
        tenantAuthService.fetchMe().subscribe({ error: () => undefined });
      } else if (authService.isAuthenticated()) {
        authService.fetchMe().subscribe({ error: () => undefined });
      }
    }),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptors([tenantHostRewriteInterceptor, authInterceptor, tenantContextInterceptor, errorInterceptor]),
    ),
    provideEnvironmentNgxMask(),
    provideCharts(withDefaultRegisterables()),
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { maxWidth: '95vw', maxHeight: '95vh' } },
    { provide: MatPaginatorIntl, useClass: PtBrPaginatorIntl },
  ],
};
