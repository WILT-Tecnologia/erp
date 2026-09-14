import { Injectable } from '@angular/core';
import { delay, type Observable, of } from 'rxjs';

import { type TenantUser, type TenantUserFormValue } from './tenant-user.model';

// NOTE: this domain has no real backend endpoint yet. Data is kept in-memory
// and mutated directly so the service can be swapped for real HttpClient
// calls later without touching consumers.
let mockUsers: TenantUser[] = [
  {
    id: 'tu-1',
    name: 'Rev. Marcos Ferreira',
    email: 'marcos@igrejadapaz.org',
    phone: '(11) 99999-0001',
    role: 'Administrador',
    organization: 'Igreja Central Demo',
    status: 'Ativo',
    last_login_at: '2026-08-30T09:00:00',
  },
  {
    id: 'tu-2',
    name: 'Diácono João Alves',
    email: 'joao@igrejadapaz.org',
    phone: '(11) 99999-0002',
    role: 'Gestor',
    organization: 'Igreja Central Demo',
    status: 'Ativo',
    last_login_at: '2026-08-30T08:45:00',
  },
  {
    id: 'tu-3',
    name: 'Evangelista Ana Lima',
    email: 'ana@igrejadapaz.org',
    phone: '(21) 99999-0003',
    role: 'Operador',
    organization: 'Igreja Central Demo',
    status: 'Ativo',
    last_login_at: '2026-08-29T14:30:00',
  },
  {
    id: 'tu-4',
    name: 'Secretária Maria',
    email: 'maria@igrejadapaz.org',
    phone: '(11) 99999-0004',
    role: 'Operador',
    organization: 'Igreja Central Demo',
    status: 'Ativo',
    last_login_at: '2026-08-30T07:15:00',
  },
  {
    id: 'tu-5',
    name: 'Pastor Paulo Santos',
    email: 'paulo@igrejadapaz.org',
    phone: '(31) 99999-0005',
    role: 'Pastor',
    organization: 'Igreja Central Demo',
    status: 'Inativo',
    last_login_at: '2026-08-18T10:00:00',
  },
  {
    id: 'tu-6',
    name: 'Tesoureiro Carlos',
    email: 'carlos@igrejadapaz.org',
    phone: '(11) 99999-0006',
    role: 'Financeiro',
    organization: 'Igreja Central Demo',
    status: 'Ativo',
    last_login_at: '2026-08-28T16:00:00',
  },
];

@Injectable({ providedIn: 'root' })
export class TenantUserService {
  list(): Observable<TenantUser[]> {
    return of([...mockUsers]).pipe(delay(300));
  }

  create(payload: TenantUserFormValue): Observable<TenantUser> {
    const user: TenantUser = {
      id: `tu-${Date.now()}`,
      last_login_at: null,
      phone: payload.phone ?? '',
      ...payload,
    };
    mockUsers = [user, ...mockUsers];
    return of(user).pipe(delay(300));
  }

  update(id: string, payload: TenantUserFormValue): Observable<TenantUser> {
    let updated: TenantUser | undefined;
    mockUsers = mockUsers.map((user) => {
      if (user.id !== id) return user;
      updated = { ...user, ...payload, phone: payload.phone ?? '' };
      return updated;
    });
    return of(updated as TenantUser).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    mockUsers = mockUsers.filter((user) => user.id !== id);
    return of(undefined).pipe(delay(300));
  }
}
