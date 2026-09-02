import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { ApiCollection, ApiResource } from '../../core/http/api-response.model';
import { Plan, PlanFormValue } from './plan.model';

@Injectable({ providedIn: 'root' })
export class PlanService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}${API_ENDPOINTS.plans}`;

  list(): Observable<Plan[]> {
    return this.http.get<ApiCollection<Plan>>(this.baseUrl).pipe(map((response) => response.data));
  }

  create(payload: PlanFormValue): Observable<Plan> {
    return this.http.post<ApiResource<Plan>>(this.baseUrl, payload).pipe(map((response) => response.data));
  }

  update(id: string, payload: PlanFormValue): Observable<Plan> {
    return this.http
      .put<ApiResource<Plan>>(`${this.baseUrl}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
