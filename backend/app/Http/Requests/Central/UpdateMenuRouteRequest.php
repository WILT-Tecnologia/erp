<?php

namespace App\Http\Requests\Central;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMenuRouteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $menuRouteId = $this->route('menu_route')->id;

        return [
            'title' => ['sometimes', 'string', 'max:150'],
            'slug' => ['sometimes', 'string', 'max:255', Rule::unique('menu_routes', 'slug')->ignore($menuRouteId)],
            'icon' => ['sometimes', 'nullable', 'string', 'max:100'],
            'category' => ['sometimes', 'string', 'max:150'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'parent_id' => ['sometimes', 'nullable', 'uuid', 'exists:menu_routes,id', Rule::notIn([$menuRouteId])],
            'is_active' => ['sometimes', 'boolean'],
            'permission_ids' => ['sometimes', 'array', 'min:1'],
            'permission_ids.*' => ['uuid', 'exists:permission_definitions,id'],
        ];
    }
}
