import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

import { TenantContextService } from '../../core/tenant/tenant-context.service';
import { AccordionGroupService } from './accordion-group.service';
import { SidebarNavItem, SidebarNavSection, buildSidebarNav } from './sidebar-nav';
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
  providers: [AccordionGroupService],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private readonly tenantContext = inject(TenantContextService);
  private readonly router = inject(Router);

  readonly collapsed = input(false);
  readonly linkClick = output<void>();

  private readonly navSections = buildSidebarNav(this.router.config);

  readonly sections = computed(() => {
    if (this.tenantContext.isSuperAdmin()) return this.navSections;
    if (this.tenantContext.isTenantUser()) return this.navSections.filter((section) => section.key !== 'admin');
    return [];
  });

  /**
   * When the sidebar is collapsed to a rail, every section renders as a
   * single icon (the section's "parent route") — its own items only appear
   * in a flyout menu when clicked. A "bare" section already has exactly one
   * plain item (Dashboard/Relatórios), which is used as-is; every other
   * section is wrapped into a synthetic item whose `children` are the
   * section's real items, reusing `SidebarMenuItemComponent`'s existing
   * has-children/flyout rendering with no further changes.
   */
  readonly collapsedEntries = computed(() =>
    this.sections().map((section) => ({
      section,
      item: section.bare
        ? section.items[0]
        : ({ title: section.label, icon: section.icon, path: [], children: section.items } as SidebarNavItem),
    })),
  );

  /** Only one top-level section is ever open at a time. */
  private readonly openSectionKey = signal<string | null>('admin');

  isSectionOpen(key: string): boolean {
    return this.openSectionKey() === key;
  }

  toggleSection(key: string): void {
    this.openSectionKey.update((current) => (current === key ? null : key));
  }

  /** A section that requires an organization context is disabled as a whole until one is available. */
  sectionDisabled(section: SidebarNavSection): boolean {
    return section.basePath.includes(':organizationId') && !this.organizationId();
  }

  organizationId(): string | null {
    return this.tenantContext.organizationSlug();
  }
}
