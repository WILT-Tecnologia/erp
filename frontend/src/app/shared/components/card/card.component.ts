import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card class="p-4" [appearance]="appearance()">
      <ng-content></ng-content>
    </mat-card>
  `,
})
export class CardComponent {
  readonly appearance = input<'outlined' | 'filled'>('outlined');
}
