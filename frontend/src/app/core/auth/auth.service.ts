import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, type Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants/api-endpoints';
import { type Admin, type LoginPayload, type LoginResponse } from './admin.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _admin = signal<Admin | null>(this.readStoredAdmin());
  private readonly _token = signal<string | null>(this.readStoredToken());
  private readonly _isLoading = signal(false);

  readonly admin = this._admin.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  private readStoredToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(STORAGE_KEYS.authToken);
  }

  private readStoredAdmin(): Admin | null {
    if (!this.isBrowser) return null;
    const raw = localStorage.getItem(STORAGE_KEYS.authUser);
    return raw ? (JSON.parse(raw) as Admin) : null;
  }

  login(payload: LoginPayload): Observable<LoginResponse> {
    this._isLoading.set(true);
    return this.http.post<LoginResponse>(`${environment.apiUrl}${API_ENDPOINTS.auth.login}`, payload).pipe(
      tap((response) => this.setSession(response)),
      finalize(() => this._isLoading.set(false)),
    );
  }

  fetchMe(): Observable<Admin> {
    return this.http
      .get<Admin>(`${environment.apiUrl}${API_ENDPOINTS.auth.me}`)
      .pipe(tap((admin) => this.setAdmin(admin)));
  }

  logout(): void {
    this.http.post(`${environment.apiUrl}${API_ENDPOINTS.auth.logout}`, {}).subscribe({
      complete: () => this.clearSession(),
      error: () => this.clearSession(),
    });
  }

  private setSession(response: LoginResponse): void {
    this._admin.set(response.admin);
    this._token.set(response.token);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEYS.authToken, response.token);
      localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(response.admin));
    }
  }

  private setAdmin(admin: Admin): void {
    this._admin.set(admin);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(admin));
    }
  }

  clearSession(): void {
    this._admin.set(null);
    this._token.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(STORAGE_KEYS.authToken);
      localStorage.removeItem(STORAGE_KEYS.authUser);
    }
    this.router.navigate(['/login']);
  }
}
