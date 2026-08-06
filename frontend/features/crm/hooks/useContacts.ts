"use client"

import { useCallback } from "react"
import { toast } from "sonner"
import useSWR from "swr"
import { API_ENDPOINTS } from "@/constants"
import { contactService } from "../services/contact.service"
import { useContactStore } from "@/store/contact.store"
import type { Contact, ContactActivity, PaginatedResponse } from "@/types"

export function useContacts(organizationId: string | null) {
  const { contacts, setContacts, addContact, updateContact, removeContact } =
    useContactStore()

  const key = organizationId
    ? `${API_ENDPOINTS.CONTACTS}?organization_id=${organizationId}`
    : null

  const { isLoading, mutate } = useSWR<PaginatedResponse<Contact>>(
    key,
    () =>
      contactService.list({
        organization_id: organizationId as string,
        per_page: 100,
      }),
    {
      revalidateOnFocus: false,
      onSuccess: (data) => setContacts(data.data),
    }
  )

  const createContact = useCallback(
    async (payload: Parameters<typeof contactService.create>[0]) => {
      try {
        const response = await contactService.create(payload)
        addContact(response)
        toast.success("Contato criado com sucesso!")
        await mutate()
        return response
      } catch (error) {
        const err = error as { body?: { message?: string } }
        toast.error(err.body?.message ?? "Erro ao criar contato")
        throw error
      }
    },
    [addContact, mutate]
  )

  const editContact = useCallback(
    async (
      id: string,
      payload: Parameters<typeof contactService.update>[1]
    ) => {
      // Otimista: aplica local antes da resposta (usado no drag-and-drop do Kanban)
      const previous = contacts.find((c) => c.id === id)
      updateContact(id, payload as Partial<Contact>)
      try {
        const response = await contactService.update(id, payload)
        updateContact(id, response)
        await mutate()
        return response
      } catch (error) {
        if (previous) updateContact(id, previous)
        const err = error as { body?: { message?: string } }
        toast.error(err.body?.message ?? "Erro ao atualizar contato")
        throw error
      }
    },
    [contacts, updateContact, mutate]
  )

  const deleteContact = useCallback(
    async (id: string) => {
      try {
        await contactService.delete(id)
        removeContact(id)
        toast.success("Contato removido com sucesso!")
        await mutate()
      } catch (error) {
        const err = error as { body?: { message?: string } }
        toast.error(err.body?.message ?? "Erro ao remover contato")
        throw error
      }
    },
    [removeContact, mutate]
  )

  const addActivity = useCallback(
    async (
      contactId: string,
      data: { type: ContactActivity["type"]; text: string; user?: string }
    ) => {
      const activity = await contactService.addActivity(contactId, data)
      const contact = contacts.find((c) => c.id === contactId)
      if (contact) {
        updateContact(contactId, {
          activities: [activity, ...contact.activities],
        })
      }
      await mutate()
      return activity
    },
    [contacts, updateContact, mutate]
  )

  const addTask = useCallback(
    async (contactId: string, data: { label: string; due_date?: string }) => {
      const task = await contactService.addTask(contactId, data)
      const contact = contacts.find((c) => c.id === contactId)
      if (contact) {
        updateContact(contactId, { tasks: [...contact.tasks, task] })
      }
      await mutate()
      return task
    },
    [contacts, updateContact, mutate]
  )

  const toggleTask = useCallback(
    async (contactId: string, taskId: string, done: boolean) => {
      const task = await contactService.updateTask(contactId, taskId, { done })
      const contact = contacts.find((c) => c.id === contactId)
      if (contact) {
        updateContact(contactId, {
          tasks: contact.tasks.map((t) => (t.id === taskId ? task : t)),
        })
      }
      await mutate()
      return task
    },
    [contacts, updateContact, mutate]
  )

  return {
    contacts,
    isLoading,
    refresh: mutate,
    createContact,
    editContact,
    deleteContact,
    addActivity,
    addTask,
    toggleTask,
  }
}
