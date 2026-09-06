import { Injectable, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { catchError, distinctUntilChanged, filter, map, of, startWith, switchMap } from 'rxjs';

import { TenantAuthService } from '../auth/tenant-auth.service';
import { Organization } from '../../features/organizations/organization.model';
import { OrganizationService } from '../../features/organizations/organization.service';

/**
 * Resolves which organization is currently being viewed, based on the
 * `:organizationId` route param nested under `/organizations/:organizationId/...`.
 * Returns `null` outside of that route group (e.g. on `/admin/...` routes).
 *
 * Only fetches via the admin-only `GET /admin/organizations/{slug}` endpoint
 * for the super-admin-crosses-into-an-org case. A real tenant-user session
 * already has its organization from login/me (TenantAuthService) and has no
 * admin token to call that endpoint with, so the fetch is skipped entirely.
 */
@Injectable({ providedIn: 'root' })
export class OrganizationContextService {
  private readonly router = inject(Router);
  private readonly organizationService = inject(OrganizationService);
  private readonly tenantAuth = inject(TenantAuthService);

  readonly organizationId = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.extractOrganizationId(this.router.routerState.root)),
      startWith(null),
      distinctUntilChanged(),
    ),
    { initialValue: null as string | null },
  );

  readonly organization = toSignal(
    toObservable(this.organizationId).pipe(
      switchMap((id) =>
        id && !this.tenantAuth.isAuthenticated()
          ? this.organizationService.get(id).pipe(catchError(() => of(null)))
          : of(null),
      ),
    ),
    { initialValue: null as Organization | null },
  );

  private extractOrganizationId(route: ActivatedRoute): string | null {
    let current: ActivatedRoute | null = route;
    while (current) {
      const id = current.snapshot?.paramMap.get('organizationId');
      if (id) return id;
      current = current.firstChild;
    }
    return null;
  }
}
