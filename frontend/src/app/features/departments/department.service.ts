import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { Department, DepartmentFormValue } from './department.model';

// NOTE: this domain has no real backend endpoint yet. Data is kept in-memory
// and mutated directly so the service can be swapped for real HttpClient
// calls later without touching consumers.
let mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Louvor e Adoração',
    church: 'Igreja Central',
    leader: 'Ana Beatriz',
    members: 32,
    description: 'Ministério responsável pela música e louvor nos cultos',
    status: 'active',
  },
  {
    id: '2',
    name: 'Evangelismo',
    church: 'Igreja Central',
    leader: 'Carlos Eduardo',
    members: 45,
    description: 'Coordena as atividades evangelísticas e de alcance',
    status: 'active',
  },
  {
    id: '3',
    name: 'Escola Dominical',
    church: 'Igreja Filial Norte',
    leader: 'Mariana Lima',
    members: 28,
    description: 'Ensino bíblico semanal para todas as faixas etárias',
    status: 'active',
  },
  {
    id: '4',
    name: 'Departamento Feminino',
    church: 'Igreja Central',
    leader: 'Patricia Souza',
    members: 67,
    description: 'Ministério voltado para as mulheres da congregação',
    status: 'active',
  },
  {
    id: '5',
    name: 'Departamento de Jovens',
    church: 'Igreja Filial Sul',
    leader: 'Thiago Mendes',
    members: 89,
    description: 'Ministério jovem com atividades e células semanais',
    status: 'active',
  },
  {
    id: '6',
    name: 'Diaconia',
    church: 'Igreja Central',
    leader: 'Roberto Alves',
    members: 18,
    description: 'Assistência social e cuidado com os necessitados',
    status: 'active',
  },
  {
    id: '7',
    name: 'Infantil',
    church: 'Igreja Filial Leste',
    leader: 'Fernanda Costa',
    members: 22,
    description: 'Ministério das crianças e berçário',
    status: 'active',
  },
  {
    id: '8',
    name: 'Comunicação',
    church: 'Igreja Central',
    leader: 'Lucas Rodrigues',
    members: 12,
    description: 'Redes sociais, site e comunicação visual',
    status: 'inactive',
  },
];

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  list(): Observable<Department[]> {
    return of([...mockDepartments]).pipe(delay(300));
  }

  create(payload: DepartmentFormValue): Observable<Department> {
    const department: Department = {
      id: crypto.randomUUID(),
      description: '',
      ...payload,
    };
    mockDepartments = [department, ...mockDepartments];
    return of(department).pipe(delay(300));
  }

  update(id: string, payload: DepartmentFormValue): Observable<Department> {
    let updated: Department | undefined;
    mockDepartments = mockDepartments.map((department) => {
      if (department.id !== id) return department;
      updated = { ...department, ...payload };
      return updated;
    });
    return of(updated as Department).pipe(delay(300));
  }

  delete(id: string): Observable<void> {
    mockDepartments = mockDepartments.filter((department) => department.id !== id);
    return of(undefined).pipe(delay(300));
  }
}
