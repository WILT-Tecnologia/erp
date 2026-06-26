<?php

use App\Enums\PlanStatus;
use App\Models\Central\Admin;
use App\Models\Central\Plan;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->admin = Admin::factory()->create();
});

describe('Endpoints públicos de plans', function () {

    it('lista apenas planos ativos e públicos', function () {
        Plan::factory()->count(3)->create();
        Plan::factory()->inactive()->create();
        Plan::factory()->private()->create();

        $response = $this->getJson('/api/plans')->assertOk();

        expect($response->json('data'))->toHaveCount(3);
    });

    it('retorna planos ordenados por sort_order e price_monthly', function () {
        Plan::factory()->create(['sort_order' => 20, 'price_monthly' => 100]);
        Plan::factory()->create(['sort_order' => 10, 'price_monthly' => 50]);
        Plan::factory()->create(['sort_order' => 10, 'price_monthly' => 30]);

        $response = $this->getJson('/api/plans')->assertOk();

        $orders = array_column($response->json('data'), 'sort_order');
        expect($orders)->toBe([10, 10, 20]);
    });

    it('exibe um plano público por slug', function () {
        $plan = Plan::factory()->create(['slug' => 'meu-plano']);

        $this->getJson('/api/plans/meu-plano')
            ->assertOk()
            ->assertJson(['data' => ['slug' => 'meu-plano']]);
    });

    it('404 para plano inativo no endpoint público', function () {
        $plan = Plan::factory()->inactive()->create(['slug' => 'oculto']);

        $this->getJson('/api/plans/oculto')->assertNotFound();
    });

    it('404 para plano privado no endpoint público', function () {
        Plan::factory()->private()->create(['slug' => 'enterprise-custom']);

        $this->getJson('/api/plans/enterprise-custom')->assertNotFound();
    });
});

describe('Plan CRUD (admin)', function () {

    beforeEach(function () {
        Sanctum::actingAs($this->admin, ['admin:*'], 'api-admin');
    });

    it('lista todos os planos incluindo inativos e privados', function () {
        Plan::factory()->count(2)->create();
        Plan::factory()->inactive()->create();
        Plan::factory()->private()->create();

        $response = $this->getJson('/api/admin/plans')->assertOk();

        expect($response->json('data'))->toHaveCount(4);
    });

    it('filtra planos por status', function () {
        Plan::factory()->count(2)->create();
        Plan::factory()->inactive()->create();

        $response = $this->getJson('/api/admin/plans?status=inactive')->assertOk();

        expect($response->json('data'))->toHaveCount(1);
    });

    it('filtra planos por busca em nome e slug', function () {
        Plan::factory()->create(['name' => 'Premium Plus', 'slug' => 'premium-plus']);
        Plan::factory()->create(['name' => 'Outro', 'slug' => 'outro']);

        $response = $this->getJson('/api/admin/plans?search=premium')->assertOk();

        expect($response->json('data'))->toHaveCount(1);
    });

    it('cria um novo plano', function () {
        $payload = [
            'name'           => 'Plano Teste',
            'description'    => 'Plano para testes',
            'price_monthly'  => 99.90,
            'price_yearly'   => 999.00,
            'trial_days'     => 14,
            'max_users'      => 10,
            'max_members'    => 500,
            'max_storage_gb' => 20,
            'features'       => ['members', 'events'],
        ];

        $this->postJson('/api/admin/plans', $payload)
            ->assertCreated()
            ->assertJson(['data' => [
                'name' => 'Plano Teste',
                'slug' => 'plano-teste', // gerado automaticamente
            ]]);

        $this->assertDatabaseHas('plans', ['name' => 'Plano Teste', 'slug' => 'plano-teste']);
    });

    it('rejeita criação com nome duplicado', function () {
        Plan::factory()->create(['name' => 'Duplicado']);

        $this->postJson('/api/admin/plans', [
            'name'           => 'Duplicado',
            'price_monthly'  => 10,
            'price_yearly'   => 100,
            'max_users'      => 1,
            'max_members'    => 1,
            'max_storage_gb' => 1,
        ])->assertStatus(422)->assertJsonValidationErrors(['name']);
    });

    it('rejeita criação com preço negativo', function () {
        $this->postJson('/api/admin/plans', [
            'name'           => 'Inválido',
            'price_monthly'  => -10,
            'price_yearly'   => 100,
            'max_users'      => 1,
            'max_members'    => 1,
            'max_storage_gb' => 1,
        ])->assertStatus(422)->assertJsonValidationErrors(['price_monthly']);
    });

    it('exibe um plano específico por slug', function () {
        $plan = Plan::factory()->create(['slug' => 'showcase']);

        $this->getJson('/api/admin/plans/showcase')
            ->assertOk()
            ->assertJson(['data' => ['id' => $plan->id]]);
    });

    it('atualiza um plano', function () {
        $plan = Plan::factory()->create();

        $this->putJson("/api/admin/plans/{$plan->slug}", [
            'price_monthly' => 199.90,
            'status'        => PlanStatus::Inactive->value,
        ])
            ->assertOk()
            ->assertJson(['data' => [
                'price_monthly' => 199.90,
                'status' => 'inactive',
            ]]);
    });

    it('atualiza features como array', function () {
        $plan = Plan::factory()->create();

        $this->putJson("/api/admin/plans/{$plan->slug}", [
            'features' => ['only_this', 'and_that'],
        ])->assertOk();

        expect($plan->fresh()->features)->toBe(['only_this', 'and_that']);
    });

    it('deleta um plano (soft delete)', function () {
        $plan = Plan::factory()->create();

        $this->deleteJson("/api/admin/plans/{$plan->slug}")->assertNoContent();

        $this->assertSoftDeleted('plans', ['id' => $plan->id]);
    });

    it('exige autenticação para endpoints admin', function () {
        auth('api-admin')->forgetUser();
        app('auth')->forgetGuards();

        $this->withHeader('Accept', 'application/json')
            ->getJson('/api/admin/plans')
            ->assertStatus(401);
    });
});
