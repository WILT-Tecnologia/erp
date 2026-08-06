<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Http\Requests\Central\StoreContactActivityRequest;
use App\Http\Resources\Central\ContactActivityResource;
use App\Models\Central\Contact;

class ContactActivityController extends Controller
{
    /**
     * Registra uma nova atividade (whatsapp/call/email/note) no contato.
     */
    public function store(StoreContactActivityRequest $request, Contact $contact): ContactActivityResource
    {
        $activity = $contact->activities()->create($request->validated());

        return new ContactActivityResource($activity);
    }
}
