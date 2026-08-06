import { create } from "zustand"
import type { MenuRoute, PaginationMeta } from "@/types"

interface MenuRouteState {
  menuRoutes: MenuRoute[]
  selectedMenuRoute: MenuRoute | null
  pagination: PaginationMeta | null
  isLoading: boolean

  setMenuRoutes: (menuRoutes: MenuRoute[]) => void
  setSelectedMenuRoute: (menuRoute: MenuRoute | null) => void
  setPagination: (pagination: PaginationMeta | null) => void
  setLoading: (isLoading: boolean) => void
  addMenuRoute: (menuRoute: MenuRoute) => void
  updateMenuRoute: (id: string, data: Partial<MenuRoute>) => void
  removeMenuRoute: (id: string) => void
}

export const useMenuRouteStore = create<MenuRouteState>()((set) => ({
  menuRoutes: [],
  selectedMenuRoute: null,
  pagination: null,
  isLoading: false,

  setMenuRoutes: (menuRoutes) => set({ menuRoutes }),

  setSelectedMenuRoute: (menuRoute) => set({ selectedMenuRoute: menuRoute }),

  setPagination: (pagination) => set({ pagination }),

  setLoading: (isLoading) => set({ isLoading }),

  addMenuRoute: (menuRoute) =>
    set((state) => ({ menuRoutes: [...state.menuRoutes, menuRoute] })),

  updateMenuRoute: (id, data) =>
    set((state) => ({
      menuRoutes: state.menuRoutes.map((r) =>
        r.id === id ? { ...r, ...data } : r
      ),
      selectedMenuRoute:
        state.selectedMenuRoute?.id === id
          ? { ...state.selectedMenuRoute, ...data }
          : state.selectedMenuRoute,
    })),

  removeMenuRoute: (id) =>
    set((state) => ({
      menuRoutes: state.menuRoutes.filter((r) => r.id !== id),
      selectedMenuRoute:
        state.selectedMenuRoute?.id === id ? null : state.selectedMenuRoute,
    })),
}))
