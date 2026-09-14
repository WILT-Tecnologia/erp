import { Injectable, signal } from '@angular/core';

/**
 * Coordinates exclusive open/close state for one group of sibling
 * accordions. Provided fresh (not `providedIn: 'root'`) at whichever
 * component owns a given list of siblings, so each level of a recursive
 * accordion tree gets its own independent exclusive group.
 */
@Injectable()
export class AccordionGroupService {
  private readonly openKey = signal<string | null>(null);

  isOpen(key: string): boolean {
    return this.openKey() === key;
  }

  /** Opens `key`, closing whichever sibling was open. */
  open(key: string): void {
    this.openKey.set(key);
  }

  /** Opens `key` if closed; closes it (leaving the group fully closed) if already open. */
  toggle(key: string): void {
    this.openKey.update((current) => (current === key ? null : key));
  }
}
