import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { ApiCollection, ApiResource } from '../../core/http/api-response.model';
import { Admin } from '../../core/auth/admin.model';

export type AdminFormValue = {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
};

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}${API_ENDPOINTS.admins}`;

  list(): Observable<Admin[]> {
    return this.http.get<ApiCollection<Admin>>(this.baseUrl).pipe(map((response) => response.data));
  }

  create(payload: AdminFormValue): Observable<Admin> {
    return this.http.post<ApiResource<Admin>>(this.baseUrl, payload).pipe(map((response) => response.data));
  }

  update(id: string, payload: AdminFormValue): Observable<Admin> {
    return this.http
      .put<ApiResource<Admin>>(`${this.baseUrl}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
