import { api } from "@/services/api"
import { API_ENDPOINTS } from "@/constants"
import type { Organization, PaginatedResponse } from "@/types"
import type { OrganizationFormData } from "@/schemas/organization.schema"

// O OrganizationController devolve recursos únicos (show/store/update)
// envelopados em { data: ... }, seguindo o wrapping padrão do Laravel.
export const organizationService = {
  async list(params?: Record<string, string | number | boolean>) {
    return api.get<PaginatedResponse<Organization>>(API_ENDPOINTS.ORGANIZATIONS, { params })
  },

  async create(data: OrganizationFormData) {
    const response = await api.post<{ data: Organization }>(API_ENDPOINTS.ORGANIZATIONS, data)
    return response.data
  },

  async update(id: string, data: Partial<OrganizationFormData>) {
    const response = await api.put<{ data: Organization }>(
      API_ENDPOINTS.ORGANIZATION(id),
      data
    )
    return response.data
  },

  async delete(id: string) {
    return api.delete(API_ENDPOINTS.ORGANIZATION(id))
  },

  async suspend(id: string) {
    const response = await api.post<{ data: Organization }>(
      API_ENDPOINTS.ORGANIZATION_SUSPEND(id)
    )
    return response.data
  },

  async activate(id: string) {
    const response = await api.post<{ data: Organization }>(
      API_ENDPOINTS.ORGANIZATION_ACTIVATE(id)
    )
    return response.data
  },
}
