import { api } from "@/services/api"
import { API_ENDPOINTS } from "@/constants"
import type { MenuRoute, PaginatedResponse } from "@/types"
import type { MenuRouteFormData } from "@/schemas/menu-route.schema"

// O MenuRouteController devolve recursos únicos (show/store/update)
// envelopados em { data: ... }, seguindo o wrapping padrão do Laravel.
export const menuRouteService = {
  async list(params?: Record<string, string | number | boolean>) {
    return api.get<PaginatedResponse<MenuRoute>>(API_ENDPOINTS.MENU_ROUTES, {
      params,
    })
  },

  async tree() {
    const response = await api.get<{ data: MenuRoute[] }>(
      API_ENDPOINTS.MENU_ROUTES_TREE
    )
    return response.data
  },

  async create(data: MenuRouteFormData) {
    const response = await api.post<{ data: MenuRoute }>(
      API_ENDPOINTS.MENU_ROUTES,
      data
    )
    return response.data
  },

  async update(id: string, data: Partial<MenuRouteFormData>) {
    const response = await api.put<{ data: MenuRoute }>(
      API_ENDPOINTS.MENU_ROUTE(id),
      data
    )
    return response.data
  },

  async delete(id: string) {
    return api.delete(API_ENDPOINTS.MENU_ROUTE(id))
  },
}
