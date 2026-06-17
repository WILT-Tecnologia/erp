<?php

namespace App\Models\Central;

use App\Enums\PlanStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Plan extends Model
{
    use HasFactory;
    use HasUuids;
    use softDeletes;

    protected $table = 'plans';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price_monthly',
        'price_yearly',
        'trial_days',
        'max_users',
        'max_members',
        'max_storage_gb',
        'features',
        'is_public',
        'sort_order',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'price_monthly' => 'decimal:2',
            'price_yearly' => 'decimal:2',
            'trial_days' => 'integer',
            'max_users' => 'integer',
            'max_members' => 'integer',
            'max_storage_gb' => 'integer',
            'features' => 'array',
            'is_public' => 'boolean',
            'sort_order' => 'integer',
            'status' => PlanStatus::class,
        ];
    }

    /* ---------- Scopes ---------- */
    public function scopeActive($query)
    {
        return $query->where('status', PlanStatus::Active);
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /* ---------- Factory binding ---------- */

    protected static function newFactory(): \Database\Factories\Central\PlanFactory
    {
        return \Database\Factories\Central\PlanFactory::new();
    }

    /* ---------- Route binding por slug ---------- */

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
