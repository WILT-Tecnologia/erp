import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, type Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants/api-endpoints';
import {
  type TenantLoginPayload,
  type TenantLoginResponse,
  type TenantOrganizationSummary,
  type TenantUser,
} from './tenant-user.model';

/**
 * Session for a regular tenant end user (as opposed to AuthService, which
 * handles the central Admin/super-admin identity). Kept as a separate
 * service — mirroring the backend's separate Admin/User models and
 * api-admin/api-tenant guards — so both sessions can coexist independently.
 */
@Injectable({ providedIn: 'root' })
export class TenantAuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _tenantUser = signal<TenantUser | null>(this.readStored<TenantUser>(STORAGE_KEYS.tenantAuthUser));
  private readonly _organization = signal<TenantOrganizationSummary | null>(
    this.readStored<TenantOrganizationSummary>(STORAGE_KEYS.tenantAuthOrganization),
  );
  private readonly _token = signal<string | null>(this.readStoredToken());
  private readonly _isLoading = signal(false);

  readonly tenantUser = this._tenantUser.asReadonly();
  readonly organization = this._organization.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  private readStoredToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(STORAGE_KEYS.tenantAuthToken);
  }

  private readStored<T>(key: string): T | null {
    if (!this.isBrowser) return null;
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  login(payload: TenantLoginPayload): Observable<TenantLoginResponse> {
    this._isLoading.set(true);
    return this.http.post<TenantLoginResponse>(`${environment.apiUrl}${API_ENDPOINTS.tenantAuth.login}`, payload).pipe(
      tap((response) => this.setSession(response)),
      finalize(() => this._isLoading.set(false)),
    );
  }

  fetchMe(): Observable<{ user: TenantUser; organization: TenantOrganizationSummary | null }> {
    return this.http
      .get<{ user: TenantUser; organization: TenantOrganizationSummary | null }>(
        `${environment.apiUrl}${API_ENDPOINTS.tenantAuth.me}`,
      )
      .pipe(tap((response) => this.setPrincipal(response.user, response.organization)));
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}${API_ENDPOINTS.tenantAuth.logout}`, {}).subscribe({
      complete: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  private setSession(response: TenantLoginResponse): void {
    this._token.set(response.token);
    this.setPrincipal(response.user, response.organization);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEYS.tenantAuthToken, response.token);
    }
  }

  private setPrincipal(user: TenantUser, organization: TenantOrganizationSummary | null): void {
    this._tenantUser.set(user);
    this._organization.set(organization);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEYS.tenantAuthUser, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.tenantAuthOrganization, JSON.stringify(organization));
    }
  }

  clearSession(): void {
    this._tenantUser.set(null);
    this._organization.set(null);
    this._token.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(STORAGE_KEYS.tenantAuthToken);
      localStorage.removeItem(STORAGE_KEYS.tenantAuthUser);
      localStorage.removeItem(STORAGE_KEYS.tenantAuthOrganization);
    }
    this.router.navigate(['/login']);
  }
}
