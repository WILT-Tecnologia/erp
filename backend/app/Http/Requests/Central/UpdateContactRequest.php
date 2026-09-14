<?php

namespace App\Http\Requests\Central;

use App\Enums\ContactStage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'assignee' => ['sometimes', 'nullable', 'string', 'max:150'],
            'status' => ['sometimes', Rule::enum(ContactStage::class)],
            'value' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'tags' => ['sometimes', 'nullable', 'array'],
            'tags.*' => ['string'],
            'notes' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
