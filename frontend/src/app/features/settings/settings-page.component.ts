import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule,
  ],
  templateUrl: './settings-page.component.html',
})
export class SettingsPageComponent {
  private readonly auth = inject(AuthService);
  private readonly notification = inject(NotificationService);
  private readonly fb = inject(FormBuilder);

  readonly admin = this.auth.admin;

  readonly initials = computed(() => {
    const name = this.admin()?.name ?? 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  readonly passwordForm = this.fb.nonNullable.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  });

  readonly emailNotifications = signal(true);
  readonly browserNotifications = signal(true);

  readonly theme = signal<'light' | 'dark' | 'system'>('system');
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
    this.theme.set(value);
  }

  setLanguage(value: string): void {
    this.language.set(value);
  }
}
