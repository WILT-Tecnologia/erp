<?php

namespace App\Models\Central;

use App\Enums\CongregationStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Congregation extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'congregations';

    protected $fillable = [
        'organization_id',
        'name',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => CongregationStatus::class,
        ];
    }

    /* ---------- Relações ---------- */

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /* ---------- Scopes ---------- */

    public function scopeActive($query)
    {
        return $query->where('status', CongregationStatus::Active);
    }
}
