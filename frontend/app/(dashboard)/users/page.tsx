"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Breadcrumb } from "@/components/layouts/breadcrumb"
import { PageTransition } from "@/components/shared/animations"
import { DataGridWrapper } from "@/components/shared/DataGrid"
import { Card, CardContent } from "@/components/ui/card"
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
import { MoreHorizontal, Pencil, Trash2, UserCog, ShieldCheck, Wifi } from "lucide-react"
import type { GridColDef } from "@mui/x-data-grid"
import { useTenantUsers } from "@/features/tenant-users/hooks/useTenantUsers"
import { TenantUserForm } from "@/features/tenant-users/components/tenant-user-form"
import type { TenantUser } from "@/features/tenant-users/types"
import type { TenantUserFormData } from "@/schemas/tenant-user.schema"

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const statusVariant: Record<TenantUser["status"], "default" | "secondary" | "destructive"> = {
  Ativo: "default",
  Inativo: "secondary",
  Suspenso: "destructive",
}

export default function TenantUsersPage() {
  const { users, createUser, editUser, deleteUser } = useTenantUsers()

  const [drawer, setDrawer] = useState<{ open: boolean; user: TenantUser | null }>({
    open: false,
    user: null,
  })
  const [deleting, setDeleting] = useState<TenantUser | null>(null)

  const handleSubmit = (data: TenantUserFormData) => {
    if (drawer.user) {
      editUser(drawer.user.id, data)
    } else {
      createUser(data)
    }
    setDrawer({ open: false, user: null })
  }

  const handleDelete = () => {
    if (!deleting) return
    deleteUser(deleting.id)
    setDeleting(null)
  }

  const activeCount = users.filter((u) => u.status === "Ativo").length
  const inactiveCount = users.filter((u) => u.status === "Inativo").length
  const adminCount = users.filter((u) => u.role === "Administrador").length

  const columns: GridColDef<TenantUser>[] = [
    {
      field: "name",
      headerName: "Usuário",
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
      field: "role",
      headerName: "Cargo",
      width: 150,
      renderCell: (params) => <Badge variant="outline">{params.value}</Badge>,
    },
    { field: "organization", headerName: "Organização", width: 200 },
    {
      field: "last_login_at",
      headerName: "Último acesso",
      width: 180,
      valueFormatter: (value: string | null) =>
        value ? new Date(value).toLocaleString("pt-BR") : "Nunca acessou",
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Badge variant={statusVariant[params.value as TenantUser["status"]]}>
          {params.value}
        </Badge>
      ),
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
            <DropdownMenuItem onClick={() => setDrawer({ open: true, user: params.row })}>
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
          <Breadcrumb items={[{ label: "Usuários" }]} />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
              <p className="mt-1 text-muted-foreground">
                Contas com acesso às organizações do sistema
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <CardContent className="flex items-center gap-3 p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Wifi className="size-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activeCount}</div>
                  <div className="text-sm text-muted-foreground">Ativos</div>
                </div>
              </CardContent>
            </Card>
            <Card className="p-5">
              <CardContent className="flex items-center gap-3 p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <UserCog className="size-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{inactiveCount}</div>
                  <div className="text-sm text-muted-foreground">Inativos</div>
                </div>
              </CardContent>
            </Card>
            <Card className="p-5">
              <CardContent className="flex items-center gap-3 p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{adminCount}</div>
                  <div className="text-sm text-muted-foreground">Administradores</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DataGridWrapper<TenantUser>
            persistKey="tenant-users"
            rows={users}
            columns={columns}
            getRowId={(row) => row.id}
            newLabel="Novo Usuário"
            onNew={() => setDrawer({ open: true, user: null })}
            searchPlaceholder="Buscar por nome, e-mail, cargo..."
            paginationMode="client"
            emptyMessage="Nenhum usuário encontrado"
          />
        </div>
      </PageTransition>

      <Sheet open={drawer.open} onOpenChange={(open) => setDrawer((d) => ({ ...d, open }))}>
        <SheetContent className="w-full max-w-md overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{drawer.user ? "Editar Usuário" : "Novo Usuário"}</SheetTitle>
            <SheetDescription>
              {drawer.user
                ? "Atualize os dados do usuário."
                : "Preencha os dados para criar um novo usuário."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <TenantUserForm user={drawer.user} onSubmit={handleSubmit} />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O usuário <strong>{deleting?.name}</strong> será
              removido permanentemente.
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
