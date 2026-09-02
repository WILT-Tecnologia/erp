import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
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
  readonly breadcrumbService = inject(BreadcrumbService);

  readonly showMenuButton = input(false);
  readonly menuToggle = output<void>();

  logout(): void {
    this.authService.logout();
  }
}
