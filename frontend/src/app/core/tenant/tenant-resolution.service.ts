import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

import { environment } from '../../../environments/environment';

/**
 * Identifies whether the app is currently loaded from a tenant's own
 * subdomain (e.g. `igreja-central.localhost:4200`) or from the central/admin
 * domain (e.g. `localhost:4200`). The backend performs the real tenant
 * identification (InitializeTenancyByDomain, based on the request's Host) —
 * this service only mirrors that same hostname-based logic on the frontend
 * so the UI can decide which login form/flow to present.
 */
@Injectable({ providedIn: 'root' })
export class TenantResolutionService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Subdomain segment (e.g. `igreja-central`), or `null` on the central domain / server. */
  subdomain(): string | null {
    if (!this.isBrowser) return null;

    const hostname = window.location.hostname;
    const suffix = `.${environment.tenantBaseDomain}`;

    if (hostname === environment.tenantBaseDomain || !hostname.endsWith(suffix)) {
      return null;
    }

    return hostname.slice(0, -suffix.length);
  }

  isTenantHost(): boolean {
    return this.subdomain() !== null;
  }

  /** Same hostname as the current page, but pointed at the API's port. */
  tenantApiOrigin(): string {
    const apiPort = new URL(environment.apiUrl).port;
    return `${window.location.protocol}//${window.location.hostname}${apiPort ? `:${apiPort}` : ''}`;
  }
}
