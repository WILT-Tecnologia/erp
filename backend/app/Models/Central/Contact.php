<?php

namespace App\Models\Central;

use App\Enums\ContactStage;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'contacts';

    protected $fillable = [
        'organization_id',
        'name',
        'email',
        'phone',
        'assignee',
        'status',
        'value',
        'tags',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'decimal:2',
            'tags' => 'array',
            'status' => ContactStage::class,
        ];
    }

    /* ---------- Relações ---------- */

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(ContactActivity::class)->orderByDesc('occurred_at');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(ContactTask::class)->orderBy('due_date');
    }
}
