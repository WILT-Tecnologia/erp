<?php

namespace App\Actions\Central;

use App\Models\Central\Organization;
use Illuminate\Support\Facades\DB;

class DeleteOrganizationAction
{
    /**
     * Soft delete da organização. O schema é mantido para auditoria
     * e pode ser restaurado. O drop físico só ocorre via comando admin.
     */
    public function softDelete(Organization $organization): void
    {
        DB::transaction(function () use ($organization) {
            // Suspende antes de deletar
            $organization->update(['status' => 'suspended']);
            $organization->delete();
        });
    }

    /**
     * Drop definitivo: remove o schema do Postgres e o registro.
     * Use apenas após confirmação explícita.
     */
    public function forceDelete(Organization $organization): void
    {
        $organization->database()->manager()->deleteDatabase($organization);
        $organization->forceDelete();
    }
}
