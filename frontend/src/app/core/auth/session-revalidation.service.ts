import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { interval } from 'rxjs';

import { AuthService } from './auth.service';
import { TenantAuthService } from './tenant-auth.service';

/** How often an already-open session re-pulls /me to pick up role/permission/status changes. */
const REVALIDATION_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Keeps a logged-in session's user/permissions fresh without waiting for a
 * 401. Guards only check cached signals at navigation time (see
 * `auth.guard.ts`), so without this, a revoked permission or a deactivated
 * account would only be noticed the next time some other request happens to
 * 401 (`error.interceptor.ts`).
 */
@Injectable({ providedIn: 'root' })
export class SessionRevalidationService {
  private readonly authService = inject(AuthService);
  private readonly tenantAuthService = inject(TenantAuthService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private started = false;

  /** Idempotent — safe to call every time the authenticated shell mounts. */
  start(): void {
    if (!this.isBrowser || this.started) return;
    this.started = true;

    interval(REVALIDATION_INTERVAL_MS).subscribe(() => this.revalidate());
  }

  revalidate(): void {
    if (this.tenantAuthService.isAuthenticated()) {
      this.tenantAuthService.fetchMe().subscribe({ error: () => undefined });
      return;
    }

    if (this.authService.isAuthenticated()) {
      this.authService.fetchMe().subscribe({ error: () => undefined });
    }
  }
}
