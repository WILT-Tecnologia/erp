import { computed, inject, Injectable } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { TenantAuthService } from '../auth/tenant-auth.service';
import { OrganizationContextService } from '../organization/organization-context.service';

export type TenantScope = 'global' | 'tenant';

/**
 * Layers super-admin/scope semantics on top of OrganizationContextService's
 * route-derived organization resolution, rather than replacing it. Also
 * layers a real tenant-user session (TenantAuthService) on top: when a
 * tenant user is logged in, their session's organization always wins — it
 * doesn't depend on the URL, unlike the super-admin-crosses-into-an-org path.
 */
@Injectable({ providedIn: 'root' })
export class TenantContextService {
  private readonly auth = inject(AuthService);
  private readonly tenantAuth = inject(TenantAuthService);
  private readonly orgContext = inject(OrganizationContextService);

  readonly isSuperAdmin = computed(() => this.auth.admin()?.is_super_admin ?? false);
  readonly isTenantUser = computed(() => this.tenantAuth.isAuthenticated());

  readonly organization = computed(() => this.tenantAuth.organization() ?? this.orgContext.organization());

  /** Value is the organization's slug, not its UUID. */
  readonly organizationSlug = computed(() => this.tenantAuth.organization()?.slug ?? this.orgContext.organizationId());

  readonly scope = computed<TenantScope>(() => (this.organizationSlug() ? 'tenant' : 'global'));

  /**
   * Super admins bypass permission checks entirely (they aren't tenant users
   * and have no `permissions` list to check against). Scaffolding for
   * per-route authorization — nothing calls this with a real requirement
   * yet, since no tenant route declares `data.requiredPermission`.
   */
  hasPermission(name: string): boolean {
    if (this.isSuperAdmin()) return true;
    return (this.tenantAuth.tenantUser()?.permissions ?? []).includes(name);
  }

  hasAnyPermission(names: string[]): boolean {
    if (this.isSuperAdmin()) return true;
    if (names.length === 0) return true;
    return names.some((name) => this.hasPermission(name));
  }
}
