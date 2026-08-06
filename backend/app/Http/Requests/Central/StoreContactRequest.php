<?php

namespace App\Http\Requests\Central;

use App\Enums\ContactStage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'organization_id' => ['required', 'uuid', 'exists:organizations,id'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'assignee' => ['nullable', 'string', 'max:150'],
            'status' => ['required', Rule::enum(ContactStage::class)],
            'value' => ['nullable', 'numeric', 'min:0'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
