import { BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { map } from 'rxjs';

import { STORAGE_KEYS } from '../../core/constants/api-endpoints';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

const MOBILE_BREAKPOINT = '(max-width: 767.98px)';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, MatSidenavModule],
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly isHandset = toSignal(
    this.breakpointObserver.observe(MOBILE_BREAKPOINT).pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  readonly sidenavMode = computed<'over' | 'side'>(() => (this.isHandset() ? 'over' : 'side'));
  readonly mobileOpened = signal(false);
  readonly sidenavOpened = computed(() => (this.isHandset() ? this.mobileOpened() : true));
  readonly collapsed = signal(this.readCollapsed());
  readonly sidenavWidthPx = computed(() => (this.collapsed() && !this.isHandset() ? 64 : 256));

  toggleMobileMenu(): void {
    this.mobileOpened.update((opened) => !opened);
  }

  closeMobileMenu(): void {
    this.mobileOpened.set(false);
  }

  toggleCollapse(): void {
    this.collapsed.update((collapsed) => !collapsed);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(this.collapsed()));
    }
  }

  private readCollapsed(): boolean {
    return this.isBrowser && localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === 'true';
  }
}
