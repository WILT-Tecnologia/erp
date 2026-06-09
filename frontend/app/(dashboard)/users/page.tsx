"use client"

import { AppLayout } from "@/components/layouts/app-layout"
import { Breadcrumb } from "@/components/layouts/breadcrumb"
import { PageTransition } from "@/components/shared/animations"
import { DataTable } from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import type { User } from "@/types"
import { useUsers } from "@/features/users/hooks/useUsers"

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "E-mail",
  },
  {
    accessorKey: "roles",
    header: "Perfis",
    cell: ({ row }) => {
      const roles = row.original.roles ?? []
      return (
        <div className="flex gap-1">
          {roles.length === 0 && (
            <Badge variant="secondary">Sem perfil</Badge>
          )}
          {roles.map((role) => (
            <Badge key={role} variant="outline">
              {role}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Criado em",
    cell: ({ row }) => {
      return new Date(row.original.created_at).toLocaleDateString("pt-BR")
    },
  },
]

export default function UsersPage() {
  const { users, isLoading, setSearch } = useUsers()

  return (
    <AppLayout>
      <PageTransition>
        <div className="space-y-6">
          <Breadcrumb items={[{ label: "Usuários" }]} />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
              <p className="mt-1 text-muted-foreground">
                Gerencie os usuários do sistema
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </div>

          <DataTable
            columns={columns}
            data={users}
            searchKey="name"
            searchPlaceholder="Buscar por nome..."
            loading={isLoading}
            onSearch={setSearch}
          />
        </div>
      </PageTransition>
    </AppLayout>
  )
}
