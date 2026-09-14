<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Http\Requests\Central\StoreContactRequest;
use App\Http\Requests\Central\UpdateContactRequest;
use App\Http\Resources\Central\ContactResource;
use App\Models\Central\Contact;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ContactController extends Controller
{
    /**
     * Lista paginada de contatos de uma organização.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'organization_id' => ['required', 'uuid', 'exists:organizations,id'],
        ]);

        $perPage = min((int) $request->query('per_page', 100), 200);

        $contacts = Contact::query()
            ->where('organization_id', $request->query('organization_id'))
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->when($request->query('search'), fn ($q, $search) => $q->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            }))
            ->orderByDesc('updated_at')
            ->paginate($perPage);

        return ContactResource::collection($contacts);
    }

    /**
     * Cria um novo contato.
     */
    public function store(StoreContactRequest $request): ContactResource
    {
        $contact = Contact::create($request->validated());

        return new ContactResource($contact);
    }

    /**
     * Exibe um contato com atividades e tarefas.
     */
    public function show(Contact $contact): ContactResource
    {
        return new ContactResource($contact->load(['activities', 'tasks']));
    }

    /**
     * Atualiza um contato (inclui a troca de estágio via drag-and-drop).
     */
    public function update(UpdateContactRequest $request, Contact $contact): ContactResource
    {
        $contact->update($request->validated());

        return new ContactResource($contact->fresh(['activities', 'tasks']));
    }

    /**
     * Remove um contato. Atividades/tarefas são removidas em cascata (FK).
     */
    public function destroy(Contact $contact): JsonResponse
    {
        $contact->delete();

        return response()->json(null, 204);
    }
}
