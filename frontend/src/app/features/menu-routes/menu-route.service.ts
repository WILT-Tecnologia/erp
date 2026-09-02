import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { MenuRoute, MenuRouteFormValue } from './menu-route.model';

interface ApiCollection<T> {
  data: T[];
}

interface ApiResource<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class MenuRouteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}${API_ENDPOINTS.menuRoutes.base}`;

  tree(): Observable<MenuRoute[]> {
    return this.http
      .get<ApiCollection<MenuRoute>>(`${environment.apiUrl}${API_ENDPOINTS.menuRoutes.tree}`)
      .pipe(map((response) => response.data));
  }

  list(): Observable<MenuRoute[]> {
    return this.http.get<ApiCollection<MenuRoute>>(this.baseUrl).pipe(map((response) => response.data));
  }

  get(id: string): Observable<MenuRoute> {
    return this.http.get<ApiResource<MenuRoute>>(`${this.baseUrl}/${id}`).pipe(map((response) => response.data));
  }

  create(payload: MenuRouteFormValue): Observable<MenuRoute> {
    return this.http.post<ApiResource<MenuRoute>>(this.baseUrl, payload).pipe(map((response) => response.data));
  }

  update(id: string, payload: MenuRouteFormValue): Observable<MenuRoute> {
    return this.http
      .put<ApiResource<MenuRoute>>(`${this.baseUrl}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
