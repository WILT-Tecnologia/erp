import { create } from "zustand"
import type { Plan, PaginationMeta } from "@/types"

interface PlanState {
  plans: Plan[]
  selectedPlan: Plan | null
  pagination: PaginationMeta | null
  isLoading: boolean

  setPlans: (plans: Plan[]) => void
  setSelectedPlan: (plan: Plan | null) => void
  setPagination: (pagination: PaginationMeta | null) => void
  setLoading: (isLoading: boolean) => void
  addPlan: (plan: Plan) => void
  updatePlan: (id: string, data: Partial<Plan>) => void
  removePlan: (id: string) => void
}

export const usePlanStore = create<PlanState>()((set) => ({
  plans: [],
  selectedPlan: null,
  pagination: null,
  isLoading: false,

  setPlans: (plans) => set({ plans }),

  setSelectedPlan: (plan) => set({ selectedPlan: plan }),

  setPagination: (pagination) => set({ pagination }),

  setLoading: (isLoading) => set({ isLoading }),

  addPlan: (plan) => set((state) => ({ plans: [...state.plans, plan] })),

  updatePlan: (id, data) =>
    set((state) => ({
      plans: state.plans.map((p) => (p.id === id ? { ...p, ...data } : p)),
      selectedPlan:
        state.selectedPlan?.id === id
          ? { ...state.selectedPlan, ...data }
          : state.selectedPlan,
    })),

  removePlan: (id) =>
    set((state) => ({
      plans: state.plans.filter((p) => p.id !== id),
      selectedPlan: state.selectedPlan?.id === id ? null : state.selectedPlan,
    })),
}))
