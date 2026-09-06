import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { authInterceptor } from './core/http/interceptors/auth.interceptor';
import { errorInterceptor } from './core/http/interceptors/error.interceptor';
import { tenantContextInterceptor } from './core/http/interceptors/tenant-context.interceptor';
import { tenantHostRewriteInterceptor } from './core/http/interceptors/tenant-host-rewrite.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        tenantHostRewriteInterceptor,
        authInterceptor,
        tenantContextInterceptor,
        errorInterceptor,
      ]),
    ),
    provideEnvironmentNgxMask(),
    provideCharts(withDefaultRegisterables()),
  ],
};
