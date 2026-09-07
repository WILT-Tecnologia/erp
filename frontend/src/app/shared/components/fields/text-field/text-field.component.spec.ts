import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { describe, expect, it } from 'vitest';

import { TextFieldComponent } from './text-field.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TextFieldComponent],
  template: `<app-text-field [formControl]="control" label="Nome" />`,
})
class HostComponent {
  control = new FormControl('', { nonNullable: true, validators: Validators.required });
}

describe('TextFieldComponent', () => {
  function createHost() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
    const field = fixture.debugElement.query(By.directive(TextFieldComponent)).componentInstance as TextFieldComponent;
    return { fixture, input, field };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
  });

  it('renders the value written to the external FormControl', () => {
    const { fixture, input } = createHost();
    fixture.componentInstance.control.setValue('Ana');
    fixture.detectChanges();
    expect(input.value).toBe('Ana');
  });

  it('propagates typed input back to the external FormControl', () => {
    const { fixture, input } = createHost();
    input.value = 'João';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.control.value).toBe('João');
  });

  it('disables the native input when the control is disabled', () => {
    const { fixture, input } = createHost();
    fixture.componentInstance.control.disable();
    fixture.detectChanges();
    expect(input.disabled).toBe(true);
  });

  it('shows the required error message once touched', () => {
    const { fixture, field } = createHost();
    fixture.componentInstance.control.markAllAsTouched();
    fixture.detectChanges();
    expect(field.shouldShowError).toBe(true);
    expect(field.errorMessage).toBe('Este campo é obrigatório.');
    const error = fixture.debugElement.query(By.css('mat-error'));
    expect(error.nativeElement.textContent).toContain('Este campo é obrigatório.');
  });
});

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TextFieldComponent],
  template: `<app-text-field [formControl]="control" label="Nome" [errorMessages]="errorMessages" />`,
})
class HostWithOverrideComponent {
  control = new FormControl('', { nonNullable: true, validators: Validators.required });
  errorMessages = { required: () => 'Preencha este campo.' };
}

describe('TextFieldComponent error override', () => {
  it('lets errorMessages replace the default message', () => {
    TestBed.configureTestingModule({ imports: [HostWithOverrideComponent] });
    const fixture = TestBed.createComponent(HostWithOverrideComponent);
    fixture.detectChanges();
    const field = fixture.debugElement.query(By.directive(TextFieldComponent)).componentInstance as TextFieldComponent;
    fixture.componentInstance.control.markAllAsTouched();
    fixture.detectChanges();
    expect(field.errorMessage).toBe('Preencha este campo.');
  });
});
