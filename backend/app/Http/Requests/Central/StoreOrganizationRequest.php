<?php

namespace App\Http\Requests\Central;

use App\Enums\OrganizationStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreOrganizationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (!$this->filled('slug') && $this->filled('name')) {
            $this->merge(['slug' => Str::slug($this->name)]);
        }

        if ($this->filled('cnpj')) {
            $this->merge(['cnpj' => preg_replace('/\D/', '', $this->cnpj)]);
        }
    }

    public function rules(): array
    {
        return [
            'name'              => ['required', 'string', 'max:255'],
            'legal_name'        => ['nullable', 'string', 'max:255'],
            'slug'              => ['required', 'string', 'max:255', 'alpha_dash', 'unique:organizations,slug'],
            'cnpj'              => ['nullable', 'string', 'size:14', 'unique:organizations,cnpj'],
            'email'             => ['nullable', 'email', 'max:255'],
            'phone'             => ['nullable', 'string', 'max:20'],
            'whatsapp'          => ['nullable', 'string', 'max:20'],
            'description'       => ['nullable', 'string'],
            'founded_at'        => ['nullable', 'date'],
            'status'            => ['nullable', Rule::enum(OrganizationStatus::class)],
            'timezone'          => ['nullable', 'string', 'max:100', 'timezone'],
            'language'          => ['nullable', 'string', 'max:10'],
            'plan_id'           => ['nullable', 'uuid', 'exists:plans,id'],
            'owner_admin_id'    => ['nullable', 'uuid', 'exists:admins,id'],
            'settings'          => ['nullable', 'array'],

            // Domínio inicial (opcional na criação)
            'domain'            => ['nullable', 'string', 'max:255', 'unique:domains,domain'],

            // Primeiro usuário do tenant (opcional, será criado dentro do schema)
            'first_user'                => ['nullable', 'array'],
            'first_user.name'           => ['required_with:first_user', 'string', 'max:255'],
            'first_user.email'          => ['required_with:first_user', 'email', 'max:255'],
            'first_user.password'       => ['required_with:first_user', 'confirmed', Password::defaults()],
        ];
    }
}
