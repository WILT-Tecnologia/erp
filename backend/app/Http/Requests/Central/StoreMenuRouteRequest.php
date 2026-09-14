<?php

namespace App\Http\Requests\Central;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreMenuRouteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (! $this->filled('slug') && $this->filled('title')) {
            $this->merge(['slug' => '/' . Str::slug($this->title)]);
        }
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:150'],
            'slug' => ['required', 'string', 'max:255', 'unique:menu_routes,slug'],
            'icon' => ['nullable', 'string', 'max:100'],
            'category' => ['required', 'string', 'max:150'],
            'sort_order' => ['required', 'integer', 'min:0'],
            'parent_id' => ['nullable', 'uuid', 'exists:menu_routes,id'],
            'is_active' => ['nullable', 'boolean'],
            'permission_ids' => ['required', 'array', 'min:1'],
            'permission_ids.*' => ['uuid', 'exists:permission_definitions,id'],
        ];
    }
}
