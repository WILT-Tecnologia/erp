import { type AbstractControl, type ValidationErrors } from '@angular/forms';

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const DOMAIN_PATTERN = /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i;

export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,32}$/;
export const PASSWORD_HINT =
  'Mínimo de 8 e máximo de 32 caracteres, com letra maiúscula, minúscula, número e caractere especial.';

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
