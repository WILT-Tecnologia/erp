import { Component, computed, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, type MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { BaseFieldComponent } from '../base-field.component';

export interface AutocompleteFieldOption<T> {
  value: T;
  label: string;
}

/**
 * The native input is bound to a local text-search FormControl, not
 * `innerControl` - the field's real value (T) and the text typed to filter
 * options are different types, so they can't share one control the way the
 * other fields do.
 */
@Component({
  selector: 'app-autocomplete-field',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule],
  templateUrl: './autocomplete-field.component.html',
  host: { style: 'display: contents' },
})
export class AutocompleteFieldComponent<T> extends BaseFieldComponent<T> {
  readonly options = input.required<AutocompleteFieldOption<T>[]>();

  protected readonly searchControl = new FormControl('', { nonNullable: true });
  private readonly searchText = toSignal(this.searchControl.valueChanges, { initialValue: '' });

  readonly filteredOptions = computed(() => {
    const query = this.searchText().trim().toLowerCase();
    const options = this.options();
    return query ? options.filter((option) => option.label.toLowerCase().includes(query)) : options;
  });

  private findLabel(value: T | null): string {
    return this.options().find((option) => option.value === value)?.label ?? '';
  }

  override writeValue(value: T | null): void {
    this.searchControl.setValue(this.findLabel(value), { emitEvent: false });
  }

  override setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.searchControl.disable({ emitEvent: false });
    } else {
      this.searchControl.enable({ emitEvent: false });
    }
  }

  handleOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value as T;
    this.onChange(value);
    this.searchControl.setValue(this.findLabel(value), { emitEvent: false });
  }
}
