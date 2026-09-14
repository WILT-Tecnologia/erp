<?php

namespace App\Http\Resources\Central;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'organization_id' => $this->organization_id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'assignee' => $this->assignee,
            'status' => $this->status,
            'value' => (float) $this->value,
            'tags' => $this->tags ?? [],
            'notes' => $this->notes,
            'activities' => ContactActivityResource::collection($this->whenLoaded('activities')),
            'tasks' => ContactTaskResource::collection($this->whenLoaded('tasks')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
