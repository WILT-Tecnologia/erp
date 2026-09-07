import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { BaseFieldComponent } from '../base-field.component';

@Component({
  selector: 'app-switch-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatSlideToggleModule],
  template: `
    <mat-slide-toggle [formControl]="innerControl" (blur)="onTouched()">{{ label() }}</mat-slide-toggle>
    @if (shouldShowError) {
      <div class="mat-mdc-form-field-error text-xs text-error mt-1">{{ errorMessage }}</div>
    }
  `,
  host: { style: 'display: contents' },
})
export class SwitchFieldComponent extends BaseFieldComponent<boolean> {}
