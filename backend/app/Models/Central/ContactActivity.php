<?php

namespace App\Models\Central;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactActivity extends Model
{
    use HasUuids;

    protected $table = 'contact_activities';

    protected $fillable = [
        'contact_id',
        'type',
        'text',
        'user',
        'occurred_at',
    ];

    protected function casts(): array
    {
        return [
            'occurred_at' => 'datetime',
        ];
    }

    /* ---------- Relações ---------- */

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }
}
