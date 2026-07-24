import { api } from "@/services/api"
import { API_ENDPOINTS } from "@/constants"
import type { Admin, PaginatedResponse } from "@/types"
import type { AdminFormData } from "@/schemas/admin.schema"

// O AdminController devolve recursos únicos (show/store/update) envelopados
// em { data: ... }, seguindo o wrapping padrão do Laravel JsonResource.
export const adminService = {
  async list(params?: Record<string, string | number | boolean>) {
    return api.get<PaginatedResponse<Admin>>(API_ENDPOINTS.ADMINS, { params })
  },

  async getById(id: string) {
    const response = await api.get<{ data: Admin }>(API_ENDPOINTS.ADMIN(id))
    return response.data
  },

  async create(data: AdminFormData) {
    const response = await api.post<{ data: Admin }>(API_ENDPOINTS.ADMINS, data)
    return response.data
  },

  async update(id: string, data: Partial<AdminFormData>) {
    const response = await api.put<{ data: Admin }>(API_ENDPOINTS.ADMIN(id), data)
    return response.data
  },

  async delete(id: string) {
    return api.delete(API_ENDPOINTS.ADMIN(id))
  },
}
