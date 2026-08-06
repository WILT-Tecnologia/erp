"use client"

import { useCallback } from "react"
import { toast } from "sonner"
import { usePaginatedApi } from "@/hooks/usePaginatedApi"
import { API_ENDPOINTS } from "@/constants"
import { planService } from "../services/plan.service"
import { usePlanStore } from "@/store/plan.store"
import type { Plan, PaginatedResponse } from "@/types"

export function usePlans() {
  const { setPlans, setPagination, addPlan, updatePlan, removePlan } =
    usePlanStore()

  const {
    data,
    meta,
    isLoading,
    mutate,
    page,
    perPage,
    search,
    setPage,
    setPerPage,
    setSearch,
  } = usePaginatedApi<Plan>(API_ENDPOINTS.PLANS, {
    perPage: 10,
    onSuccess: (data: PaginatedResponse<Plan>) => {
      setPlans(data.data)
      setPagination(data.meta)
    },
  })

  const createPlan = useCallback(
    async (payload: Parameters<typeof planService.create>[0]) => {
      try {
        const response = await planService.create(payload)
        addPlan(response)
        toast.success("Plano criado com sucesso!")
        await mutate()
        return response
      } catch (error) {
        const err = error as { body?: { message?: string } }
        toast.error(err.body?.message ?? "Erro ao criar plano")
        throw error
      }
    },
    [addPlan, mutate]
  )

  const editPlan = useCallback(
    async (id: string, payload: Parameters<typeof planService.update>[1]) => {
      try {
        const response = await planService.update(id, payload)
        updatePlan(id, response)
        toast.success("Plano atualizado com sucesso!")
        await mutate()
        return response
      } catch (error) {
        const err = error as { body?: { message?: string } }
        toast.error(err.body?.message ?? "Erro ao atualizar plano")
        throw error
      }
    },
    [updatePlan, mutate]
  )

  const deletePlan = useCallback(
    async (id: string) => {
      try {
        await planService.delete(id)
        removePlan(id)
        toast.success("Plano removido com sucesso!")
        await mutate()
      } catch (error) {
        const err = error as {
          body?: {
            message?: string
            organizations?: { id: string; name: string }[]
          }
        }
        toast.error(err.body?.message ?? "Erro ao remover plano")
        throw error
      }
    },
    [removePlan, mutate]
  )

  return {
    plans: data,
    meta,
    isLoading,
    page,
    perPage,
    search,
    setPage,
    setPerPage,
    setSearch,
    refresh: mutate,
    createPlan,
    editPlan,
    deletePlan,
  }
}
