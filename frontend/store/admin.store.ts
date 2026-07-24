import { create } from "zustand"
import type { Admin, PaginationMeta } from "@/types"

interface AdminState {
  admins: Admin[]
  selectedAdmin: Admin | null
  pagination: PaginationMeta | null
  isLoading: boolean

  setAdmins: (admins: Admin[]) => void
  setSelectedAdmin: (admin: Admin | null) => void
  setPagination: (pagination: PaginationMeta | null) => void
  setLoading: (isLoading: boolean) => void
  addAdmin: (admin: Admin) => void
  updateAdmin: (id: string, adminData: Partial<Admin>) => void
  removeAdmin: (id: string) => void
}

export const useAdminStore = create<AdminState>()((set) => ({
  admins: [],
  selectedAdmin: null,
  pagination: null,
  isLoading: false,

  setAdmins: (admins) => set({ admins }),

  setSelectedAdmin: (admin) => set({ selectedAdmin: admin }),

  setPagination: (pagination) => set({ pagination }),

  setLoading: (isLoading) => set({ isLoading }),

  addAdmin: (admin) =>
    set((state) => ({ admins: [...state.admins, admin] })),

  updateAdmin: (id, adminData) =>
    set((state) => ({
      admins: state.admins.map((a) =>
        a.id === id ? { ...a, ...adminData } : a
      ),
      selectedAdmin:
        state.selectedAdmin?.id === id
          ? { ...state.selectedAdmin, ...adminData }
          : state.selectedAdmin,
    })),

  removeAdmin: (id) =>
    set((state) => ({
      admins: state.admins.filter((a) => a.id !== id),
      selectedAdmin:
        state.selectedAdmin?.id === id ? null : state.selectedAdmin,
    })),
}))
