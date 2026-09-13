<?php

namespace App\Http\Resources\Central;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DomainResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'organization_id' => $this->tenant_id,
            'domain' => $this->domain,
            'is_primary' => $this->is_primary,
            'is_verified' => $this->is_verified,
            'verification_token' => $this->when(
                ! $this->is_verified,
                fn () => $this->verification_token,
            ),
            'verified_at' => $this->verified_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
