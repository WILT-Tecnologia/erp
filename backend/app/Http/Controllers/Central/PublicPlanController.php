<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Http\Resources\Central\PlanResource;
use App\Models\Central\Plan;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PublicPlanController extends Controller
{
    /**
     * Lista pública de planos disponíveis para contratação.
     */
    public function index(): AnonymousResourceCollection
    {
        $plans = Plan::query()
            ->active()
            ->public()
            ->orderBy('sort_order')
            ->orderBy('price_monthly')
            ->get();

        return PlanResource::collection($plans);
    }

    /**
     * Detalhes públicos de um plano por slug.
     */
    public function show(Plan $plan): PlanResource
    {
        abort_if(!$plan->is_public || $plan->status->value !== 'active', 404);

        return new PlanResource($plan);
    }
}
