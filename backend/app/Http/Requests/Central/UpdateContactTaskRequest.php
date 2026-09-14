<?php

namespace App\Http\Requests\Central;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContactTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'label' => ['sometimes', 'string', 'max:255'],
            'due_date' => ['sometimes', 'nullable', 'date'],
            'done' => ['sometimes', 'boolean'],
        ];
    }
}
