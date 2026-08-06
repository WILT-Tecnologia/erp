import { api } from "@/services/api"
import { API_ENDPOINTS } from "@/constants"
import type { Plan, PaginatedResponse } from "@/types"
import type { PlanFormData } from "@/schemas/plan.schema"

export const planService = {
  async list(params?: Record<string, string | number | boolean>) {
    return api.get<PaginatedResponse<Plan>>(API_ENDPOINTS.PLANS, { params })
  },

  async create(data: PlanFormData) {
    const response = await api.post<{ data: Plan }>(API_ENDPOINTS.PLANS, data)
    return response.data
  },

  async update(id: string, data: Partial<PlanFormData>) {
    const response = await api.put<{ data: Plan }>(API_ENDPOINTS.PLAN(id), data)
    return response.data
  },

  async delete(id: string) {
    return api.delete(API_ENDPOINTS.PLAN(id))
  },
}
