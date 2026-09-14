import { Component, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { BaseFieldComponent } from '../base-field.component';
import { DateFieldComponent } from '../date-field/date-field.component';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

/**
 * Composes two independent `app-date-field` instances bound to local
 * controls - it doesn't route through `innerControl` since the field's
 * value is a `{ start, end }` pair, not a single native-control value.
 */
@Component({
  selector: 'app-date-range-field',
  standalone: true,
  imports: [ReactiveFormsModule, DateFieldComponent],
  templateUrl: './date-range-field.component.html',
  host: { style: 'display: contents' },
})
export class DateRangeFieldComponent extends BaseFieldComponent<DateRange> {
  readonly startLabel = input('Data inicial');
  readonly endLabel = input('Data final');

  readonly startControl = new FormControl<Date | null>(null);
  readonly endControl = new FormControl<Date | null>(null);
  readonly rangeInvalid = signal(false);

  constructor() {
    super();
    this.startControl.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.emitChange());
    this.endControl.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.emitChange());
  }

  override writeValue(value: DateRange | null): void {
    this.startControl.setValue(value?.start ?? null, { emitEvent: false });
    this.endControl.setValue(value?.end ?? null, { emitEvent: false });
  }

  override setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.startControl.disable({ emitEvent: false });
      this.endControl.disable({ emitEvent: false });
    } else {
      this.startControl.enable({ emitEvent: false });
      this.endControl.enable({ emitEvent: false });
    }
  }

  private emitChange(): void {
    const start = this.startControl.value;
    const end = this.endControl.value;
    this.rangeInvalid.set(!!(start && end && end < start));
    this.onChange({ start, end });
    this.onTouched();
  }
}
