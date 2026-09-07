import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { BaseFieldComponent } from '../base-field.component';

/**
 * Unifies the two inconsistent date patterns previously scattered across
 * forms (native `input type="date"` vs a one-off `mat-datepicker`) into a
 * single component. Value type is `Date` (mat-datepicker's native contract) -
 * each consuming form converts to/from the ISO string its API expects, same
 * as `event-form-dialog` already did before this component existed.
 */
@Component({
  selector: 'app-date-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './date-field.component.html',
  host: { style: 'display: contents' },
})
export class DateFieldComponent extends BaseFieldComponent<Date> {
  readonly min = input<Date>();
  readonly max = input<Date>();
}
