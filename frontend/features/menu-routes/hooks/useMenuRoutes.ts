"use client"

import { useCallback } from "react"
import { toast } from "sonner"
import { usePaginatedApi } from "@/hooks/usePaginatedApi"
import { API_ENDPOINTS } from "@/constants"
import { menuRouteService } from "../services/menu-route.service"
import { useMenuRouteStore } from "@/store/menu-route.store"
import type { MenuRoute, PaginatedResponse } from "@/types"

export function useMenuRoutes() {
  const {
    setMenuRoutes,
    setPagination,
    addMenuRoute,
    updateMenuRoute,
    removeMenuRoute,
  } = useMenuRouteStore()

  const {
    data,
    meta,
    isLoading,
    mutate,
    page,
    perPage,
    search,
    filters,
    setPage,
    setPerPage,
    setSearch,
    setFilters,
  } = usePaginatedApi<MenuRoute>(API_ENDPOINTS.MENU_ROUTES, {
    perPage: 10,
    onSuccess: (data: PaginatedResponse<MenuRoute>) => {
      setMenuRoutes(data.data)
      setPagination(data.meta)
    },
  })

  const createMenuRoute = useCallback(
    async (payload: Parameters<typeof menuRouteService.create>[0]) => {
      try {
        const response = await menuRouteService.create(payload)
        addMenuRoute(response)
        toast.success("Rota criada com sucesso!")
        await mutate()
        return response
      } catch (error) {
        const err = error as { body?: { message?: string } }
        toast.error(err.body?.message ?? "Erro ao criar rota")
        throw error
      }
    },
    [addMenuRoute, mutate]
  )

  const editMenuRoute = useCallback(
    async (
      id: string,
      payload: Parameters<typeof menuRouteService.update>[1]
    ) => {
      try {
        const response = await menuRouteService.update(id, payload)
        updateMenuRoute(id, response)
        toast.success("Rota atualizada com sucesso!")
        await mutate()
        return response
      } catch (error) {
        const err = error as { body?: { message?: string } }
        toast.error(err.body?.message ?? "Erro ao atualizar rota")
        throw error
      }
    },
    [updateMenuRoute, mutate]
  )

  const deleteMenuRoute = useCallback(
    async (id: string) => {
      try {
        await menuRouteService.delete(id)
        removeMenuRoute(id)
        toast.success("Rota removida com sucesso!")
        await mutate()
      } catch (error) {
        const err = error as {
          body?: {
            message?: string
            children?: { id: string; title: string; slug: string }[]
          }
        }
        toast.error(err.body?.message ?? "Erro ao remover rota")
        throw error
      }
    },
    [removeMenuRoute, mutate]
  )

  return {
    menuRoutes: data,
    meta,
    isLoading,
    page,
    perPage,
    search,
    filters,
    setPage,
    setPerPage,
    setSearch,
    setFilters,
    refresh: mutate,
    createMenuRoute,
    editMenuRoute,
    deleteMenuRoute,
  }
}
