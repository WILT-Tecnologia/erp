import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, type Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { type ApiCollection, type ApiResource } from '../../core/http/api-response.model';
import { type Organization, type OrganizationFormValue } from './organization.model';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}${API_ENDPOINTS.organizations.base}`;

  list(): Observable<Organization[]> {
    return this.http.get<ApiCollection<Organization>>(this.baseUrl).pipe(map((response) => response.data));
  }

  get(id: string): Observable<Organization> {
    return this.http.get<ApiResource<Organization>>(`${this.baseUrl}/${id}`).pipe(map((response) => response.data));
  }

  create(payload: OrganizationFormValue): Observable<Organization> {
    return this.http.post<ApiResource<Organization>>(this.baseUrl, payload).pipe(map((response) => response.data));
  }

  update(id: string, payload: OrganizationFormValue): Observable<Organization> {
    return this.http
      .put<ApiResource<Organization>>(`${this.baseUrl}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  suspend(id: string): Observable<Organization> {
    return this.http
      .post<ApiResource<Organization>>(`${environment.apiUrl}${API_ENDPOINTS.organizations.suspend(id)}`, {})
      .pipe(map((response) => response.data));
  }

  activate(id: string): Observable<Organization> {
    return this.http
      .post<ApiResource<Organization>>(`${environment.apiUrl}${API_ENDPOINTS.organizations.activate(id)}`, {})
      .pipe(map((response) => response.data));
  }
}
