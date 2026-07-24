"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Breadcrumb } from "@/components/layouts/breadcrumb"
import { PageTransition } from "@/components/shared/animations"
import { DataGridWrapper } from "@/components/shared/DataGrid"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import type { GridColDef } from "@mui/x-data-grid"
import type { Admin } from "@/types"
import { useAdmins } from "@/features/admins/hooks/useAdmins"
import { AdminForm } from "@/features/admins/components/admin-form"
import type { AdminFormData } from "@/schemas/admin.schema"

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function AdminsPage() {
  const {
    admins,
    meta,
    isLoading,
    page,
    perPage,
    search,
    setPage,
    setPerPage,
    setSearch,
    createAdmin,
    editAdmin,
    deleteAdmin,
  } = useAdmins()

  const [drawer, setDrawer] = useState<{ open: boolean; admin: Admin | null }>({
    open: false,
    admin: null,
  })
  const [deleting, setDeleting] = useState<Admin | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (data: AdminFormData) => {
    setIsPending(true)
    try {
      if (drawer.admin) {
        const { name, email, password, password_confirmation } = data
        await editAdmin(drawer.admin.id, {
          name,
          email,
          ...(password ? { password, password_confirmation } : {}),
        })
      } else {
        await createAdmin(data)
      }
      setDrawer({ open: false, admin: null })
    } finally {
      setIsPending(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    await deleteAdmin(deleting.id)
    setDeleting(null)
  }

  const columns: GridColDef<Admin>[] = [
    {
      field: "name",
      headerName: "Administrador",
      flex: 1,
      minWidth: 260,
      renderCell: (params) => (
        <div className="flex h-full items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-xs font-bold text-white">
              {initials(params.row.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{params.row.name}</div>
            <div className="truncate text-xs text-muted-foreground">{params.row.email}</div>
          </div>
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <Badge variant={params.value === "active" ? "default" : "secondary"}>
          {params.value === "active" ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
    {
      field: "last_login_at",
      headerName: "Último acesso",
      width: 180,
      valueFormatter: (value: string | null) =>
        value ? new Date(value).toLocaleString("pt-BR") : "Nunca acessou",
    },
    {
      field: "created_at",
      headerName: "Criado em",
      width: 130,
      valueFormatter: (value: string) => new Date(value).toLocaleDateString("pt-BR"),
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 80,
      sortable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setDrawer({ open: true, admin: params.row })}>
              <Pencil className="size-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleting(params.row)}
            >
              <Trash2 className="size-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <AppLayout>
      <PageTransition>
        <div className="space-y-6">
          <Breadcrumb items={[{ label: "Administradores" }]} />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Administradores</h1>
              <p className="mt-1 text-muted-foreground">
                Gerencie os administradores do sistema
              </p>
            </div>
          </div>

          <DataGridWrapper<Admin>
            persistKey="admins"
            rows={admins}
            columns={columns}
            loading={isLoading}
            getRowId={(row) => row.id}
            newLabel="Novo Administrador"
            onNew={() => setDrawer({ open: true, admin: null })}
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar por nome, e-mail..."
            paginationMode="server"
            rowCount={meta?.total ?? 0}
            paginationModel={{ page: page - 1, pageSize: perPage }}
            onPaginationModelChange={(model) => {
              setPage(model.page + 1)
              setPerPage(model.pageSize)
            }}
            emptyMessage="Nenhum administrador encontrado"
          />
        </div>
      </PageTransition>

      <Sheet
        open={drawer.open}
        onOpenChange={(open) => setDrawer((d) => ({ ...d, open }))}
      >
        <SheetContent className="w-full max-w-md sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{drawer.admin ? "Editar Administrador" : "Novo Administrador"}</SheetTitle>
            <SheetDescription>
              {drawer.admin
                ? "Atualize os dados do administrador."
                : "Preencha os dados para criar um novo administrador."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <AdminForm admin={drawer.admin} onSubmit={handleSubmit} isPending={isPending} />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O administrador{" "}
              <strong>{deleting?.name}</strong> será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}
