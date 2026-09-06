import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, type OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule, type MatMenuTrigger } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

import { AccordionGroupService } from './accordion-group.service';
import { resolveNavLink, type SidebarNavItem } from './sidebar-nav';

const HOVER_CLOSE_DELAY_MS = 150;

@Component({
  selector: 'app-sidebar-menu-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatTooltipModule,
    MatListModule,
    MatMenuModule,
    SidebarMenuItemComponent,
  ],
  providers: [AccordionGroupService],
  templateUrl: './sidebar-menu-item.component.html',
})
export class SidebarMenuItemComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  /** The exclusive-accordion group this item belongs to (provided by its parent). */
  private readonly siblings = inject(AccordionGroupService, { skipSelf: true });

  readonly item = input.required<SidebarNavItem>();
  readonly basePath = input.required<string[]>();
  readonly organizationId = input<string | null>(null);
  readonly collapsed = input(false);

  readonly linkClick = output<void>();

  readonly hasChildren = computed(() => !!this.item().children?.length);
  readonly link = computed(() => resolveNavLink(this.basePath(), this.item().path, this.organizationId()));
  /** True when this item (leaf or with children) needs an organization context that isn't available yet. */
  readonly disabled = computed(() => this.basePath().includes(':organizationId') && !this.organizationId());

  readonly expanded = computed(() => this.siblings.isOpen(this.item().title));

  private closeTimeout: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.updateExpanded());
  }

  ngOnInit(): void {
    this.updateExpanded();
  }

  toggle(event: Event): void {
    event.stopPropagation();
    this.siblings.toggle(this.item().title);
  }

  resolveChildLink(child: SidebarNavItem): string[] | null {
    return resolveNavLink(this.basePath(), child.path, this.organizationId());
  }

  /** Collapsed-rail flyout: open immediately on hover, no click required. */
  openOnHover(trigger: MatMenuTrigger): void {
    this.cancelClose();
    trigger.openMenu();
  }

  /** Collapsed-rail flyout: close shortly after the pointer leaves, canceled if it returns in time. */
  scheduleClose(trigger: MatMenuTrigger): void {
    this.cancelClose();
    this.closeTimeout = setTimeout(() => trigger.closeMenu(), HOVER_CLOSE_DELAY_MS);
  }

  cancelClose(): void {
    if (this.closeTimeout === undefined) return;
    clearTimeout(this.closeTimeout);
    this.closeTimeout = undefined;
  }

  private updateExpanded(): void {
    const link = this.link();
    if (!this.hasChildren() || !link) return;

    const isActive = this.router.isActive(this.router.createUrlTree(link), {
      paths: 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });

    if (isActive) this.siblings.open(this.item().title);
  }
}
