import { Component, inject, type OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';

import { TenantContextService } from '../../core/tenant/tenant-context.service';
import { type Organization } from '../../features/organizations/organization.model';
import { OrganizationService } from '../../features/organizations/organization.service';

@Component({
  selector: 'app-tenant-selector',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './tenant-selector.component.html',
})
export class TenantSelectorComponent implements OnInit {
  private readonly organizationService = inject(OrganizationService);
  private readonly router = inject(Router);
  readonly tenantContext = inject(TenantContextService);

  readonly organizations = signal<Organization[]>([]);

  ngOnInit(): void {
    this.organizationService
      .list({ perPage: 100 })
      .subscribe((response) => this.organizations.set(response.data));
  }

  selectGlobal(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  selectOrganization(organization: Organization): void {
    this.router.navigate(['/organizations', organization.slug, 'dashboard']);
  }
}
