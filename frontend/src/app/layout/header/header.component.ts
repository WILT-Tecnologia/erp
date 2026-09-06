import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { TenantAuthService } from '../../core/auth/tenant-auth.service';
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
    RouterLink,
    TenantSelectorComponent,
  ],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly authService = inject(AuthService);
  readonly tenantAuthService = inject(TenantAuthService);
  readonly breadcrumbService = inject(BreadcrumbService);

  readonly showMenuButton = input(false);
  readonly menuToggle = output<void>();

  readonly principalName = computed(
    () => this.authService.admin()?.name ?? this.tenantAuthService.tenantUser()?.name,
  );
  readonly principalEmail = computed(
    () => this.authService.admin()?.email ?? this.tenantAuthService.tenantUser()?.email,
  );

  logout(): void {
    if (this.tenantAuthService.isAuthenticated()) {
      this.tenantAuthService.logout();
      return;
    }
    this.authService.logout();
  }
}
