<?php

namespace App\Http\Resources\Tenant;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Exposição mínima da organization para um usuário do tenant — apenas o
 * necessário para o frontend rotear/exibir o contexto atual. Dados
 * administrativos (plano, owner, settings, domains) não são expostos aqui.
 */
class OrganizationSummaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
        ];
    }
}
