<?php

namespace App\Http\Requests\Central;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContactActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (! $this->filled('occurred_at')) {
            $this->merge(['occurred_at' => now()]);
        }
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::in(['whatsapp', 'call', 'email', 'note'])],
            'text' => ['required', 'string'],
            'user' => ['nullable', 'string', 'max:150'],
            'occurred_at' => ['required', 'date'],
        ];
    }
}
