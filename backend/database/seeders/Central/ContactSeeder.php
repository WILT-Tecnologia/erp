<?php

namespace Database\Seeders\Central;

use App\Models\Central\Contact;
use App\Models\Central\Organization;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    /**
     * Migra os leads de exemplo (antes mockados no frontend) para a
     * organização demo, dando dado real ao pipeline do CRM.
     */
    public function run(): void
    {
        if (app()->environment('production')) {
            return;
        }

        $organization = Organization::first();

        if (! $organization) {
            return;
        }

        $contacts = [
            ['name' => 'Família Souza', 'email' => 'familia.souza@exemplo.com', 'phone' => '(11) 99999-1001', 'assignee' => 'Pastor Carlos', 'status' => 'novo', 'value' => 0, 'tags' => ['Família', 'Indicação'], 'notes' => 'Chegaram pelo culto de domingo, ainda sem contato.'],
            ['name' => 'Ricardo Almeida', 'email' => 'ricardo.almeida@exemplo.com', 'phone' => '(11) 99999-1002', 'assignee' => 'Evangelista Ana', 'status' => 'novo', 'value' => 0, 'tags' => ['Jovem'], 'notes' => ''],
            ['name' => 'Mariana Costa', 'email' => 'mariana.costa@exemplo.com', 'phone' => '(21) 99999-1003', 'assignee' => 'Diácono João', 'status' => 'contato', 'value' => 0, 'tags' => ['Evangelização'], 'notes' => 'Já recebeu a primeira mensagem de boas-vindas.'],
            ['name' => 'Família Pereira', 'email' => 'familia.pereira@exemplo.com', 'phone' => '(11) 99999-1004', 'assignee' => 'Pastor Carlos', 'status' => 'contato', 'value' => 0, 'tags' => ['Família', 'Jovem'], 'notes' => ''],
            ['name' => 'Empresa Gráfica Silva', 'email' => 'contato@graficasilva.com', 'phone' => '(11) 3333-1005', 'assignee' => 'Secretária Maria', 'status' => 'qualificado', 'value' => 3200, 'tags' => ['Parceiro'], 'notes' => 'Interessados em patrocinar o evento de jovens.'],
            ['name' => 'Fernanda Lima', 'email' => 'fernanda.lima@exemplo.com', 'phone' => '(11) 99999-1006', 'assignee' => 'Evangelista Ana', 'status' => 'qualificado', 'value' => 0, 'tags' => ['Jovem', 'Louvor'], 'notes' => ''],
            ['name' => 'Buffet Vida Nova', 'email' => 'vendas@buffetvidanova.com', 'phone' => '(11) 3333-1007', 'assignee' => 'Tesoureiro Carlos', 'status' => 'proposta', 'value' => 4500, 'tags' => ['Fornecedor'], 'notes' => 'Proposta de catering para a conferência de jovens enviada.'],
            ['name' => 'Gráfica Nova Aliança', 'email' => 'orcamento@novaalianca.com', 'phone' => '(11) 3333-1008', 'assignee' => 'Secretária Maria', 'status' => 'proposta', 'value' => 1800, 'tags' => ['Fornecedor'], 'notes' => ''],
            ['name' => 'Família Nogueira', 'email' => 'familia.nogueira@exemplo.com', 'phone' => '(11) 99999-1009', 'assignee' => 'Pastor Carlos', 'status' => 'ganho', 'value' => 0, 'tags' => ['Família', 'Convertido'], 'notes' => 'Passaram a frequentar o culto de domingo regularmente.'],
            ['name' => 'João Vitor Ramos', 'email' => 'joao.ramos@exemplo.com', 'phone' => '(11) 99999-1010', 'assignee' => 'Evangelista Ana', 'status' => 'ganho', 'value' => 0, 'tags' => ['Jovem', 'Convertido'], 'notes' => ''],
            ['name' => 'Camila Rodrigues', 'email' => 'camila.rodrigues@exemplo.com', 'phone' => '(11) 99999-1011', 'assignee' => 'Secretária Maria', 'status' => 'perdido', 'value' => 0, 'tags' => [], 'notes' => 'Mudou de cidade antes de retornar o contato.'],
            ['name' => 'Auto Peças Bom Preço', 'email' => 'financeiro@bompreco.com', 'phone' => '(11) 3333-1012', 'assignee' => 'Tesoureiro Carlos', 'status' => 'perdido', 'value' => 0, 'tags' => ['Fornecedor'], 'notes' => 'Optaram por outro fornecedor.'],
        ];

        foreach ($contacts as $data) {
            Contact::updateOrCreate(
                ['organization_id' => $organization->id, 'name' => $data['name']],
                $data,
            );
        }
    }
}
