import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { BaseFieldComponent } from '../base-field.component';

export interface SelectFieldOption<T> {
  value: T;
  label: string;
}

@Component({
  selector: 'app-select-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './select-field.component.html',
  host: { style: 'display: contents' },
})
export class SelectFieldComponent<T> extends BaseFieldComponent<T> {
  readonly options = input.required<SelectFieldOption<T>[]>();
  readonly multiple = input(false);
  readonly compareWith = input<(a: T, b: T) => boolean>((a, b) => a === b);
}
