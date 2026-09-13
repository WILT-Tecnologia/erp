import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card class="p-4">
      <h2 class="mb-4 font-medium">{{ title() }}</h2>
      <ng-content></ng-content>
    </mat-card>
  `,
})
export class ChartCardComponent {
  readonly title = input.required<string>();
  readonly appearance = input<'outlined' | 'filled'>('outlined');
}
