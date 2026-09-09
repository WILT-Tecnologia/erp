<?php

use App\Models\Central\Admin;
use App\Models\Central\Domain;
use App\Models\Central\Organization;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    $this->admin = Admin::factory()->create();
    Sanctum::actingAs($this->admin, ['admin:*'], 'api-admin');
    $this->org = Organization::factory()->create();
});

afterEach(function () {
    $schemas = DB::select("
        SELECT schema_name FROM information_schema.schemata
        WHERE schema_name LIKE 'tenant_%'
    ");
    foreach ($schemas as $s) {
        DB::statement("DROP SCHEMA IF EXISTS \"{$s->schema_name}\" CASCADE");
    }
});

describe('Domain CRUD', function () {

    it('lista domínios de uma organização ordenados por primário', function () {
        Domain::factory()->create(['tenant_id' => $this->org->id, 'domain' => 'a.test', 'is_primary' => false]);
        Domain::factory()->create(['tenant_id' => $this->org->id, 'domain' => 'b.test', 'is_primary' => true]);

        $response = $this->getJson("/api/admin/organizations/{$this->org->slug}/domains")
            ->assertOk();

        expect($response->json('data.0.domain'))->toBe('b.test');
    });

    it('cria um domínio para a organização', function () {
        $response = $this->postJson("/api/admin/organizations/{$this->org->slug}/domains", [
            'domain' => 'MinhaIgreja.com.br',
        ])->assertCreated();

        expect($response->json('data.domain'))->toBe('minhaigreja.com.br');
        $this->assertDatabaseHas('domains', [
            'domain'    => 'minhaigreja.com.br',
            'tenant_id' => $this->org->id,
        ]);
    });

    it('promove o primeiro domínio como primário automaticamente', function () {
        $response = $this->postJson("/api/admin/organizations/{$this->org->slug}/domains", [
            'domain' => 'primeiro.test',
        ])->assertCreated();

        $domain = Domain::find($response->json('data.id'));

        expect($domain->is_primary)->toBeTrue();
    });

    it('não promove domínios subsequentes automaticamente', function () {
        Domain::factory()->primary()->create(['tenant_id' => $this->org->id]);

        $response = $this->postJson("/api/admin/organizations/{$this->org->slug}/domains", [
            'domain' => 'segundo.test',
        ])->assertCreated();

        expect($response->json('data.is_primary'))->toBeFalse();
    });

    it('rejeita domínio duplicado globalmente', function () {
        Domain::factory()->create(['domain' => 'existe.test']);

        $this->postJson("/api/admin/organizations/{$this->org->slug}/domains", [
            'domain' => 'existe.test',
        ])->assertStatus(422)->assertJsonValidationErrors(['domain']);
    });

    it('rejeita formato inválido de domínio', function () {
        $this->postJson("/api/admin/organizations/{$this->org->slug}/domains", [
            'domain' => 'não é dominio',
        ])->assertStatus(422)->assertJsonValidationErrors(['domain']);
    });

    it('exibe um domínio específico', function () {
        $domain = Domain::factory()->create(['tenant_id' => $this->org->id]);

        $this->getJson("/api/admin/organizations/{$this->org->slug}/domains/{$domain->id}")
            ->assertOk()
            ->assertJson(['data' => ['id' => $domain->id]]);
    });

    it('404 ao acessar domínio de outra organização', function () {
        $otherOrg = Organization::factory()->create();
        $domain = Domain::factory()->create(['tenant_id' => $otherOrg->id]);

        $this->getJson("/api/admin/organizations/{$this->org->slug}/domains/{$domain->id}")
            ->assertNotFound();
    });

    it('atualiza um domínio', function () {
        $domain = Domain::factory()->create(['tenant_id' => $this->org->id]);

        $this->putJson("/api/admin/organizations/{$this->org->slug}/domains/{$domain->id}", [
            'domain' => 'novo.test',
        ])->assertOk();

        expect($domain->fresh()->domain)->toBe('novo.test');
    });

    it('deleta um domínio quando há mais de um', function () {
        $primary = Domain::factory()->primary()->create(['tenant_id' => $this->org->id]);
        $secondary = Domain::factory()->create(['tenant_id' => $this->org->id]);

        $this->deleteJson("/api/admin/organizations/{$this->org->slug}/domains/{$secondary->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('domains', ['id' => $secondary->id]);
    });

    it('bloqueia deletar o único domínio', function () {
        $domain = Domain::factory()->primary()->create(['tenant_id' => $this->org->id]);

        $this->deleteJson("/api/admin/organizations/{$this->org->slug}/domains/{$domain->id}")
            ->assertStatus(422);

        $this->assertDatabaseHas('domains', ['id' => $domain->id]);
    });

    it('promove outro domínio ao deletar o primário', function () {
        $primary = Domain::factory()->primary()->create(['tenant_id' => $this->org->id]);
        $secondary = Domain::factory()->create(['tenant_id' => $this->org->id]);

        $this->deleteJson("/api/admin/organizations/{$this->org->slug}/domains/{$primary->id}")
            ->assertNoContent();

        expect($secondary->fresh()->is_primary)->toBeTrue();
    });
});

describe('Domain lifecycle', function () {

    it('verifica um domínio', function () {
        $domain = Domain::factory()->create(['tenant_id' => $this->org->id]);

        $this->postJson("/api/admin/organizations/{$this->org->slug}/domains/{$domain->id}/verify")
            ->assertOk()
            ->assertJson(['data' => ['is_verified' => true]]);

        expect($domain->fresh()->verified_at)->not->toBeNull();
    });

    it('esconde verification_token após verificação', function () {
        $domain = Domain::factory()->verified()->create(['tenant_id' => $this->org->id]);

        $response = $this->getJson("/api/admin/organizations/{$this->org->slug}/domains/{$domain->id}")
            ->assertOk();

        expect($response->json('data'))->not->toHaveKey('verification_token');
    });

    it('promove domínio a primário e despromove os outros', function () {
        $current = Domain::factory()->primary()->create(['tenant_id' => $this->org->id]);
        $target = Domain::factory()->create(['tenant_id' => $this->org->id]);

        $this->postJson("/api/admin/organizations/{$this->org->slug}/domains/{$target->id}/make-primary")
            ->assertOk();

        expect($target->fresh()->is_primary)->toBeTrue()
            ->and($current->fresh()->is_primary)->toBeFalse();
    });
});
