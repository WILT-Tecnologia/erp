import { describe, expect, it } from 'vitest';

import { resolveFieldError } from './field-error.util';

describe('resolveFieldError', () => {
  it('returns null when there are no errors', () => {
    expect(resolveFieldError(null)).toBeNull();
  });

  it('returns the default message for a known error', () => {
    expect(resolveFieldError({ required: true })).toBe('Este campo é obrigatório.');
  });

  it('interpolates error payload into the message', () => {
    expect(resolveFieldError({ minlength: { requiredLength: 5 } })).toBe('Mínimo de 5 caracteres.');
  });

  it('returns a generic fallback for an unknown error', () => {
    expect(resolveFieldError({ unknownError: true })).toBe('Campo inválido.');
  });

  it('lets overrides replace the default message', () => {
    expect(resolveFieldError({ required: true }, { required: () => 'Preencha este campo.' })).toBe(
      'Preencha este campo.',
    );
  });
});
