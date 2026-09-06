import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { TenantAuthService } from '../../core/auth/tenant-auth.service';
import { ThemeService } from '../../core/theme/theme.service';
import { BreadcrumbService } from '../breadcrumb/breadcrumb.service';
import { TenantSelectorComponent } from '../tenant-selector/tenant-selector.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    RouterLink,
    TenantSelectorComponent,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly authService = inject(AuthService);
  readonly tenantAuthService = inject(TenantAuthService);
  readonly breadcrumbService = inject(BreadcrumbService);
  readonly themeService = inject(ThemeService);

  readonly showMenuButton = input(false);
  readonly menuToggle = output<void>();

  readonly collapsed = input(false);
  readonly collapseToggle = output<void>();

  readonly principalName = computed(() => this.authService.admin()?.name ?? this.tenantAuthService.tenantUser()?.name);
  readonly principalEmail = computed(
    () => this.authService.admin()?.email ?? this.tenantAuthService.tenantUser()?.email,
  );

  toggleTheme(): void {
    this.themeService.setTheme(this.themeService.resolvedScheme() === 'dark' ? 'light' : 'dark');
  }

  logout(): void {
    if (this.tenantAuthService.isAuthenticated()) {
      this.tenantAuthService.logout();
      return;
    }
    this.authService.logout();
  }
}
