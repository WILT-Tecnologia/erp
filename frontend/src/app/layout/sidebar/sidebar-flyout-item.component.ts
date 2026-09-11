import { Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

import { resolveNavLink, type SidebarNavItem } from './sidebar-nav';

/**
 * Renders one item inside a collapsed-rail flyout `mat-menu`, recursing into
 * itself for nested children. Declaring `<mat-menu>` directly in this
 * component's own template (rather than through a shared `*ngTemplateOutlet`)
 * is what lets Angular Material detect the parent/child menu relationship —
 * required for its native "keep parent open, open submenu beside it" nested
 * menu behavior.
 */
@Component({
  selector: 'app-sidebar-flyout-item',
  standalone: true,
  imports: [RouterLink, MatIconModule, MatMenuModule, SidebarFlyoutItemComponent],
  templateUrl: './sidebar-flyout-item.component.html',
})
export class SidebarFlyoutItemComponent {
  readonly item = input.required<SidebarNavItem>();
  readonly basePath = input.required<string[]>();
  readonly organizationId = input<string | null>(null);

  readonly linkClick = output<void>();

  readonly link = computed(() => resolveNavLink(this.basePath(), this.item().path, this.organizationId()));
}
