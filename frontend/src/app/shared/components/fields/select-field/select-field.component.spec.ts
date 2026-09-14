import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { describe, expect, it } from 'vitest';

import { SelectFieldComponent, type SelectFieldOption } from './select-field.component';

const STATUS_OPTIONS: SelectFieldOption<string>[] = [
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
];

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, SelectFieldComponent],
  template: `<app-select-field [formControl]="control" label="Status" [options]="options" />`,
})
class HostComponent {
  control = new FormControl<string>('', { nonNullable: true, validators: Validators.required });
  options = STATUS_OPTIONS;
}

describe('SelectFieldComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent], providers: [provideNoopAnimations()] });
  });

  it('renders one mat-option per provided option', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.directive(MatSelect)).componentInstance as MatSelect;
    select.open();
    fixture.detectChanges();
    const options = select.options.toArray();
    expect(options.length).toBe(2);
    expect(options[0].viewValue).toContain('Ativo');
  });

  it('reflects the external FormControl value in the select', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.setValue('inactive');
    fixture.detectChanges();
    const select = fixture.debugElement.query(By.css('mat-select'));
    expect(select.componentInstance.value).toBe('inactive');
  });

  it('shows the required error message once touched', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const field = fixture.debugElement.query(By.directive(SelectFieldComponent)).componentInstance as SelectFieldComponent<string>;
    fixture.componentInstance.control.markAllAsTouched();
    fixture.detectChanges();
    expect(field.shouldShowError).toBe(true);
    expect(field.errorMessage).toBe('Este campo é obrigatório.');
    const error = fixture.debugElement.query(By.css('mat-error'));
    expect(error.nativeElement.textContent).toContain('Este campo é obrigatório.');
  });
});
