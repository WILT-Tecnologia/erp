import { api } from "@/services/api"
import { API_ENDPOINTS } from "@/constants"
import type {
  Contact,
  ContactActivity,
  ContactTask,
  PaginatedResponse,
} from "@/types"
import type { ContactFormData } from "@/schemas/contact.schema"

export const contactService = {
  async list(params: Record<string, string | number | boolean>) {
    return api.get<PaginatedResponse<Contact>>(API_ENDPOINTS.CONTACTS, {
      params,
    })
  },

  async create(data: ContactFormData) {
    const response = await api.post<{ data: Contact }>(
      API_ENDPOINTS.CONTACTS,
      data
    )
    return response.data
  },

  async update(id: string, data: Partial<ContactFormData>) {
    const response = await api.put<{ data: Contact }>(
      API_ENDPOINTS.CONTACT(id),
      data
    )
    return response.data
  },

  async delete(id: string) {
    return api.delete(API_ENDPOINTS.CONTACT(id))
  },

  async addActivity(
    contactId: string,
    data: { type: ContactActivity["type"]; text: string; user?: string }
  ) {
    const response = await api.post<{ data: ContactActivity }>(
      API_ENDPOINTS.CONTACT_ACTIVITIES(contactId),
      data
    )
    return response.data
  },

  async addTask(contactId: string, data: { label: string; due_date?: string }) {
    const response = await api.post<{ data: ContactTask }>(
      API_ENDPOINTS.CONTACT_TASKS(contactId),
      data
    )
    return response.data
  },

  async updateTask(
    contactId: string,
    taskId: string,
    data: Partial<{ label: string; due_date: string; done: boolean }>
  ) {
    const response = await api.patch<{ data: ContactTask }>(
      API_ENDPOINTS.CONTACT_TASK(contactId, taskId),
      data
    )
    return response.data
  },
}
