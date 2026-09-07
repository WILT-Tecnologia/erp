import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';

import { BaseFieldComponent } from '../base-field.component';

@Component({
  selector: 'app-timepicker-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatTimepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './timepicker-field.component.html',
  host: { style: 'display: contents' },
})
export class TimepickerFieldComponent extends BaseFieldComponent<Date> {
  readonly interval = input<string>('30min');
}
