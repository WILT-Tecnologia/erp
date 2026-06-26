<?php

namespace App\Http\Requests\Central;

use App\Enums\PlanStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StorePlanRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if(!$this->filled('slug') && $this->filled('name')) {
            $this->merge(['slug' => Str::slug($this->name)]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:plans,name'],
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', 'unique:plans,slug'],
            'description' => ['nullable', 'string'],
            'price_monthly' => ['required', 'numeric', 'min:0', 'decimal:0,2'],
            'price_yearly' => ['required', 'numeric', 'min:0', 'decimal:0,2'],
            'trial_days' => ['nullable', 'integer', 'min:0', 'max:365'],
            'max_users' => ['required', 'integer', 'min:1'],
            'max_members' => ['required', 'integer', 'min:1'],
            'max_storage_gb' => ['required', 'integer', 'min:1'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string'],
            'is_public' => ['nullable', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'status' => ['nullable', Rule::enum(PlanStatus::class)],
        ];
    }
}
