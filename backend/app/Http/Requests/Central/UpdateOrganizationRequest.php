<?php

namespace App\Http\Requests\Central;

use App\Enums\OrganizationStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrganizationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('cnpj')) {
            $this->merge(['cnpj' => preg_replace('/\D/', '', $this->cnpj)]);
        }
    }

    public function rules(): array
    {
        $orgId = $this->route('organization')->id;

        return [
            'name'              => ['sometimes', 'string', 'max:255'],
            'legal_name'        => ['sometimes', 'nullable', 'string', 'max:255'],
            'slug'              => ['sometimes', 'string', 'max:255', 'alpha_dash', Rule::unique('organizations', 'slug')->ignore($orgId)],
            'cnpj'              => ['sometimes', 'nullable', 'string', 'size:14', Rule::unique('organizations', 'cnpj')->ignore($orgId)],
            'email'             => ['sometimes', 'nullable', 'email', 'max:255'],
            'phone'             => ['sometimes', 'nullable', 'string', 'max:20'],
            'whatsapp'          => ['sometimes', 'nullable', 'string', 'max:20'],
            'description'       => ['sometimes', 'nullable', 'string'],
            'founded_at'        => ['sometimes', 'nullable', 'date'],
            'status'            => ['sometimes', Rule::enum(OrganizationStatus::class)],
            'timezone'          => ['sometimes', 'string', 'max:100', 'timezone'],
            'language'          => ['sometimes', 'string', 'max:10'],
            'plan_id'           => ['sometimes', 'nullable', 'uuid', 'exists:plans,id'],
            'owner_admin_id'    => ['sometimes', 'nullable', 'uuid', 'exists:admins,id'],
            'settings'          => ['sometimes', 'nullable', 'array'],
        ];
    }
}
