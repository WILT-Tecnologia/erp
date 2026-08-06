<?php

namespace App\Models\Central;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactTask extends Model
{
    use HasUuids;

    protected $table = 'contact_tasks';

    protected $fillable = [
        'contact_id',
        'label',
        'due_date',
        'done',
    ];

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'done' => 'boolean',
        ];
    }

    /* ---------- Relações ---------- */

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }
}
