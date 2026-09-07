import { ChangeDetectorRef, DestroyRef, Directive, inject, input, type OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { type ControlValueAccessor, FormControl, NgControl, type ValidationErrors } from '@angular/forms';

import { type FieldErrorMap, resolveFieldError } from './field-error/field-error.util';

/**
 * Base class for CORE field components. Handles the ControlValueAccessor wiring
 * (self-injecting NgControl and assigning `valueAccessor` avoids the
 * `NG_VALUE_ACCESSOR` + `forwardRef` boilerplate in every subclass) and the
 * label/hint/error-message inputs shared by every field.
 *
 * `innerControl` is a throwaway FormControl bound to the native control inside
 * this field's own template (via `[formControl]`). It exists only so
 * MatFormField/MatInput/MatSelect see a real NgControl and compute their own
 * `errorState` (red outline) correctly - without it, the internal `<input>`/
 * `<mat-select>` has no NgControl at all and Material never reacts to
 * validity. Its errors/touched are mirrored from the *external* control
 * (`ngControl.control`, the one the consumer's FormGroup actually owns) on
 * every `control.events` emission, since `form.markAllAsTouched()` mutates
 * that control directly, bypassing `registerOnTouched`.
 *
 * `@Directive()` is required here even though this class is never used
 * directly: Angular's compiler only recognizes signal `input()` fields on
 * classes it knows are directives/components.
 */
@Directive()
export abstract class BaseFieldComponent<T = string> implements ControlValueAccessor, OnInit {
  protected readonly ngControl = inject(NgControl, { optional: true, self: true });
  private readonly destroyRef = inject(DestroyRef);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  protected readonly innerControl = new FormControl<T | null>(null);
  private readonly touched = signal(false);
  private readonly controlErrors = signal<ValidationErrors | null>(null);

  readonly label = input('');
  readonly hint = input('');
  readonly placeholder = input('');
  readonly appearance = input<'outline' | 'fill'>('outline');
  readonly errorMessages = input<Partial<FieldErrorMap>>({});

  protected onChange: (value: T | null) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this.innerControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => this.onChange(value));
  }

  ngOnInit(): void {
    const control = this.ngControl?.control;
    if (!control) {
      return;
    }

    this.syncFromExternalControl(control.touched, control.errors);

    control.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.syncFromExternalControl(control.touched, control.errors);
      this.changeDetectorRef.detectChanges();
    });
  }

  private syncFromExternalControl(touched: boolean, errors: ValidationErrors | null): void {
    this.touched.set(touched);
    this.controlErrors.set(errors);
    this.innerControl.setErrors(errors, { emitEvent: false });
    if (touched) {
      this.innerControl.markAsTouched({ onlySelf: true });
    } else {
      this.innerControl.markAsUntouched({ onlySelf: true });
    }
  }

  get errorMessage(): string | null {
    return resolveFieldError(this.controlErrors(), this.errorMessages());
  }

  get shouldShowError(): boolean {
    return this.touched() && !!this.errorMessage;
  }

  writeValue(value: T | null): void {
    this.innerControl.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.innerControl.disable({ emitEvent: false });
    } else {
      this.innerControl.enable({ emitEvent: false });
    }
  }
}
