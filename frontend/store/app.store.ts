import { create } from "zustand"

interface AppState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  breadcrumbs: { label: string; href?: string }[]

  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setBreadcrumbs: (breadcrumbs: { label: string; href?: string }[]) => void
}

export const useAppStore = create<AppState>()((set) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  breadcrumbs: [],

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
}))
