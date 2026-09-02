import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface GridState {
  sortActive?: string;
  sortDirection?: 'asc' | 'desc' | '';
  pageSize?: number;
  visibleColumns?: string[];
}

@Injectable({ providedIn: 'root' })
export class GridStateService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  load(persistKey: string): GridState | null {
    if (!this.isBrowser) return null;
    const raw = localStorage.getItem(this.key(persistKey));
    return raw ? (JSON.parse(raw) as GridState) : null;
  }

  save(persistKey: string, state: GridState): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.key(persistKey), JSON.stringify(state));
  }

  private key(persistKey: string): string {
    return `datagrid:${persistKey}`;
  }
}
