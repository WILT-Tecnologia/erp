import { Injectable } from '@angular/core';
import { delay, type Observable, of } from 'rxjs';

import { type Member, type MemberFormValue } from './member.model';

const INITIAL_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Ana Paula Ferreira',
    email: 'ana.ferreira@email.com',
    phone: '(11) 98888-0001',
    church: 'Igreja Central Demo',
    department: 'Louvor',
    status: 'active',
    joined_at: '2024-02-10',
  },
  {
    id: '2',
    name: 'Beatriz Nascimento',
    email: 'beatriz.nascimento@email.com',
    phone: '(11) 98888-0002',
    church: 'Igreja Central Demo',
    department: 'Infantil',
    status: 'active',
    joined_at: '2023-11-05',
  },
  {
    id: '3',
    name: 'Carlos Eduardo Souza',
    email: 'carlos.souza@email.com',
    phone: '(11) 98888-0003',
    church: 'Igreja Central Demo',
    department: 'Diaconia',
    status: 'active',
    joined_at: '2022-06-20',
  },
  {
    id: '4',
    name: 'Daniela Rocha',
    email: 'daniela.rocha@email.com',
    phone: '(11) 98888-0004',
    church: 'Igreja Central Demo',
    department: 'Jovens',
    status: 'visitor',
    joined_at: '2026-06-30',
  },
  {
    id: '5',
    name: 'Eduardo Lima',
    email: 'eduardo.lima@email.com',
    phone: '(11) 98888-0005',
    church: 'Igreja Central Demo',
    department: 'Ensino',
    status: 'active',
    joined_at: '2021-03-14',
  },
  {
    id: '6',
    name: 'Fernanda Costa',
    email: 'fernanda.costa@email.com',
    phone: '(11) 98888-0006',
    church: 'Igreja Central Demo',
    department: 'Louvor',
    status: 'inactive',
    joined_at: '2020-09-01',
  },
  {
    id: '7',
    name: 'Gabriel Martins',
    email: 'gabriel.martins@email.com',
    phone: '(11) 98888-0007',
    church: 'Igreja Central Demo',
    department: 'Jovens',
    status: 'active',
    joined_at: '2024-08-18',
  },
  {
    id: '8',
    name: 'Helena Ribeiro',
    email: 'helena.ribeiro@email.com',
    phone: '(11) 98888-0008',
    church: 'Igreja Central Demo',
    department: 'Intercessão',
    status: 'active',
    joined_at: '2023-01-22',
  },
];

/**
 * Mock service for members. No real backend endpoint exists yet for this
 * domain, so CRUD operations mutate an in-memory array. Every method still
 * returns an Observable so this is a drop-in replacement once the API
 * exists — just swap the bodies for `this.http.get(...)` etc.
 */
@Injectable({ providedIn: 'root' })
export class MemberService {
  private members: Member[] = [...INITIAL_MEMBERS];

  list(): Observable<Member[]> {
    return of([...this.members]).pipe(delay(300));
  }

  create(payload: MemberFormValue): Observable<Member> {
    const member: Member = { id: crypto.randomUUID(), ...payload };
    this.members = [member, ...this.members];
    return of(member).pipe(delay(300));
  }

  update(id: string, payload: MemberFormValue): Observable<Member> {
    this.members = this.members.map((m) => (m.id === id ? { ...m, ...payload } : m));
    const updated = this.members.find((m) => m.id === id)!;
    return of(updated).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    this.members = this.members.filter((m) => m.id !== id);
    return of(undefined).pipe(delay(300));
  }
}
