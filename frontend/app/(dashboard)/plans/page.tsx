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
import { MoreHorizontal, Pencil, Trash2, CreditCard } from "lucide-react"
import type { GridColDef } from "@mui/x-data-grid"
import type { Plan } from "@/types"
import { usePlans } from "@/features/plans/hooks/usePlans"
import { PlanForm } from "@/features/plans/components/plan-form"
import type { PlanFormData } from "@/schemas/plan.schema"

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export default function PlansPage() {
  const {
    plans,
    meta,
    isLoading,
    page,
    perPage,
    search,
    setPage,
    setPerPage,
    setSearch,
    createPlan,
    editPlan,
    deletePlan,
  } = usePlans()

  const [drawer, setDrawer] = useState<{ open: boolean; plan: Plan | null }>({
    open: false,
    plan: null,
  })
  const [deleting, setDeleting] = useState<Plan | null>(null)
  const [blockers, setBlockers] = useState<
    { id: string; name: string }[] | null
  >(null)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (data: PlanFormData) => {
    setIsPending(true)
    try {
      if (drawer.plan) {
        await editPlan(drawer.plan.id, data)
      } else {
        await createPlan(data)
      }
      setDrawer({ open: false, plan: null })
    } finally {
      setIsPending(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await deletePlan(deleting.id)
      setDeleting(null)
    } catch (error) {
      const err = error as {
        body?: { organizations?: { id: string; name: string }[] }
      }
      if (err.body?.organizations?.length) {
        setBlockers(err.body.organizations)
      } else {
        setDeleting(null)
      }
    }
  }

  const columns: GridColDef<Plan>[] = [
    {
      field: "name",
      headerName: "Plano",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <div className="flex h-full items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600">
            <CreditCard className="size-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">
              {params.row.name}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {params.row.slug}
            </div>
          </div>
        </div>
      ),
    },
    {
      field: "price_monthly",
      headerName: "Mensal",
      width: 130,
      renderCell: (params) => formatCurrency(params.value),
    },
    {
      field: "price_yearly",
      headerName: "Anual",
      width: 130,
      renderCell: (params) => formatCurrency(params.value),
    },
    { field: "max_users", headerName: "Máx. usuários", width: 130 },
    { field: "max_members", headerName: "Máx. membros", width: 130 },
    {
      field: "is_public",
      headerName: "Público",
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <Badge>Público</Badge>
        ) : (
          <Badge variant="secondary">Privado</Badge>
        ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      renderCell: (params) =>
        params.value === "active" ? (
          <Badge>Ativo</Badge>
        ) : (
          <Badge variant="secondary">Inativo</Badge>
        ),
    },
    {
      field: "actions",
      headerName: "",
      width: 80,
      sortable: false,
      filterable: false,
      hideable: false,
      disableExport: true,
      renderCell: (params) => (
        <div className="row-actions flex h-full items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setDrawer({ open: true, plan: params.row })}
              >
                <Pencil className="size-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive transition-colors hover:bg-destructive/10 focus:text-destructive"
                onClick={() => setDeleting(params.row)}
              >
                <Trash2 className="size-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  return (
    <AppLayout>
      <PageTransition>
        <div className="space-y-6">
          <Breadcrumb items={[{ label: "Planos" }]} />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Planos</h1>
              <p className="mt-1 text-muted-foreground">
                Gerencie os planos de pagamento oferecidos às organizações
              </p>
            </div>
          </div>

          <DataGridWrapper<Plan>
            persistKey="plans"
            rows={plans}
            columns={columns}
            loading={isLoading}
            getRowId={(row) => row.id}
            newLabel="Novo Plano"
            onNew={() => setDrawer({ open: true, plan: null })}
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar por nome ou slug..."
            paginationMode="server"
            rowCount={meta?.total ?? 0}
            paginationModel={{ page: page - 1, pageSize: perPage }}
            onPaginationModelChange={(model) => {
              setPage(model.page + 1)
              setPerPage(model.pageSize)
            }}
            emptyMessage="Nenhum plano cadastrado"
          />
        </div>
      </PageTransition>

      <Sheet
        open={drawer.open}
        onOpenChange={(open) => setDrawer((d) => ({ ...d, open }))}
      >
        <SheetContent className="flex w-full max-w-lg flex-col sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {drawer.plan ? "Editar Plano" : "Novo Plano"}
            </SheetTitle>
            <SheetDescription>
              {drawer.plan
                ? "Atualize os dados do plano."
                : "Preencha os dados para criar um novo plano."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 flex-1 overflow-hidden">
            <PlanForm
              plan={drawer.plan}
              onSubmit={handleSubmit}
              isPending={isPending}
            />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(null)
            setBlockers(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                {blockers ? (
                  <div className="space-y-3">
                    <p>
                      O plano <strong>{deleting?.name}</strong> está vinculado
                      às organizações abaixo e não pode ser removido enquanto
                      elas existirem:
                    </p>
                    <div className="space-y-1">
                      {blockers.map((org) => (
                        <div
                          key={org.id}
                          className="rounded-md border px-3 py-2 text-sm text-foreground"
                        >
                          {org.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <span>
                    Esta ação não pode ser desfeita. O plano{" "}
                    <strong>{deleting?.name}</strong> será removido
                    permanentemente.
                  </span>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {blockers ? "Fechar" : "Cancelar"}
            </AlertDialogCancel>
            {!blockers && (
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}
