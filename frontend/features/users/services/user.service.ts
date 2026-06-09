import { api } from "@/services/api"
import type { User, PaginatedResponse } from "@/types"
import type { UserFormData } from "@/schemas/user.schema"

export const userService = {
  async list(params?: Record<string, string | number | boolean>) {
    return api.get<PaginatedResponse<User>>("/users", { params })
  },

  async getById(id: number) {
    return api.get<User>(`/users/${id}`)
  },

  async create(data: UserFormData) {
    return api.post<User>("/users", data)
  },

  async update(id: number, data: Partial<UserFormData>) {
    return api.put<User>(`/users/${id}`, data)
  },

  async delete(id: number) {
    return api.delete(`/users/${id}`)
  },
}
