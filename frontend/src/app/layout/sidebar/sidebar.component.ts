import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

import { TenantContextService } from '../../core/tenant/tenant-context.service';
import { MenuGroupKey, buildSidebarNav } from './sidebar-nav';
import { SidebarMenuItemComponent } from './sidebar-menu-item.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatListModule,
    SidebarMenuItemComponent,
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private readonly tenantContext = inject(TenantContextService);
  private readonly router = inject(Router);

  readonly collapsed = input(false);
  readonly collapseToggle = output<void>();
  readonly linkClick = output<void>();

  private readonly navGroups = buildSidebarNav(this.router.config);

  readonly groups = computed(() => {
    if (this.tenantContext.isSuperAdmin()) return this.navGroups;
    if (this.tenantContext.isTenantUser()) return this.navGroups.filter((group) => group.key === 'organization');
    return [];
  });

  private readonly groupOpen = signal<Record<MenuGroupKey, boolean>>({ admin: true, organization: true });

  isGroupOpen(key: MenuGroupKey): boolean {
    return this.groupOpen()[key];
  }

  toggleGroup(key: MenuGroupKey): void {
    this.groupOpen.update((state) => ({ ...state, [key]: !state[key] }));
  }

  organizationId(): string | null {
    return this.tenantContext.organizationSlug();
  }
}
