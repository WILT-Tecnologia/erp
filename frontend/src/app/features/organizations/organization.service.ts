import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, type Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { type ApiCollection, type ApiResource } from '../../core/http/api-response.model';
import { type Domain, type DomainFormValue } from './domain.model';
import { type Organization, type OrganizationFormValue } from './organization.model';
import { type Subscription } from './subscription.model';

export interface OrganizationListParams {
  page?: number;
  perPage?: number;
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}${API_ENDPOINTS.organizations.base}`;

  list(params: OrganizationListParams = {}): Observable<ApiCollection<Organization>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.perPage) httpParams = httpParams.set('per_page', params.perPage);
    if (params.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<ApiCollection<Organization>>(this.baseUrl, { params: httpParams });
  }

  checkSlugAvailable(slug: string): Observable<boolean> {
    return this.http
      .get<{ available: boolean }>(`${environment.apiUrl}${API_ENDPOINTS.organizations.checkSlug(slug)}`)
      .pipe(map((response) => response.available));
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

  forceDelete(id: string, password: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}${API_ENDPOINTS.organizations.force(id)}`, {
      body: { password },
    });
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

  listSubscriptions(
    organizationSlug: string,
    params: { page?: number; perPage?: number } = {},
  ): Observable<ApiCollection<Subscription>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.perPage) httpParams = httpParams.set('per_page', params.perPage);

    return this.http.get<ApiCollection<Subscription>>(
      `${environment.apiUrl}${API_ENDPOINTS.organizations.subscriptions(organizationSlug)}`,
      { params: httpParams },
    );
  }

  listDomains(
    organizationSlug: string,
    params: { page?: number; perPage?: number } = {},
  ): Observable<ApiCollection<Domain>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.perPage) httpParams = httpParams.set('per_page', params.perPage);

    return this.http.get<ApiCollection<Domain>>(
      `${environment.apiUrl}${API_ENDPOINTS.organizations.domains(organizationSlug)}`,
      { params: httpParams },
    );
  }

  createDomain(organizationSlug: string, payload: DomainFormValue): Observable<Domain> {
    return this.http
      .post<ApiResource<Domain>>(
        `${environment.apiUrl}${API_ENDPOINTS.organizations.domains(organizationSlug)}`,
        payload,
      )
      .pipe(map((response) => response.data));
  }

  updateDomain(organizationSlug: string, domainId: string, payload: DomainFormValue): Observable<Domain> {
    return this.http
      .put<ApiResource<Domain>>(
        `${environment.apiUrl}${API_ENDPOINTS.organizations.domain(organizationSlug, domainId)}`,
        payload,
      )
      .pipe(map((response) => response.data));
  }

  deleteDomain(organizationSlug: string, domainId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}${API_ENDPOINTS.organizations.domain(organizationSlug, domainId)}`,
    );
  }

  verifyDomain(organizationSlug: string, domainId: string): Observable<Domain> {
    return this.http
      .post<ApiResource<Domain>>(
        `${environment.apiUrl}${API_ENDPOINTS.organizations.verifyDomain(organizationSlug, domainId)}`,
        {},
      )
      .pipe(map((response) => response.data));
  }

  makeDomainPrimary(organizationSlug: string, domainId: string): Observable<Domain> {
    return this.http
      .post<ApiResource<Domain>>(
        `${environment.apiUrl}${API_ENDPOINTS.organizations.makeDomainPrimary(organizationSlug, domainId)}`,
        {},
      )
      .pipe(map((response) => response.data));
  }
}
