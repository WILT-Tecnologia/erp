import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

import { BaseFieldComponent } from '../base-field.component';

export interface RadioFieldOption<T> {
  value: T;
  label: string;
}

@Component({
  selector: 'app-radio-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatRadioModule],
  templateUrl: './radio-field.component.html',
  host: { style: 'display: contents' },
})
export class RadioFieldComponent<T> extends BaseFieldComponent<T> {
  readonly options = input.required<RadioFieldOption<T>[]>();
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
}
