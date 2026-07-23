"use client"

import { AppLayout } from "@/components/layouts/app-layout"
import { Breadcrumb } from "@/components/layouts/breadcrumb"
import { PageTransition } from "@/components/shared/animations"
import { DataTable } from "@/components/shared/DataTable"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import type { Admin } from "@/types"
import { useAdmins } from "@/features/admins/hooks/useAdmins"

const columns: ColumnDef<Admin>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "E-mail",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status === "active" ? "Ativo" : "Inativo"}
        </Badge>
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

export default function AdminsPage() {
  const { admins, isLoading, setSearch } = useAdmins()

  return (
    <AppLayout>
      <PageTransition>
        <div className="space-y-6">
          <Breadcrumb items={[{ label: "Administradores" }]} />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Administradores
              </h1>
              <p className="mt-1 text-muted-foreground">
                Gerencie os administradores do sistema
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Administrador
            </Button>
          </div>

          <DataTable
            columns={columns}
            data={admins}
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
