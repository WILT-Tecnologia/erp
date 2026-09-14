<?php

namespace App\Models\Central;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PermissionDefinition extends Model
{
    use HasFactory;
    use HasUuids;

    protected $table = 'permission_definitions';

    protected $fillable = [
        'name',
        'label',
        'description',
    ];

    /* ---------- Relações ---------- */

    public function menuRoutes(): BelongsToMany
    {
        return $this->belongsToMany(MenuRoute::class, 'menu_route_permission');
    }
}
