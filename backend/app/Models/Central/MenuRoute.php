<?php

namespace App\Models\Central;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class MenuRoute extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $table = 'menu_routes';

    protected $fillable = [
        'title',
        'slug',
        'icon',
        'category',
        'sort_order',
        'parent_id',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    /* ---------- Relações ---------- */

    public function parent(): BelongsTo
    {
        return $this->belongsTo(MenuRoute::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(MenuRoute::class, 'parent_id')->orderBy('sort_order');
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(PermissionDefinition::class, 'menu_route_permission');
    }

    /* ---------- Scopes ---------- */

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }
}
