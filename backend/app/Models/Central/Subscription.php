<?php

namespace App\Models\Central;

use App\Enums\SubscriptionStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    use HasFactory;
    use HasUuids;

    protected $table = 'subscriptions';

    protected $fillable = [
        'organization_id',
        'plan_id',
        'status',
        'amount',
        'started_at',
        'current_period_start',
        'current_period_end',
        'canceled_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'started_at' => 'datetime',
            'current_period_start' => 'datetime',
            'current_period_end' => 'datetime',
            'canceled_at' => 'datetime',
            'status' => SubscriptionStatus::class,
        ];
    }

    /* ---------- Relações ---------- */

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    /* ---------- Scopes ---------- */

    public function scopeActive($query)
    {
        return $query->where('status', SubscriptionStatus::Active);
    }

    public function scopePastDue($query)
    {
        return $query->where('status', SubscriptionStatus::PastDue);
    }

    public function scopeCanceled($query)
    {
        return $query->where('status', SubscriptionStatus::Canceled);
    }
}
