import { Component, input, signal } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';

import { BaseFieldComponent } from '../base-field.component';

/**
 * `matSliderStartThumb`/`matSliderEndThumb` don't implement
 * ControlValueAccessor (plain `[value]`/`(valueChange)` I/O), so this field
 * bypasses `innerControl` and manages the two thumb values as local signals.
 */
@Component({
  selector: 'app-range-field',
  standalone: true,
  imports: [MatSliderModule],
  templateUrl: './range-field.component.html',
  host: { style: 'display: contents' },
})
export class RangeFieldComponent extends BaseFieldComponent<[number, number]> {
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly discrete = input(true);

  readonly startValue = signal(0);
  readonly endValue = signal(100);

  override writeValue(value: [number, number] | null): void {
    const [start, end] = value ?? [this.min(), this.max()];
    this.startValue.set(start);
    this.endValue.set(end);
  }

  handleStartChange(value: number): void {
    this.startValue.set(value);
    this.onChange([this.startValue(), this.endValue()]);
    this.onTouched();
  }

  handleEndChange(value: number): void {
    this.endValue.set(value);
    this.onChange([this.startValue(), this.endValue()]);
    this.onTouched();
  }
}
