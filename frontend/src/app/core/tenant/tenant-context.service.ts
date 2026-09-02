import { Injectable, computed, inject } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { OrganizationContextService } from '../organization/organization-context.service';

export type TenantScope = 'global' | 'tenant';

/**
 * Layers super-admin/scope semantics on top of OrganizationContextService's
 * route-derived organization resolution, rather than replacing it.
 */
@Injectable({ providedIn: 'root' })
export class TenantContextService {
  private readonly auth = inject(AuthService);
  private readonly orgContext = inject(OrganizationContextService);

  readonly isSuperAdmin = computed(() => this.auth.admin()?.is_super_admin ?? false);

  /** Value is the organization's slug (see OrganizationContextService), not its UUID. */
  readonly organizationSlug = this.orgContext.organizationId;
  readonly organization = this.orgContext.organization;

  readonly scope = computed<TenantScope>(() => (this.organizationSlug() ? 'tenant' : 'global'));
}
