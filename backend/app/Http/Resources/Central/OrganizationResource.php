<?php

namespace App\Http\Resources\Central;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrganizationResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'legal_name' => $this->legal_name,
            'slug' => $this->slug,
            'cnpj' => $this->cnpj,
            'email' => $this->email,
            'phone' => $this->phone,
            'whatsapp' => $this->whatsapp,
            'logo' => $this->logo,
            'cover_image' => $this->cover_image,
            'description' => $this->description,
            'founded_at' => $this->founded_at?->toDateString(),
            'status' => $this->status,
            'timezone' => $this->timezone,
            'language' => $this->language,
            'settings' => $this->settings,

            'plan' => new PlanResource($this->whenLoaded('plan')),
            'owner_admin' => new AdminResource($this->whenLoaded('ownerAdmin')),
            'domains' => $this->whenLoaded('domains', fn () => $this->domains->pluck('domain')),

            'schema_name' => 'tenant_' . $this->id,

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
