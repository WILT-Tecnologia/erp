import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { DashboardStats } from './dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  stats(period?: string): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${environment.apiUrl}${API_ENDPOINTS.dashboard.stats}`, {
      params: period ? { period } : {},
    });
  }
}
