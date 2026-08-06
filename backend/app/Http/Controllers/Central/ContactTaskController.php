<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Http\Requests\Central\StoreContactTaskRequest;
use App\Http\Requests\Central\UpdateContactTaskRequest;
use App\Http\Resources\Central\ContactTaskResource;
use App\Models\Central\Contact;
use App\Models\Central\ContactTask;

class ContactTaskController extends Controller
{
    /**
     * Cria uma nova tarefa vinculada ao contato.
     */
    public function store(StoreContactTaskRequest $request, Contact $contact): ContactTaskResource
    {
        $task = $contact->tasks()->create($request->validated());

        return new ContactTaskResource($task);
    }

    /**
     * Atualiza uma tarefa (usado principalmente para marcar como concluída).
     */
    public function update(UpdateContactTaskRequest $request, Contact $contact, ContactTask $task): ContactTaskResource
    {
        $task->update($request->validated());

        return new ContactTaskResource($task->fresh());
    }
}
