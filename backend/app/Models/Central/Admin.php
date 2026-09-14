<?php
namespace App\Models\Central;

use App\Enums\AdminStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class Admin extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use HasUuids;
    use LogsActivity;
    use Notifiable;
    use SoftDeletes;

    protected $table = 'admins';

    protected $fillable = [
        'id',
        'name',
        'email',
        'password',
        'avatar',
        'phone',
        'locale',
        'timezone',
        'status',
        'is_super_admin',
        'settings',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'settings' => 'array',
            'status' => AdminStatus::class,
            'is_super_admin' => 'boolean',
        ];
    }

    protected static function newFactory(): \Database\Factories\Central\AdminFactory
    {
        return \Database\Factories\Central\AdminFactory::new();
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'email', 'status', 'is_super_admin'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges()
            ->useLogName('admin');
    }

    public function ownedOrganizations(): HasMany
    {
        return $this->hasMany(Organization::class, 'owner_admin_id');
    }
}
