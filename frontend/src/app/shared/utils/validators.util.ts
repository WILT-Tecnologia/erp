import { type AbstractControl, type ValidationErrors } from '@angular/forms';

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const CELLPHONE_DIGIT_COUNT = 11;
const CELLPHONE_NINTH_DIGIT_INDEX = 2;

export function cellphoneValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string | null;
  if (!value) {
    return null;
  }
  const digits = value.replace(/\D/g, '');
  if (digits.length !== CELLPHONE_DIGIT_COUNT || digits[CELLPHONE_NINTH_DIGIT_INDEX] !== '9') {
    return { cellphone: true };
  }
  return null;
}
