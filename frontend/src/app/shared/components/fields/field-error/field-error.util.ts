import { type ValidationErrors } from '@angular/forms';

export type FieldErrorMap = Record<string, (error: unknown) => string>;

export const DEFAULT_FIELD_ERROR_MESSAGES: FieldErrorMap = {
  required: () => 'Este campo é obrigatório.',
  email: () => 'Informe um e-mail válido.',
  pattern: () => 'Valor inválido.',
  minlength: (error) => `Mínimo de ${(error as { requiredLength: number }).requiredLength} caracteres.`,
  maxlength: (error) => `Máximo de ${(error as { requiredLength: number }).requiredLength} caracteres.`,
  min: (error) => `O valor mínimo é ${(error as { min: number }).min}.`,
  max: (error) => `O valor máximo é ${(error as { max: number }).max}.`,
};

const FALLBACK_MESSAGE = 'Campo inválido.';

export function resolveFieldError(
  errors: ValidationErrors | null,
  overrides: Partial<FieldErrorMap> = {},
): string | null {
  if (!errors) {
    return null;
  }

  const messages = { ...DEFAULT_FIELD_ERROR_MESSAGES, ...overrides } as FieldErrorMap;
  const key = Object.keys(messages).find((candidate) => candidate in errors);

  if (!key) {
    return FALLBACK_MESSAGE;
  }

  const formatMessage = messages[key];
  return formatMessage(errors[key]);
}
