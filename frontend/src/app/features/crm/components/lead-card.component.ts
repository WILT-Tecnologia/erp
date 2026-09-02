import { Component, input, output } from '@angular/core';

import { Contact } from '../contact.model';

@Component({
  selector: 'app-lead-card',
  standalone: true,
  templateUrl: './lead-card.component.html',
})
export class LeadCardComponent {
  readonly contact = input.required<Contact>();
  readonly cardClick = output<Contact>();

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleDateString('pt-BR');
  }

  onClick(): void {
    this.cardClick.emit(this.contact());
  }
}
