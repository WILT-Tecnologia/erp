import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, type Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { type ApiCollection, type ApiResource } from '../../core/http/api-response.model';
import { type Plan, type PlanFormValue } from './plan.model';

export interface PlanListParams {
  page?: number;
  perPage?: number;
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class PlanService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}${API_ENDPOINTS.plans}`;

  list(params: PlanListParams = {}): Observable<ApiCollection<Plan>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.perPage) httpParams = httpParams.set('per_page', params.perPage);
    if (params.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<ApiCollection<Plan>>(this.baseUrl, { params: httpParams });
  }

  create(payload: PlanFormValue): Observable<Plan> {
    return this.http.post<ApiResource<Plan>>(this.baseUrl, payload).pipe(map((response) => response.data));
  }

  update(id: string, payload: PlanFormValue): Observable<Plan> {
    return this.http.put<ApiResource<Plan>>(`${this.baseUrl}/${id}`, payload).pipe(map((response) => response.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
