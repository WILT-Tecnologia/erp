"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import type { TenantUser } from "../types"
import type { TenantUserFormData } from "@/schemas/tenant-user.schema"

const initialUsers: TenantUser[] = [
  {
    id: "tu-1",
    name: "Rev. Marcos Ferreira",
    email: "marcos@igrejadapaz.org",
    phone: "(11) 99999-0001",
    role: "Administrador",
    organization: "Igreja Central Demo",
    status: "Ativo",
    last_login_at: "2026-07-22T09:00:00",
  },
  {
    id: "tu-2",
    name: "Diácono João Alves",
    email: "joao@igrejadapaz.org",
    phone: "(11) 99999-0002",
    role: "Gestor",
    organization: "Igreja Central Demo",
    status: "Ativo",
    last_login_at: "2026-07-22T08:45:00",
  },
  {
    id: "tu-3",
    name: "Evangelista Ana Lima",
    email: "ana@igrejadapaz.org",
    phone: "(21) 99999-0003",
    role: "Operador",
    organization: "Igreja Central Demo",
    status: "Ativo",
    last_login_at: "2026-07-21T14:30:00",
  },
  {
    id: "tu-4",
    name: "Secretária Maria",
    email: "maria@igrejadapaz.org",
    phone: "(11) 99999-0004",
    role: "Operador",
    organization: "Igreja Central Demo",
    status: "Ativo",
    last_login_at: "2026-07-22T07:15:00",
  },
  {
    id: "tu-5",
    name: "Pastor Paulo Santos",
    email: "paulo@igrejadapaz.org",
    phone: "(31) 99999-0005",
    role: "Pastor",
    organization: "Igreja Central Demo",
    status: "Inativo",
    last_login_at: "2026-07-10T10:00:00",
  },
  {
    id: "tu-6",
    name: "Tesoureiro Carlos",
    email: "carlos@igrejadapaz.org",
    phone: "(11) 99999-0006",
    role: "Financeiro",
    organization: "Igreja Central Demo",
    status: "Ativo",
    last_login_at: "2026-07-20T16:00:00",
  },
]

export function useTenantUsers() {
  const [users, setUsers] = useState<TenantUser[]>(initialUsers)

  const createUser = useCallback((data: TenantUserFormData) => {
    const user: TenantUser = {
      id: `tu-${Date.now()}`,
      last_login_at: null,
      ...data,
      phone: data.phone ?? "",
    }
    setUsers((prev) => [user, ...prev])
    toast.success("Usuário criado com sucesso!")
    return user
  }, [])

  const editUser = useCallback((id: string, data: TenantUserFormData) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)))
    toast.success("Usuário atualizado com sucesso!")
  }, [])

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
    toast.success("Usuário removido com sucesso!")
  }, [])

  return { users, createUser, editUser, deleteUser }
}
