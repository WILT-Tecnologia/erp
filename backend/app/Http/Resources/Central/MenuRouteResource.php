<?php

namespace App\Http\Resources\Central;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuRouteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'icon' => $this->icon,
            'category' => $this->category,
            'sort_order' => $this->sort_order,
            'parent_id' => $this->parent_id,
            'is_active' => $this->is_active,
            'permissions' => PermissionDefinitionResource::collection($this->whenLoaded('permissions')),
            'children' => MenuRouteResource::collection($this->whenLoaded('children')),
            'children_count' => $this->whenCounted('children'),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
