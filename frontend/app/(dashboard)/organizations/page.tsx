"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Breadcrumb } from "@/components/layouts/breadcrumb"
import { PageTransition } from "@/components/shared/animations"
import { DataGridWrapper } from "@/components/shared/DataGrid"
import { Badge } from "@/components/ui/badge"
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
import { MoreHorizontal, Pause, Play, Pencil, Trash2, Building2 } from "lucide-react"
import type { GridColDef } from "@mui/x-data-grid"
import type { Organization } from "@/types"
import { useOrganizations } from "@/features/organizations/hooks/useOrganizations"
import { OrganizationForm } from "@/features/organizations/components/organization-form"
import type { OrganizationFormData } from "@/schemas/organization.schema"

const statusMap: Record<Organization["status"], { label: string; variant: "default" | "secondary" | "destructive" }> = {
  active: { label: "Ativa", variant: "default" },
  suspended: { label: "Suspensa", variant: "destructive" },
  inactive: { label: "Inativa", variant: "secondary" },
}

export default function OrganizationsPage() {
  const {
    organizations,
    meta,
    isLoading,
    page,
    perPage,
    search,
    setPage,
    setPerPage,
    setSearch,
    createOrganization,
    editOrganization,
    deleteOrganization,
    suspendOrganization,
    activateOrganization,
  } = useOrganizations()

  const [drawer, setDrawer] = useState<{ open: boolean; organization: Organization | null }>({
    open: false,
    organization: null,
  })
  const [deleting, setDeleting] = useState<Organization | null>(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (data: OrganizationFormData) => {
    setIsPending(true)
    try {
      const payload = {
        ...data,
        plan_id: data.plan_id || undefined,
        owner_admin_id: data.owner_admin_id || undefined,
      }
      if (drawer.organization) {
        await editOrganization(drawer.organization.id, payload)
      } else {
        await createOrganization(payload)
      }
      setDrawer({ open: false, organization: null })
    } finally {
      setIsPending(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    await deleteOrganization(deleting.id)
    setDeleting(null)
  }

  const columns: GridColDef<Organization>[] = [
    {
      field: "name",
      headerName: "Organização",
      flex: 1,
      minWidth: 240,
      renderCell: (params) => (
        <div className="flex h-full items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600">
            <Building2 className="size-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{params.row.name}</div>
            <div className="truncate text-xs text-muted-foreground">{params.row.slug}</div>
          </div>
        </div>
      ),
    },
    {
      field: "plan",
      headerName: "Plano",
      width: 140,
      valueGetter: (_value, row) => row.plan?.name ?? "",
      renderCell: (params) =>
        params.row.plan ? (
          <Badge variant="outline">{params.row.plan.name}</Badge>
        ) : (
          <span className="text-xs text-muted-foreground">Sem plano</span>
        ),
    },
    {
      field: "owner_admin",
      headerName: "Responsável",
      width: 180,
      valueGetter: (_value, row) => row.owner_admin?.name ?? "",
      renderCell: (params) => (
        <span className="text-sm">{params.row.owner_admin?.name ?? "—"}</span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => {
        const s = statusMap[params.value as Organization["status"]]
        return <Badge variant={s.variant}>{s.label}</Badge>
      },
    },
    {
      field: "created_at",
      headerName: "Criada em",
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
            <DropdownMenuItem
              onClick={() => setDrawer({ open: true, organization: params.row })}
            >
              <Pencil className="size-4" />
              Editar
            </DropdownMenuItem>
            {params.row.status === "suspended" ? (
              <DropdownMenuItem onClick={() => activateOrganization(params.row.id)}>
                <Play className="size-4" />
                Reativar
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => suspendOrganization(params.row.id)}>
                <Pause className="size-4" />
                Suspender
              </DropdownMenuItem>
            )}
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
          <Breadcrumb items={[{ label: "Organizações" }]} />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Organizações</h1>
              <p className="mt-1 text-muted-foreground">
                Gerencie os tenants (organizações) do sistema
              </p>
            </div>
          </div>

          <DataGridWrapper<Organization>
            persistKey="organizations"
            rows={organizations}
            columns={columns}
            loading={isLoading}
            getRowId={(row) => row.id}
            newLabel="Nova Organização"
            onNew={() => setDrawer({ open: true, organization: null })}
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar por nome, slug, CNPJ..."
            paginationMode="server"
            rowCount={meta?.total ?? 0}
            paginationModel={{ page: page - 1, pageSize: perPage }}
            onPaginationModelChange={(model) => {
              setPage(model.page + 1)
              setPerPage(model.pageSize)
            }}
            emptyMessage="Nenhuma organização encontrada"
          />
        </div>
      </PageTransition>

      <Sheet
        open={drawer.open}
        onOpenChange={(open) => setDrawer((d) => ({ ...d, open }))}
      >
        <SheetContent className="w-full max-w-lg overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {drawer.organization ? "Editar Organização" : "Nova Organização"}
            </SheetTitle>
            <SheetDescription>
              {drawer.organization
                ? "Atualize os dados da organização."
                : "Preencha os dados para criar uma nova organização (tenant)."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <OrganizationForm
              organization={drawer.organization}
              onSubmit={handleSubmit}
              isPending={isPending}
            />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A organização{" "}
              <strong>{deleting?.name}</strong> será marcada como removida (o schema é
              mantido para auditoria).
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
