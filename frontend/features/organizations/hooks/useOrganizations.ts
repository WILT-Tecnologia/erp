"use client"

import { useCallback } from "react"
import { toast } from "sonner"
import { usePaginatedApi } from "@/hooks/usePaginatedApi"
import { API_ENDPOINTS } from "@/constants"
import { organizationService } from "../services/organization.service"
import { useOrganizationStore } from "@/store/organization.store"
import type { Organization, PaginatedResponse } from "@/types"

export function useOrganizations() {
  const {
    setOrganizations,
    setPagination,
    addOrganization,
    updateOrganization,
    removeOrganization,
  } = useOrganizationStore()

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
  } = usePaginatedApi<Organization>(API_ENDPOINTS.ORGANIZATIONS, {
    perPage: 10,
    onSuccess: (data: PaginatedResponse<Organization>) => {
      setOrganizations(data.data)
      setPagination(data.meta)
    },
  })

  const createOrganization = useCallback(
    async (payload: Parameters<typeof organizationService.create>[0]) => {
      try {
        const response = await organizationService.create(payload)
        addOrganization(response)
        toast.success("Organização criada com sucesso!")
        await mutate()
        return response
      } catch (error) {
        const err = error as { body?: { message?: string } }
        toast.error(err.body?.message ?? "Erro ao criar organização")
        throw error
      }
    },
    [addOrganization, mutate]
  )

  const editOrganization = useCallback(
    async (id: string, payload: Parameters<typeof organizationService.update>[1]) => {
      try {
        const response = await organizationService.update(id, payload)
        updateOrganization(id, response)
        toast.success("Organização atualizada com sucesso!")
        await mutate()
        return response
      } catch (error) {
        const err = error as { body?: { message?: string } }
        toast.error(err.body?.message ?? "Erro ao atualizar organização")
        throw error
      }
    },
    [updateOrganization, mutate]
  )

  const deleteOrganization = useCallback(
    async (id: string) => {
      try {
        await organizationService.delete(id)
        removeOrganization(id)
        toast.success("Organização removida com sucesso!")
        await mutate()
      } catch (error) {
        const err = error as { body?: { message?: string } }
        toast.error(err.body?.message ?? "Erro ao remover organização")
        throw error
      }
    },
    [removeOrganization, mutate]
  )

  const suspendOrganization = useCallback(
    async (id: string) => {
      try {
        const response = await organizationService.suspend(id)
        updateOrganization(id, response)
        toast.success("Organização suspensa")
        await mutate()
      } catch (error) {
        const err = error as { body?: { message?: string } }
        toast.error(err.body?.message ?? "Erro ao suspender organização")
        throw error
      }
    },
    [updateOrganization, mutate]
  )

  const activateOrganization = useCallback(
    async (id: string) => {
      try {
        const response = await organizationService.activate(id)
        updateOrganization(id, response)
        toast.success("Organização reativada")
        await mutate()
      } catch (error) {
        const err = error as { body?: { message?: string } }
        toast.error(err.body?.message ?? "Erro ao reativar organização")
        throw error
      }
    },
    [updateOrganization, mutate]
  )

  return {
    organizations: data,
    meta,
    isLoading,
    page,
    perPage,
    search,
    setPage,
    setPerPage,
    setSearch,
    refresh: mutate,
    createOrganization,
    editOrganization,
    deleteOrganization,
    suspendOrganization,
    activateOrganization,
  }
}
