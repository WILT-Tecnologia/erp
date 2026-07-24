"use client"

import { usePaginatedApi } from "@/hooks/usePaginatedApi"
import { adminService } from "../services/admin.service"
import { useAdminStore } from "@/store/admin.store"
import { useCallback } from "react"
import { toast } from "sonner"
import { API_ENDPOINTS } from "@/constants"
import type { PaginatedResponse, Admin } from "@/types"

export function useAdmins() {
  const { setAdmins, setPagination, addAdmin, updateAdmin, removeAdmin } =
    useAdminStore()

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
  } = usePaginatedApi<Admin>(API_ENDPOINTS.ADMINS, {
    perPage: 10,
    onSuccess: (data: PaginatedResponse<Admin>) => {
      setAdmins(data.data)
      setPagination(data.meta)
    },
  })

  const createAdmin = useCallback(
    async (adminData: Parameters<typeof adminService.create>[0]) => {
      try {
        const response = await adminService.create(adminData)
        addAdmin(response)
        toast.success("Administrador criado com sucesso!")
        await mutate()
        return response
      } catch (error) {
        const err = error as { body?: { message?: string } }
        toast.error(
          err.body?.message ?? "Erro ao criar administrador"
        )
        throw error
      }
    },
    [addAdmin, mutate]
  )

  const editAdmin = useCallback(
    async (id: string, adminData: Parameters<typeof adminService.update>[1]) => {
      try {
        const response = await adminService.update(id, adminData)
        updateAdmin(id, response)
        toast.success("Administrador atualizado com sucesso!")
        await mutate()
        return response
      } catch (error) {
        const err = error as { body?: { message?: string } }
        toast.error(
          err.body?.message ?? "Erro ao atualizar administrador"
        )
        throw error
      }
    },
    [updateAdmin, mutate]
  )

  const deleteAdmin = useCallback(
    async (id: string) => {
      try {
        await adminService.delete(id)
        removeAdmin(id)
        toast.success("Administrador removido com sucesso!")
        await mutate()
      } catch (error) {
        const err = error as { body?: { message?: string } }
        toast.error(
          err.body?.message ?? "Erro ao remover administrador"
        )
        throw error
      }
    },
    [removeAdmin, mutate]
  )

  return {
    admins: data,
    meta,
    isLoading,
    page,
    perPage,
    search,
    setPage,
    setPerPage,
    setSearch,
    refresh: mutate,
    createAdmin,
    editAdmin,
    deleteAdmin,
  }
}
