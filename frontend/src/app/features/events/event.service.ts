import { Injectable } from '@angular/core';
import { delay, type Observable, of } from 'rxjs';

import { type Event, type EventFormValue } from './event.model';

// NOTE: this domain has no real backend endpoint yet. Data is kept in-memory
// and mutated directly so the service can be swapped for real HttpClient
// calls later without touching consumers.
let mockEvents: Event[] = [
  {
    id: '1',
    title: 'Culto de Celebração',
    church: 'Igreja Central',
    category: 'Culto',
    date: '2026-09-06',
    location: 'Templo Central',
    participants: 0,
    capacity: 500,
    status: 'scheduled',
  },
  {
    id: '2',
    title: 'Conferência de Jovens 2026',
    church: 'Igreja Central',
    category: 'Conferência',
    date: '2026-09-13',
    location: 'Centro de Convenções',
    participants: 234,
    capacity: 600,
    status: 'scheduled',
  },
  {
    id: '3',
    title: 'Retiro Espiritual Casais',
    church: 'Igreja Filial Norte',
    category: 'Retiro',
    date: '2026-09-26',
    location: 'Sítio São Paulo Interior',
    participants: 48,
    capacity: 60,
    status: 'scheduled',
  },
  {
    id: '4',
    title: 'Escola Bíblica de Férias',
    church: 'Igreja Central',
    category: 'Educação',
    date: '2026-09-07',
    location: 'Salão Auxiliar',
    participants: 87,
    capacity: 120,
    status: 'ongoing',
  },
  {
    id: '5',
    title: 'Coral de Natal Ensaio Final',
    church: 'Igreja Filial Sul',
    category: 'Música',
    date: '2026-09-21',
    location: 'Sala de Ensaios',
    participants: 0,
    capacity: 40,
    status: 'scheduled',
  },
  {
    id: '6',
    title: 'Batismo nas Águas',
    church: 'Igreja Central',
    category: 'Batismo',
    date: '2026-09-30',
    location: 'Rio Cristal',
    participants: 22,
    capacity: 30,
    status: 'scheduled',
  },
  {
    id: '7',
    title: 'Seminário de Liderança',
    church: 'Igreja Central',
    category: 'Seminário',
    date: '2026-08-30',
    location: 'Auditório',
    participants: 95,
    capacity: 100,
    status: 'completed',
  },
  {
    id: '8',
    title: 'Culto de Missões',
    church: 'Igreja Central',
    category: 'Culto',
    date: '2026-07-14',
    location: 'Templo Central',
    participants: 0,
    capacity: 500,
    status: 'cancelled',
  },
];

@Injectable({ providedIn: 'root' })
export class EventService {
  list(): Observable<Event[]> {
    return of([...mockEvents]).pipe(delay(300));
  }

  create(payload: EventFormValue): Observable<Event> {
    const event: Event = {
      id: crypto.randomUUID(),
      ...payload,
    };
    mockEvents = [event, ...mockEvents];
    return of(event).pipe(delay(300));
  }

  update(id: string, payload: EventFormValue): Observable<Event> {
    let updated: Event | undefined;
    mockEvents = mockEvents.map((event) => {
      if (event.id !== id) return event;
      updated = { ...event, ...payload };
      return updated;
    });
    return of(updated as Event).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    mockEvents = mockEvents.filter((event) => event.id !== id);
    return of(undefined).pipe(delay(300));
  }
}
