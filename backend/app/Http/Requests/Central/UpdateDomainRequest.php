<?php

namespace App\Http\Requests\Central;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Override;

class UpdateDomainRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    #[Override]
    protected function prepareForValidation()
    {
        if ($this->filled('domain')) {
            $this->merge([
                'domain' => strtolower(trim($this->domain)),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $domainId = $this->route('domain')->id;

        return [
            'domain' => [
                'sometimes',
                'string',
                'max:255',
                'regex:/^([a-z0-9]([a-z0-9\-]*[a-z0-9])?\.)+[a-z]{2,}$/i',
                Rule::unique('domains', 'domain')->ignore($domainId),
            ],
            'is_primary' => ['sometimes', 'boolean'],
        ];
    }
}
