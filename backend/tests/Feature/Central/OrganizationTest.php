<?php

use App\Actions\Central\CreateOrganizationAction;
use App\Models\Central\Admin;
use App\Models\Central\Organization;
use App\Models\Central\Plan;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->admin = Admin::factory()->create();
    $this->plan = Plan::factory()->create();
    Sanctum::actingAs($this->admin, ['admin:*'], 'api-admin');
});

afterEach(function () {
    // Limpa schemas tenant criados durante o teste
    $schemas = DB::select("
        SELECT schema_name FROM information_schema.schemata
        WHERE schema_name LIKE 'tenant_%'
    ");
    foreach ($schemas as $s) {
        DB::statement("DROP SCHEMA IF EXISTS \"{$s->schema_name}\" CASCADE");
    }
});

describe('Organization CRUD', function () {

    it('lista organizações com plan e ownerAdmin', function () {
        Organization::factory()->count(3)->create(['plan_id' => $this->plan->id]);

        $this->getJson('/api/admin/organizations')
            ->assertOk()
            ->assertJsonStructure(['data' => [['id', 'name', 'slug', 'plan']]]);
    });

    it('filtra organizações por status', function () {
        Organization::factory()->count(2)->create();
        Organization::factory()->suspended()->create();

        $response = $this->getJson('/api/admin/organizations?status=suspended')->assertOk();

        expect($response->json('data'))->toHaveCount(1);
    });

    it('busca organizações por nome ou cnpj', function () {
        Organization::factory()->create(['name' => 'Catedral Batista']);
        Organization::factory()->create(['name' => 'Outra Igreja']);

        $response = $this->getJson('/api/admin/organizations?search=Catedral')->assertOk();

        expect($response->json('data'))->toHaveCount(1);
    });

    // it('cria uma organização e provisiona o schema', function () {
    //     $payload = [
    //         'name'       => 'Nova Igreja',
    //         'cnpj'       => '11.222.333/0001-44',
    //         'email'      => 'nova@igreja.test',
    //         'plan_id'    => $this->plan->id,
    //     ];

    //     $response = $this->postJson('/api/admin/organizations', $payload)
    //         ->assertCreated()
    //         ->assertJson(['data' => [
    //             'name' => 'Nova Igreja',
    //             'slug' => 'nova-igreja',
    //             'cnpj' => '11222333000144', // normalizado
    //         ]]);

    //     $orgId = $response->json('data.id');

    //     // Verifica que o schema foi criado no Postgres
    //     $schemas = DB::select("
    //         SELECT schema_name FROM information_schema.schemata
    //         WHERE schema_name = ?
    //     ", ["tenant_{$orgId}"]);

    //     expect($schemas)->not->toBeEmpty();
    // });

    it('cria organização com domínio inicial', function () {
        $payload = [
            'name'   => 'Com Dominio',
            'domain' => 'comdominio.test',
        ];

        $response = $this->postJson('/api/admin/organizations', $payload)->assertCreated();

        expect($response->json('data.domains'))->toContain('comdominio.test');
    });

    it('rejeita criação com slug duplicado', function () {
        Organization::factory()->create(['slug' => 'duplicado']);

        $this->postJson('/api/admin/organizations', [
            'name' => 'X',
            'slug' => 'duplicado',
        ])->assertStatus(422)->assertJsonValidationErrors(['slug']);
    });

    it('rejeita CNPJ com tamanho inválido', function () {
        $this->postJson('/api/admin/organizations', [
            'name' => 'X',
            'cnpj' => '123',
        ])->assertStatus(422)->assertJsonValidationErrors(['cnpj']);
    });

    it('exibe uma organização específica por slug', function () {
        $org = Organization::factory()->create(['slug' => 'minha-org']);

        $this->getJson('/api/admin/organizations/minha-org')
            ->assertOk()
            ->assertJson(['data' => ['id' => $org->id]]);
    });

    it('atualiza uma organização', function () {
        $org = Organization::factory()->create();

        $this->putJson("/api/admin/organizations/{$org->slug}", [
            'name'        => 'Nome Alterado',
            'description' => 'Nova descrição',
        ])
            ->assertOk()
            ->assertJson(['data' => ['name' => 'Nome Alterado']]);
    });

    it('soft delete suspende e marca como deletada', function () {
        $org = Organization::factory()->create();

        $this->deleteJson("/api/admin/organizations/{$org->slug}")->assertNoContent();

        $this->assertSoftDeleted('organizations', ['id' => $org->id]);
    });
});

describe('Organization lifecycle', function () {

    it('suspende uma organização', function () {
        $org = Organization::factory()->create(['status' => 'active']);

        $this->postJson("/api/admin/organizations/{$org->slug}/suspend")
            ->assertOk()
            ->assertJson(['data' => ['status' => 'suspended']]);
    });

    it('ativa uma organização suspensa', function () {
        $org = Organization::factory()->suspended()->create();

        $this->postJson("/api/admin/organizations/{$org->slug}/activate")
            ->assertOk()
            ->assertJson(['data' => ['status' => 'active']]);
    });

    // it('force delete requer confirmação por slug', function () {
    //     $org = Organization::factory()->create(['slug' => 'para-deletar']);

    //     // Sem confirmação
    //     $this->deleteJson("/api/admin/organizations/{$org->slug}/force")
    //         ->assertStatus(422)->assertJsonValidationErrors(['confirmation']);

    //     // Confirmação errada
    //     $this->deleteJson("/api/admin/organizations/{$org->slug}/force", [
    //         'confirmation' => 'errado',
    //     ])->assertStatus(422);

    //     // Confirmação correta
    //     $this->deleteJson("/api/admin/organizations/{$org->slug}/force", [
    //         'confirmation' => 'para-deletar',
    //     ])->assertOk();

    //     $this->assertDatabaseMissing('organizations', ['id' => $org->id]);
    // });
});

// describe('CreateOrganizationAction', function () {

//     it('cria a organização e schema dentro de transação', function () {
//         $action = app(CreateOrganizationAction::class);

//         $org = $action->execute([
//             'name' => 'Action Test',
//             'slug' => 'action-test',
//             'plan_id' => $this->plan->id,
//         ]);

//         expect($org)->toBeInstanceOf(Organization::class);

//         $schemas = DB::select("
//             SELECT schema_name FROM information_schema.schemata
//             WHERE schema_name = ?
//         ", ["tenant_{$org->id}"]);

//         expect($schemas)->not->toBeEmpty();
//     });
// });
