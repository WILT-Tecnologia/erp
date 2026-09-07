import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, type OnInit, output } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';

import { AccordionGroupService } from './accordion-group.service';
import { resolveNavLink, type SidebarNavItem } from './sidebar-nav';

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

  /** Current router URL as a signal, so `isActive` recomputes on every navigation. */
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  /** True while the user is on this item's own route or one of its descendants. */
  readonly isActive = computed(() => {
    this.currentUrl();
    const link = this.link();
    if (!link) return false;

    return this.router.isActive(this.router.createUrlTree(link), {
      paths: 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  });

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
    /** Keeps the accordion open while the user is on a route inside it — only closable once they navigate away. */
    if (this.expanded() && this.isActive()) return;
    this.siblings.toggle(this.item().title);
  }

  resolveChildLink(child: SidebarNavItem): string[] | null {
    return resolveNavLink(this.basePath(), child.path, this.organizationId());
  }

  private updateExpanded(): void {
    if (!this.hasChildren()) return;
    if (this.isActive()) this.siblings.open(this.item().title);
  }
}
