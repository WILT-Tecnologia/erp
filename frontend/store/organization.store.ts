import { create } from "zustand"
import type { Organization, PaginationMeta } from "@/types"

interface OrganizationState {
  organizations: Organization[]
  selectedOrganization: Organization | null
  pagination: PaginationMeta | null
  isLoading: boolean

  setOrganizations: (organizations: Organization[]) => void
  setSelectedOrganization: (organization: Organization | null) => void
  setPagination: (pagination: PaginationMeta | null) => void
  setLoading: (isLoading: boolean) => void
  addOrganization: (organization: Organization) => void
  updateOrganization: (id: string, data: Partial<Organization>) => void
  removeOrganization: (id: string) => void
}

export const useOrganizationStore = create<OrganizationState>()((set) => ({
  organizations: [],
  selectedOrganization: null,
  pagination: null,
  isLoading: false,

  setOrganizations: (organizations) => set({ organizations }),

  setSelectedOrganization: (organization) => set({ selectedOrganization: organization }),

  setPagination: (pagination) => set({ pagination }),

  setLoading: (isLoading) => set({ isLoading }),

  addOrganization: (organization) =>
    set((state) => ({ organizations: [...state.organizations, organization] })),

  updateOrganization: (id, data) =>
    set((state) => ({
      organizations: state.organizations.map((o) => (o.id === id ? { ...o, ...data } : o)),
      selectedOrganization:
        state.selectedOrganization?.id === id
          ? { ...state.selectedOrganization, ...data }
          : state.selectedOrganization,
    })),

  removeOrganization: (id) =>
    set((state) => ({
      organizations: state.organizations.filter((o) => o.id !== id),
      selectedOrganization:
        state.selectedOrganization?.id === id ? null : state.selectedOrganization,
    })),
}))
