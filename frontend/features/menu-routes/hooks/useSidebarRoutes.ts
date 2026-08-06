"use client"

import useSWR from "swr"
import { API_ENDPOINTS } from "@/constants"
import { menuRouteService } from "../services/menu-route.service"

export function useSidebarRoutes() {
  const { data, isLoading, error, mutate } = useSWR(
    API_ENDPOINTS.MENU_ROUTES_TREE,
    () => menuRouteService.tree(),
    { revalidateOnFocus: false }
  )

  return {
    routes: data ?? [],
    isLoading,
    error,
    refresh: mutate,
  }
}
