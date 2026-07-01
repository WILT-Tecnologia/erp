<?php

namespace App\Models\Central;

use App\Enums\OrganizationStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Override;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;


class Organization extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase;
    use HasDomains;
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'organizations';

    /**
     * Colunas que NÃO devem ir para a coluna jsonb `data`,
     * sendo persistidas em colunas próprias.
     */
    public static function getCustomColumns(): array
    {
        return [
            'id',
            'name',
            'legal_name',
            'slug',
            'cnpj',
            'email',
            'phone',
            'whatsapp',
            'logo',
            'cover_image',
            'description',
            'founded_at',
            'status',
            'timezone',
            'language',
            'plan_id',
            'owner_admin_id',
            'settings',
            'created_at',
            'updated_at',
            'deleted_at',
        ];
    }

    protected $fillable = [
        'id',
        'name',
        'legal_name',
        'slug',
        'cnpj',
        'email',
        'phone',
        'whatsapp',
        'logo',
        'cover_image',
        'description',
        'founded_at',
        'status',
        'timezone',
        'language',
        'plan_id',
        'owner_admin_id',
        'settings',
    ];

    protected function casts(): array
    {
        return [
            'founded_at' => 'date',
            'settings' => 'array',
            'data' => 'array',
            'status' => OrganizationStatus::class
        ];
    }

     /* ---------- Relações ---------- */

     public function plan(): BelongsTo
     {
        return $this->belongsTo(Plan::class);
     }

     public function ownerAdmin(): BelongsTo
     {
        return $this->belongsTo(Admin::class, 'owner_admin_id');
     }

     public function subscriptions(): HasMany
     {
        return $this->hasMany(Subscription::class);
     }

     /* ---------- Scopes ---------- */

     public function scopeActive($query)
     {
        return $query->where('status', OrganizationStatus::Active);
     }

     /* ---------- Route binding por slug ---------- */

     public function getRouteKeyName(): string
     {
        return 'slug';
     }

     /* ---------- Factory ---------- */

     protected static function newFactory(): \Database\Factories\Central\OrganizationFactory
    {
        return \Database\Factories\Central\OrganizationFactory::new();
    }
}
