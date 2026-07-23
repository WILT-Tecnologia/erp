<?php

namespace App\Models\Central;

use Database\Factories\Central\DomainFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Models\Domain as BaseDomain;

class Domain extends BaseDomain
{
    use HasFactory;
    use HasUuids;

    protected $fillable = [
        'domain',
        'tenant_id',
        'is_primary',
        'is_verified',
        'verification_token',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'is_verified' => 'boolean',
            'verified_at' => 'datetime',
        ];
    }

    /* ---------- Relação nomeada ---------- */

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class, 'tenant_id');
    }

    /* ---------- Boot ---------- */

    protected static function booted(): void
    {
        // Gera token de verificação ao criar
        static::creating(function (Domain $domain) {
            if (empty($domain->verification_token)) {
                $domain->verification_token = Str::random(48);
            }
        });

        // Primeiro domínio da org é sempre primário
        static::created(function (Domain $domain) {
            $count = static::where('tenant_id', $domain->tenant_id)->count();

            if ($count === 1 && ! $domain->is_primary) {
                $domain->update(['is_primary' => true]);
            }
        });

        // Ao marcar como primário, desmarca todos os outros da mesma org
       static::saving(function (Domain  $domain) {
        if ($domain->is_primary && $domain->isDirty('is_primary')) {
            static::where('tenant_id', $domain->tenant_id)
                ->where('id', '!=', $domain->id)
                ->update(['is_primary' => false]);
        }
       });
    }

    /* ---------- Factory ---------- */

    protected static function newFactory(): DomainFactory
    {
        return DomainFactory::new();
    }
}
