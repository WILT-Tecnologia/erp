<?php

namespace App\Http\Requests\Central;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePermissionDefinitionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $permissionDefinitionId = $this->route('permission_definition')->id;

        return [
            'name' => [
                'sometimes', 'string', 'max:150', 'regex:/^[a-z0-9_.\-]+$/',
                Rule::unique('permission_definitions', 'name')->ignore($permissionDefinitionId),
            ],
            'label' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
