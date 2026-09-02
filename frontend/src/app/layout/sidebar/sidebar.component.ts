import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { TenantContextService } from '../../core/tenant/tenant-context.service';
import { MenuGroupKey, SIDEBAR_NAV, resolveNavLink } from './sidebar-nav';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule, MatTooltipModule, MatButtonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private readonly tenantContext = inject(TenantContextService);

  readonly collapsed = input(false);
  readonly collapseToggle = output<void>();
  readonly linkClick = output<void>();

  readonly groups = computed(() =>
    this.tenantContext.isSuperAdmin() ? SIDEBAR_NAV : SIDEBAR_NAV.filter((group) => group.key === 'admin'),
  );

  private readonly groupOpen = signal<Record<MenuGroupKey, boolean>>({ admin: true, organization: true });

  isGroupOpen(key: MenuGroupKey): boolean {
    return this.groupOpen()[key];
  }

  toggleGroup(key: MenuGroupKey): void {
    this.groupOpen.update((state) => ({ ...state, [key]: !state[key] }));
  }

  resolveLink(group: MenuGroupKey, slug: string): string[] | null {
    return resolveNavLink(group, slug, this.tenantContext.organizationSlug());
  }
}
