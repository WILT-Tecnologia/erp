import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { type MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';

import { AuthService } from '../../core/auth/auth.service';
import { TenantAuthService } from '../../core/auth/tenant-auth.service';
import { TenantContextService } from '../../core/tenant/tenant-context.service';
import { ThemeService } from '../../core/theme/theme.service';
import { TextFieldComponent } from '../../shared/components/fields/text-field/text-field.component';
import { NotificationService } from '../../shared/services/notification.service';
import { PASSWORD_HINT, PASSWORD_PATTERN } from '../../shared/utils/validators.util';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule,
    TextFieldComponent,
  ],
  templateUrl: './settings-page.component.html',
})
export class SettingsPageComponent {
  private readonly auth = inject(AuthService);
  private readonly tenantAuth = inject(TenantAuthService);
  private readonly tenantContext = inject(TenantContextService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  private readonly themeService = inject(ThemeService);

  // A super admin browsing into an organization has no TenantAuthService
  // session, so their own Admin identity is the correct one to show; a real
  // tenant user has no Admin session, so their TenantUser identity is used.
  readonly displayName = computed(() =>
    this.tenantContext.isSuperAdmin() ? this.auth.admin()?.name : this.tenantAuth.tenantUser()?.name,
  );
  readonly displayEmail = computed(() =>
    this.tenantContext.isSuperAdmin() ? this.auth.admin()?.email : this.tenantAuth.tenantUser()?.email,
  );

  readonly initials = computed(() => {
    const name = this.displayName() ?? 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  readonly passwordHint = PASSWORD_HINT;

  readonly passwordForm = this.fb.nonNullable.group({
    newPassword: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]],
    confirmPassword: ['', Validators.required],
  });

  readonly emailNotifications = signal(true);
  readonly browserNotifications = signal(true);

  readonly theme = this.themeService.theme;
  readonly language = signal('pt-BR');

  submitPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    const { newPassword, confirmPassword } = this.passwordForm.getRawValue();
    if (newPassword !== confirmPassword) {
      this.notification.error('As senhas não coincidem.');
      return;
    }
    this.notification.success('Senha atualizada com sucesso!');
    this.passwordForm.reset();
  }

  toggleEmailNotifications(event: MatSlideToggleChange): void {
    this.emailNotifications.set(event.checked);
    this.notification.success('Preferência de notificação atualizada.');
  }

  toggleBrowserNotifications(event: MatSlideToggleChange): void {
    this.browserNotifications.set(event.checked);
    this.notification.success('Preferência de notificação atualizada.');
  }

  setTheme(value: 'light' | 'dark' | 'system'): void {
    this.themeService.setTheme(value);
  }

  setLanguage(value: string): void {
    this.language.set(value);
  }
}
