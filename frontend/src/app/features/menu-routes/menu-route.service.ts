import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, type Observable, Subject, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { type ApiCollection, type ApiResource } from '../../core/http/api-response.model';
import { type MenuRoute, type MenuRouteFormValue } from './menu-route.model';

export interface MenuRouteListParams {
  page?: number;
  perPage?: number;
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class MenuRouteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}${API_ENDPOINTS.menuRoutes.base}`;

  private readonly changes = new Subject<void>();
  /** Emits after a create/update/delete succeeds — the sidebar listens to this to refetch its tree live. */
  readonly changes$ = this.changes.asObservable();

  tree(): Observable<MenuRoute[]> {
    return this.http
      .get<ApiCollection<MenuRoute>>(`${environment.apiUrl}${API_ENDPOINTS.menuRoutes.tree}`)
      .pipe(map((response) => response.data));
  }

  /** Same tree, read through the tenant-scoped endpoint — used to build the tenant user's sidebar. */
  tenantTree(): Observable<MenuRoute[]> {
    return this.http
      .get<ApiCollection<MenuRoute>>(`${environment.apiUrl}${API_ENDPOINTS.tenantMenuRoutes.tree}`)
      .pipe(map((response) => response.data));
  }

  list(params: MenuRouteListParams = {}): Observable<ApiCollection<MenuRoute>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.perPage) httpParams = httpParams.set('per_page', params.perPage);
    if (params.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<ApiCollection<MenuRoute>>(this.baseUrl, { params: httpParams });
  }

  get(id: string): Observable<MenuRoute> {
    return this.http.get<ApiResource<MenuRoute>>(`${this.baseUrl}/${id}`).pipe(map((response) => response.data));
  }

  create(payload: MenuRouteFormValue): Observable<MenuRoute> {
    return this.http.post<ApiResource<MenuRoute>>(this.baseUrl, payload).pipe(
      map((response) => response.data),
      tap(() => this.changes.next()),
    );
  }

  update(id: string, payload: MenuRouteFormValue): Observable<MenuRoute> {
    return this.http.put<ApiResource<MenuRoute>>(`${this.baseUrl}/${id}`, payload).pipe(
      map((response) => response.data),
      tap(() => this.changes.next()),
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(tap(() => this.changes.next()));
  }
}
