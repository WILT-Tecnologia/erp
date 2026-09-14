import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { of, startWith, switchMap } from 'rxjs';

import { TenantContextService } from '../../core/tenant/tenant-context.service';
import { type MenuRoute } from '../../features/menu-routes/menu-route.model';
import { MenuRouteService } from '../../features/menu-routes/menu-route.service';
import { AccordionGroupService } from './accordion-group.service';
import { SidebarMenuItemComponent } from './sidebar-menu-item.component';
import {
  buildAdminMenuSections,
  buildSidebarNav,
  buildTenantMenuSections,
  type SidebarNavItem,
  type SidebarNavSection,
} from './sidebar-nav';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatButtonModule, MatListModule, SidebarMenuItemComponent],
  providers: [AccordionGroupService],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  private readonly tenantContext = inject(TenantContextService);
  private readonly router = inject(Router);
  private readonly menuRouteService = inject(MenuRouteService);

  readonly collapsed = input(false);
  readonly linkClick = output<void>();

  /**
   * Static fallback, built from the route config — used while a dynamic
   * fetch below hasn't resolved yet (or failed), so the sidebar is never
   * left empty just because of a slow/erroring request.
   */
  private readonly navSections = buildSidebarNav(this.router.config);

  /**
   * Admin sidebar: built from `menu_routes` (category "Administração").
   * Only fetched for a super admin session — a tenant user has no admin
   * token, so calling this endpoint for them would just 401. Refetches
   * whenever `MenuRouteService.changes$` fires (a save in the menu-routes
   * CRUD dialog), so edits show up without a page reload.
   */
  private readonly adminMenuRoutes = toSignal(
    this.tenantContext.isSuperAdmin()
      ? this.menuRouteService.changes$.pipe(
          startWith(undefined),
          switchMap(() => this.menuRouteService.tree()),
        )
      : of<MenuRoute[]>([]),
    { initialValue: [] as MenuRoute[] },
  );

  private readonly adminSections = computed(() => buildAdminMenuSections(this.adminMenuRoutes(), this.router.config));

  /**
   * Tenant user sidebar: built from `menu_routes`, permission-filtered by
   * their own `TenantUser.permissions`. Only fetched for an actual tenant
   * session — a super admin has no tenant token, so calling this endpoint
   * for them would just 401 and trigger an unwanted tenant-session clear.
   * Also refetches on `MenuRouteService.changes$` — see `adminMenuRoutes`.
   */
  private readonly tenantMenuRoutes = toSignal(
    this.tenantContext.isTenantUser()
      ? this.menuRouteService.changes$.pipe(
          startWith(undefined),
          switchMap(() => this.menuRouteService.tenantTree()),
        )
      : of<MenuRoute[]>([]),
    { initialValue: [] as MenuRoute[] },
  );

  private readonly tenantSections = computed(() =>
    buildTenantMenuSections(this.tenantMenuRoutes(), this.router.config, (names) =>
      this.tenantContext.hasAnyPermission(names),
    ),
  );

  readonly sections = computed(() => {
    if (this.tenantContext.isSuperAdmin()) {
      const dynamicAdmin = this.adminSections();
      const staticTenant = this.navSections.filter((section) => section.key !== 'admin');
      return dynamicAdmin.length > 0 ? [...dynamicAdmin, ...staticTenant] : this.navSections;
    }
    if (this.tenantContext.isTenantUser()) {
      const dynamicTenant = this.tenantSections();
      return dynamicTenant.length > 0 ? dynamicTenant : this.navSections.filter((section) => section.key !== 'admin');
    }
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
