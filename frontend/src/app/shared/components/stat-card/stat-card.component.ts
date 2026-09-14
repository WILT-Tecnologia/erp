import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card class="p-4" [appearance]="appearance()">
      <div class="text-sm text-on-surface/60">{{ label() }}</div>
      <div class="text-2xl font-semibold">{{ value() }}</div>
      @if (subtitle()) {
        <div class="text-xs text-on-surface/50">{{ subtitle() }}</div>
      }
    </mat-card>
  `,
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number | null>();
  readonly appearance = input<'outlined' | 'filled'>('outlined');
  readonly subtitle = input<string>();
}
