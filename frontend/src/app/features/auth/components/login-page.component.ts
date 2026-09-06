import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { TenantAuthService } from '../../../core/auth/tenant-auth.service';
import { TenantResolutionService } from '../../../core/tenant/tenant-resolution.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly tenantAuthService = inject(TenantAuthService);
  private readonly tenantResolution = inject(TenantResolutionService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  readonly submitting = signal(false);
  readonly hidePassword = signal(true);
  readonly isTenantHost = this.tenantResolution.isTenantHost();

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    if (this.isTenantHost) {
      this.tenantAuthService.login(this.form.getRawValue()).subscribe({
        next: (response) => {
          this.submitting.set(false);
          const slug = response.organization?.slug;
          this.router.navigate(slug ? ['/organizations', slug, 'dashboard'] : ['/login']);
        },
        error: () => {
          this.submitting.set(false);
          this.notification.error('E-mail ou senha inválidos.');
        },
      });
      return;
    }

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.submitting.set(false);
        this.notification.error('E-mail ou senha inválidos.');
      },
    });
  }
}
