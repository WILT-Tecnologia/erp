<?php
namespace App\Models\Central;

use App\Enums\AdminStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use HasUuids;
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
        ];
    }

    protected static function newFactory(): \Database\Factories\Central\AdminFactory
    {
        return \Database\Factories\Central\AdminFactory::new();
    }
}
