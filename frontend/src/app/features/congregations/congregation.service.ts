import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { Congregation, CongregationFormValue } from './congregation.model';

const INITIAL_CONGREGATIONS: Congregation[] = [
  {
    id: '1',
    name: 'Congregação Centro',
    code: 'CG-001',
    church: 'Igreja Central Demo',
    leader: 'Diácono Pedro Alves',
    city: 'São Paulo',
    state: 'SP',
    members: 145,
    phone: '(11) 3333-1111',
    status: 'active',
  },
  {
    id: '2',
    name: 'Congregação Zona Norte',
    code: 'CG-002',
    church: 'Igreja Central Demo',
    leader: 'Diácono Carlos Souza',
    city: 'São Paulo',
    state: 'SP',
    members: 98,
    phone: '(11) 3333-2222',
    status: 'active',
  },
  {
    id: '3',
    name: 'Congregação Zona Sul',
    code: 'CG-003',
    church: 'Igreja Central Demo',
    leader: 'Evangelista Sandra Lima',
    city: 'São Paulo',
    state: 'SP',
    members: 72,
    phone: '(11) 3333-3333',
    status: 'active',
  },
  {
    id: '4',
    name: 'Congregação Zona Leste',
    code: 'CG-004',
    church: 'Igreja Central Demo',
    leader: 'Diácono José Ribeiro',
    city: 'São Paulo',
    state: 'SP',
    members: 34,
    phone: '(11) 3333-4444',
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Congregação Campinas Centro',
    code: 'CG-005',
    church: 'Igreja Central Demo',
    leader: 'Evangelista Ricardo Martins',
    city: 'Campinas',
    state: 'SP',
    members: 165,
    phone: '(19) 3456-5555',
    status: 'active',
  },
];

/**
 * Mock service for congregations. No real backend endpoint exists yet for
 * this domain, so CRUD operations mutate an in-memory array. Every method
 * still returns an Observable so this is a drop-in replacement once the API
 * exists — just swap the bodies for `this.http.get(...)` etc.
 */
@Injectable({ providedIn: 'root' })
export class CongregationService {
  private congregations: Congregation[] = [...INITIAL_CONGREGATIONS];

  list(): Observable<Congregation[]> {
    return of([...this.congregations]).pipe(delay(300));
  }

  create(payload: CongregationFormValue): Observable<Congregation> {
    const congregation: Congregation = { id: crypto.randomUUID(), ...payload };
    this.congregations = [congregation, ...this.congregations];
    return of(congregation).pipe(delay(300));
  }

  update(id: string, payload: CongregationFormValue): Observable<Congregation> {
    this.congregations = this.congregations.map((c) => (c.id === id ? { ...c, ...payload } : c));
    const updated = this.congregations.find((c) => c.id === id)!;
    return of(updated).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    this.congregations = this.congregations.filter((c) => c.id !== id);
    return of(undefined).pipe(delay(300));
  }
}
