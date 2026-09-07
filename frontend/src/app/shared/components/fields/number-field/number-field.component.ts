import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { BaseFieldComponent } from '../base-field.component';

@Component({
  selector: 'app-number-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './number-field.component.html',
  host: { style: 'display: contents' },
})
export class NumberFieldComponent extends BaseFieldComponent<number> {
  readonly min = input<number>();
  readonly max = input<number>();
  readonly step = input(1);
}
