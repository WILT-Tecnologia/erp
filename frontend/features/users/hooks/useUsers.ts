"use client"

import { usePaginatedApi } from "@/hooks/usePaginatedApi"
import { userService } from "../services/user.service"
import { useUserStore } from "@/store/user.store"
import { useCallback } from "react"
import { toast } from "sonner"
import type { PaginatedResponse, User } from "@/types"

export function useUsers() {
  const { setUsers, setPagination, addUser, updateUser, removeUser } =
    useUserStore()

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
  } = usePaginatedApi<User>("/users", {
    perPage: 10,
    onSuccess: (data: PaginatedResponse<User>) => {
      setUsers(data.data)
      setPagination(data.meta)
    },
  })

  const createUser = useCallback(
    async (userData: Parameters<typeof userService.create>[0]) => {
      try {
        const response = await userService.create(userData)
        addUser(response)
        toast.success("Usuário criado com sucesso!")
        await mutate()
        return response
      } catch (error) {
        const err = error as { body?: { message?: string } }
        toast.error(
          err.body?.message ?? "Erro ao criar usuário"
        )
        throw error
      }
    },
    [addUser, mutate]
  )

  const editUser = useCallback(
    async (id: number, userData: Parameters<typeof userService.update>[1]) => {
      try {
        const response = await userService.update(id, userData)
        updateUser(id, response)
        toast.success("Usuário atualizado com sucesso!")
        await mutate()
        return response
      } catch (error) {
        const err = error as { body?: { message?: string } }
        toast.error(
          err.body?.message ?? "Erro ao atualizar usuário"
        )
        throw error
      }
    },
    [updateUser, mutate]
  )

  const deleteUser = useCallback(
    async (id: number) => {
      try {
        await userService.delete(id)
        removeUser(id)
        toast.success("Usuário removido com sucesso!")
        await mutate()
      } catch (error) {
        const err = error as { body?: { message?: string } }
        toast.error(
          err.body?.message ?? "Erro ao remover usuário"
        )
        throw error
      }
    },
    [removeUser, mutate]
  )

  return {
    users: data,
    meta,
    isLoading,
    page,
    perPage,
    search,
    setPage,
    setPerPage,
    setSearch,
    refresh: mutate,
    createUser,
    editUser,
    deleteUser,
  }
}
