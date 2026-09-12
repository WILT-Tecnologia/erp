import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, type Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { type Admin } from '../../core/auth/admin.model';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { type ApiCollection, type ApiResource } from '../../core/http/api-response.model';

export interface AdminFormValue {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
}

export interface AdminListParams {
  page?: number;
  perPage?: number;
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}${API_ENDPOINTS.admins}`;

  list(params: AdminListParams = {}): Observable<ApiCollection<Admin>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.perPage) httpParams = httpParams.set('per_page', params.perPage);
    if (params.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<ApiCollection<Admin>>(this.baseUrl, { params: httpParams });
  }

  create(payload: AdminFormValue): Observable<Admin> {
    return this.http.post<ApiResource<Admin>>(this.baseUrl, payload).pipe(map((response) => response.data));
  }

  update(id: string, payload: AdminFormValue): Observable<Admin> {
    return this.http.put<ApiResource<Admin>>(`${this.baseUrl}/${id}`, payload).pipe(map((response) => response.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
