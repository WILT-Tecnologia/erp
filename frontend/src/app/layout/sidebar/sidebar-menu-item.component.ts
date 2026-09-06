import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

import { MenuGroupKey, SidebarNavItem, resolveNavLink } from './sidebar-nav';

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
  templateUrl: './sidebar-menu-item.component.html',
})
export class SidebarMenuItemComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly item = input.required<SidebarNavItem>();
  readonly group = input.required<MenuGroupKey>();
  readonly organizationId = input<string | null>(null);
  readonly collapsed = input(false);

  readonly linkClick = output<void>();

  readonly hasChildren = computed(() => !!this.item().children?.length);
  readonly link = computed(() => resolveNavLink(this.group(), this.item().path, this.organizationId()));

  readonly expanded = signal(false);

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
    this.expanded.update((value) => !value);
  }

  resolveChildLink(child: SidebarNavItem): string[] | null {
    return resolveNavLink(this.group(), child.path, this.organizationId());
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

    if (isActive) this.expanded.set(true);
  }
}
