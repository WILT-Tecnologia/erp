<?php

namespace App\Http\Requests\Central;

use Illuminate\Foundation\Http\FormRequest;

class StorePermissionDefinitionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150', 'regex:/^[a-z0-9_.\-]+$/', 'unique:permission_definitions,name'],
            'label' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ];
    }
}
