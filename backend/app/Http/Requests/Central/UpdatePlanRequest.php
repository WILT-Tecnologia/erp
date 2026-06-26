<?php

namespace App\Http\Requests\Central;

use App\Enums\PlanStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePlanRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $planId = $this->route('plan')->id;

        return [
            'name'           => ['sometimes', 'string', 'max:255', Rule::unique('plans', 'name')->ignore($planId)],
            'slug'           => ['sometimes', 'string', 'max:255', 'alpha_dash', Rule::unique('plans', 'slug')->ignore($planId)],
            'description'    => ['sometimes', 'nullable', 'string'],
            'price_monthly'  => ['sometimes', 'numeric', 'min:0', 'decimal:0,2'],
            'price_yearly'   => ['sometimes', 'numeric', 'min:0', 'decimal:0,2'],
            'trial_days'     => ['sometimes', 'integer', 'min:0', 'max:365'],
            'max_users'      => ['sometimes', 'integer', 'min:1'],
            'max_members'    => ['sometimes', 'integer', 'min:1'],
            'max_storage_gb' => ['sometimes', 'integer', 'min:1'],
            'features'       => ['sometimes', 'nullable', 'array'],
            'features.*'     => ['string'],
            'is_public'      => ['sometimes', 'boolean'],
            'sort_order'     => ['sometimes', 'integer', 'min:0'],
            'status'         => ['sometimes', Rule::enum(PlanStatus::class)],
        ];
    }
}
