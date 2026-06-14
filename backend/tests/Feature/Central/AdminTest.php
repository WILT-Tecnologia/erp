<?php

use App\Models\Central\Admin;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->admin = Admin::factory()->create();
});

describe('Auth', function () {

    it('faz login com credenciais válidas', function () {
        $response = $this->postJson('/api/admin/login', [
            'email'    => $this->admin->email,
            'password' => 'password',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token', 'admin' => ['id', 'name', 'email']]);
    });

    it('rejeita login com senha inválida', function () {
        $response = $this->postJson('/api/admin/login', [
            'email'    => $this->admin->email,
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422);
    });

    it('rejeita login de admin inativo', function () {
        $inactive = Admin::factory()->inactive()->create();

        $response = $this->postJson('/api/admin/login', [
            'email'    => $inactive->email,
            'password' => 'password',
        ]);

        $response->assertStatus(422);
    });

    it('retorna o admin autenticado em /me', function () {
        Sanctum::actingAs($this->admin, ['admin:*'], 'api-admin');

        $this->getJson('/api/admin/me')
            ->assertOk();
    });

    it('faz logout e revoga o token', function () {
        Sanctum::actingAs($this->admin, ['admin:*'], 'api-admin');

        $this->postJson('/api/admin/logout')->assertOk();
    });
});

describe('Admin CRUD', function () {

    beforeEach(function () {
        Sanctum::actingAs($this->admin, ['admin:*'], 'api-admin');
    });

    it('lista admins', function () {
        Admin::factory()->count(3)->create();

        $this->getJson('/api/admin/admins')
            ->assertOk()
            ->assertJsonStructure(['data' => [['id', 'name', 'email']], 'meta', 'links']);
    });

    it('filtra admins por busca', function () {
        Admin::factory()->create(['name' => 'João Silva']);
        Admin::factory()->create(['name' => 'Maria Santos']);

        $response = $this->getJson('/api/admin/admins?search=João')->assertOk();

        expect($response->json('data'))->toHaveCount(1);
    });

    it('cria um novo admin', function () {
        $payload = [
            'name'                  => 'Novo Admin',
            'email'                 => 'novo@saas.local',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ];

        $this->postJson('/api/admin/admins', $payload)
            ->assertCreated()
            ->assertJson(['data' => ['email' => 'novo@saas.local']]);

        $this->assertDatabaseHas('admins', ['email' => 'novo@saas.local']);
    });

    it('rejeita criação com email duplicado', function () {
        $existing = Admin::factory()->create();

        $this->postJson('/api/admin/admins', [
            'name'                  => 'X',
            'email'                 => $existing->email,
            'password'              => 'password123',
            'password_confirmation' => 'password123',
        ])->assertStatus(422)->assertJsonValidationErrors(['email']);
    });

    it('exibe um admin específico', function () {
        $other = Admin::factory()->create();

        $this->getJson("/api/admin/admins/{$other->id}")
            ->assertOk()
            ->assertJson(['data' => ['id' => $other->id]]);
    });

    it('atualiza um admin', function () {
        $other = Admin::factory()->create();

        $this->putJson("/api/admin/admins/{$other->id}", ['name' => 'Nome Alterado'])
            ->assertOk()
            ->assertJson(['data' => ['name' => 'Nome Alterado']]);
    });

    it('deleta um admin (soft delete)', function () {
        $other = Admin::factory()->create();

        $this->deleteJson("/api/admin/admins/{$other->id}")->assertNoContent();

        $this->assertSoftDeleted('admins', ['id' => $other->id]);
    });

    it('impede que o admin se auto-exclua', function () {
        $this->deleteJson("/api/admin/admins/{$this->admin->id}")
            ->assertStatus(422);
    });

    it('exige autenticação para endpoints protegidos', function () {
        // Não pode usar o actingAs do beforeEach — testar sem auth
        auth('api-admin')->forgetUser();
        app('auth')->forgetGuards();

        $this->withHeader('Accept', 'application/json')
            ->getJson('/api/admin/admins')
            ->assertStatus(401);
    });
});
