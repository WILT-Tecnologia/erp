<?php

namespace App\Http\Requests\Central;

use App\Enums\AdminStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateAdminRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $adminId = $this->route('admin')->id;

        return [
            'name'     => ['sometimes', 'string', 'max:255'],
            'email'    => ['sometimes', 'email', 'max:255', Rule::unique('admins', 'email')->ignore($adminId)],
            'password' => ['sometimes', 'confirmed', Password::defaults()],
            'phone'    => ['sometimes', 'nullable', 'string', 'max:20'],
            'locale'   => ['sometimes', 'nullable', 'string', 'max:10'],
            'timezone' => ['sometimes', 'nullable', 'string', 'max:60'],
            'status'   => ['sometimes', Rule::enum(AdminStatus::class)],
            'settings' => ['sometimes', 'nullable', 'array'],
        ];
    }
}
