import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { Family, FamilyFormValue } from './family.model';

const INITIAL_FAMILIES: Family[] = [
  {
    id: '1',
    name: 'Família Ferreira',
    leader: 'Ana Paula Ferreira',
    members: 4,
    church: 'Igreja Central Demo',
    address: 'Rua das Flores, 123 - Centro',
    status: 'active',
  },
  {
    id: '2',
    name: 'Família Lima',
    leader: 'Eduardo Lima',
    members: 3,
    church: 'Igreja Central Demo',
    address: 'Av. Paulista, 456 - Bela Vista',
    status: 'active',
  },
  {
    id: '3',
    name: 'Família Souza',
    leader: 'Carlos Eduardo Souza',
    members: 5,
    church: 'Igreja Central Demo',
    address: 'Rua do Norte, 789 - Zona Norte',
    status: 'active',
  },
  {
    id: '4',
    name: 'Família Costa',
    leader: 'Fernanda Costa',
    members: 2,
    church: 'Igreja Central Demo',
    address: 'Rua das Acácias, 321 - Centro',
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Família Ribeiro',
    leader: 'Helena Ribeiro',
    members: 6,
    church: 'Igreja Central Demo',
    address: 'Rua das Palmeiras, 987 - Centro',
    status: 'active',
  },
];

/**
 * Mock service for families. No real backend endpoint exists yet for this
 * domain, so CRUD operations mutate an in-memory array. Every method still
 * returns an Observable so this is a drop-in replacement once the API
 * exists — just swap the bodies for `this.http.get(...)` etc.
 */
@Injectable({ providedIn: 'root' })
export class FamilyService {
  private families: Family[] = [...INITIAL_FAMILIES];

  list(): Observable<Family[]> {
    return of([...this.families]).pipe(delay(300));
  }

  create(payload: FamilyFormValue): Observable<Family> {
    const family: Family = { id: crypto.randomUUID(), ...payload };
    this.families = [family, ...this.families];
    return of(family).pipe(delay(300));
  }

  update(id: string, payload: FamilyFormValue): Observable<Family> {
    this.families = this.families.map((f) => (f.id === id ? { ...f, ...payload } : f));
    const updated = this.families.find((f) => f.id === id)!;
    return of(updated).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    this.families = this.families.filter((f) => f.id !== id);
    return of(undefined).pipe(delay(300));
  }
}
