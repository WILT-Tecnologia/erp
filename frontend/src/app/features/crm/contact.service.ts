import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, type Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import {
  type Contact,
  type ContactActivity,
  type ContactActivityFormValue,
  type ContactFormValue,
  type ContactStage,
  type ContactTask,
  type ContactTaskFormValue,
  type PaginatedResponse,
} from './contact.model';

export interface ContactListParams {
  status?: ContactStage;
  search?: string;
  per_page?: number;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}${API_ENDPOINTS.contacts.base}`;

  list(organizationId: string, params: ContactListParams = {}): Observable<PaginatedResponse<Contact>> {
    let httpParams = new HttpParams().set('organization_id', organizationId).set('per_page', params.per_page ?? 100);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<PaginatedResponse<Contact>>(this.baseUrl, { params: httpParams });
  }

  get(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.baseUrl}/${id}`);
  }

  create(payload: ContactFormValue): Observable<Contact> {
    return this.http.post<Contact>(this.baseUrl, payload);
  }

  update(id: string, payload: Partial<ContactFormValue>): Observable<Contact> {
    return this.http.put<Contact>(`${this.baseUrl}/${id}`, payload);
  }

  updateStatus(id: string, status: ContactStage): Observable<Contact> {
    return this.update(id, { status });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * O backend não expõe uma listagem dedicada de atividades: elas vêm
   * aninhadas no recurso do contato (GET /admin/contacts/{id}). Reutilizamos
   * esse endpoint e extraímos a lista.
   */
  listActivities(contactId: string): Observable<ContactActivity[]> {
    return this.get(contactId).pipe(map((contact) => contact.activities));
  }

  createActivity(contactId: string, payload: ContactActivityFormValue): Observable<ContactActivity> {
    return this.http.post<ContactActivity>(
      `${environment.apiUrl}${API_ENDPOINTS.contacts.activities(contactId)}`,
      payload,
    );
  }

  /**
   * O backend não expõe uma listagem dedicada de tarefas: elas vêm
   * aninhadas no recurso do contato (GET /admin/contacts/{id}).
   */
  listTasks(contactId: string): Observable<ContactTask[]> {
    return this.get(contactId).pipe(map((contact) => contact.tasks));
  }

  createTask(contactId: string, payload: ContactTaskFormValue): Observable<ContactTask> {
    return this.http.post<ContactTask>(`${environment.apiUrl}${API_ENDPOINTS.contacts.tasks(contactId)}`, payload);
  }

  updateTask(contactId: string, taskId: string, payload: Partial<ContactTaskFormValue>): Observable<ContactTask> {
    return this.http.patch<ContactTask>(
      `${environment.apiUrl}${API_ENDPOINTS.contacts.tasks(contactId)}/${taskId}`,
      payload,
    );
  }
}
