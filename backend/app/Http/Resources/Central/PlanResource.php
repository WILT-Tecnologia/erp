<?php

namespace App\Http\Resources\Central;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price_monthly' => (float) $this->price_monthly,
            'price_yearly' => (float) $this->price_yearly,
            'trial_days' => $this->trial_days,
            'max_users' => $this->max_users,
            'max_members' => $this->max_members,
            'max_storage_gb' => $this->max_storage_gb,
            'features' => $this->features,
            'is_public' => $this->is_public,
            'sort_order' => $this->sort_order,
            'status' => $this->status,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at'=> $this->updated_at?->toIso8601String(),
        ];
    }
}
