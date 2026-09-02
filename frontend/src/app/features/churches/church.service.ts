import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { Church, ChurchFormValue } from './church.model';

const INITIAL_CHURCHES: Church[] = [
  {
    id: '1',
    name: 'Igreja Central',
    code: 'IC-001',
    city: 'São Paulo',
    state: 'SP',
    pastor: 'Rev. Marcos Ferreira',
    phone: '(11) 3456-7890',
    email: 'central@igrejacentral.local',
    members: 1240,
    congregations: 4,
    founded_at: '1985-03-10',
    status: 'active',
  },
  {
    id: '2',
    name: 'Igreja Filial Norte',
    code: 'IF-002',
    city: 'São Paulo',
    state: 'SP',
    pastor: 'Rev. Paulo Lima',
    phone: '(11) 3567-8901',
    email: 'norte@igrejacentral.local',
    members: 380,
    congregations: 2,
    founded_at: '1998-06-22',
    status: 'active',
  },
  {
    id: '3',
    name: 'Igreja Filial Sul',
    code: 'IF-003',
    city: 'São Paulo',
    state: 'SP',
    pastor: 'Rev. Antônio Santos',
    phone: '(11) 3678-9012',
    email: 'sul@igrejacentral.local',
    members: 290,
    congregations: 1,
    founded_at: '2001-11-05',
    status: 'active',
  },
  {
    id: '4',
    name: 'Igreja Filial Leste',
    code: 'IF-004',
    city: 'São Paulo',
    state: 'SP',
    pastor: 'Rev. João Alves',
    phone: '(11) 3789-0123',
    email: 'leste@igrejacentral.local',
    members: 420,
    congregations: 2,
    founded_at: '2003-02-14',
    status: 'active',
  },
  {
    id: '5',
    name: 'Congregação Campinas',
    code: 'CC-005',
    city: 'Campinas',
    state: 'SP',
    pastor: 'Ev. Ricardo Moura',
    phone: '(19) 3456-7890',
    email: 'campinas@igrejacentral.local',
    members: 165,
    congregations: 0,
    founded_at: '2010-09-18',
    status: 'active',
  },
  {
    id: '6',
    name: 'Congregação Santos',
    code: 'CS-006',
    city: 'Santos',
    state: 'SP',
    pastor: 'Ev. Silvia Costa',
    phone: '(13) 3456-7890',
    email: 'santos@igrejacentral.local',
    members: 82,
    congregations: 0,
    founded_at: '2015-04-30',
    status: 'inactive',
  },
];

/**
 * Mock service for churches. No real backend endpoint exists yet for this
 * domain, so CRUD operations mutate an in-memory array. Every method still
 * returns an Observable so this is a drop-in replacement once the API
 * exists — just swap the bodies for `this.http.get(...)` etc.
 */
@Injectable({ providedIn: 'root' })
export class ChurchService {
  private churches: Church[] = [...INITIAL_CHURCHES];

  list(): Observable<Church[]> {
    return of([...this.churches]).pipe(delay(300));
  }

  create(payload: ChurchFormValue): Observable<Church> {
    const church: Church = { id: crypto.randomUUID(), ...payload };
    this.churches = [church, ...this.churches];
    return of(church).pipe(delay(300));
  }

  update(id: string, payload: ChurchFormValue): Observable<Church> {
    this.churches = this.churches.map((c) => (c.id === id ? { ...c, ...payload } : c));
    const updated = this.churches.find((c) => c.id === id)!;
    return of(updated).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    this.churches = this.churches.filter((c) => c.id !== id);
    return of(undefined).pipe(delay(300));
  }
}
