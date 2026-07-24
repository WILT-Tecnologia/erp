"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { AppLayout } from "@/components/layouts/app-layout"
import { Breadcrumb } from "@/components/layouts/breadcrumb"
import { PageTransition } from "@/components/shared/animations"
import { DataGridWrapper } from "@/components/shared/DataGrid"
import { Card, CardContent } from "@/components/ui/card"
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
import { MoreHorizontal, Pencil, Trash2, Home, Users } from "lucide-react"
import type { GridColDef } from "@mui/x-data-grid"
import type { Congregation } from "@/features/congregations/types"
import { initialCongregations } from "@/features/congregations/data"
import { CongregationForm } from "@/features/congregations/components/congregation-form"
import type { CongregationFormData } from "@/schemas/congregation.schema"

export default function CongregationsPage() {
  const [congregations, setCongregations] = useState<Congregation[]>(initialCongregations)
  const [drawer, setDrawer] = useState<{ open: boolean; congregation: Congregation | null }>({
    open: false,
    congregation: null,
  })
  const [deleting, setDeleting] = useState<Congregation | null>(null)
  const [isPending, setIsPending] = useState(false)

  const stats = useMemo(
    () => ({
      total: congregations.length,
      members: congregations.reduce((sum, c) => sum + c.members, 0),
    }),
    [congregations]
  )

  const handleSubmit = async (data: CongregationFormData) => {
    setIsPending(true)
    try {
      const payload = { ...data, members: Number(data.members) }
      if (drawer.congregation) {
        setCongregations((prev) =>
          prev.map((c) => (c.id === drawer.congregation!.id ? { ...c, ...payload } : c))
        )
        toast.success("Congregação atualizada com sucesso!")
      } else {
        setCongregations((prev) => [...prev, { ...payload, id: crypto.randomUUID() }])
        toast.success("Congregação criada com sucesso!")
      }
      setDrawer({ open: false, congregation: null })
    } finally {
      setIsPending(false)
    }
  }

  const handleDelete = () => {
    if (!deleting) return
    setCongregations((prev) => prev.filter((c) => c.id !== deleting.id))
    toast.success("Congregação removida com sucesso!")
    setDeleting(null)
  }

  const columns: GridColDef<Congregation>[] = [
    {
      field: "name",
      headerName: "Congregação",
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <div className="flex h-full items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600">
            <Home className="size-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{params.row.name}</div>
            <div className="truncate text-xs text-muted-foreground">{params.row.code}</div>
          </div>
        </div>
      ),
    },
    { field: "leader", headerName: "Líder", width: 180 },
    {
      field: "city",
      headerName: "Cidade",
      width: 150,
      valueGetter: (_value, row) => `${row.city}/${row.state}`,
    },
    { field: "members", headerName: "Membros", width: 110, type: "number" },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Badge variant={params.value === "active" ? "default" : "secondary"}>
          {params.value === "active" ? "Ativa" : "Inativa"}
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
            <DropdownMenuItem
              onClick={() => setDrawer({ open: true, congregation: params.row })}
            >
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
          <Breadcrumb items={[{ label: "Congregações" }]} />

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Congregações</h1>
            <p className="mt-1 text-muted-foreground">
              Pontos de encontro vinculados às igrejas
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <CardContent className="flex items-center gap-3 p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Home className="size-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Congregações</div>
                </div>
              </CardContent>
            </Card>
            <Card className="p-5">
              <CardContent className="flex items-center gap-3 p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Users className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.members}</div>
                  <div className="text-sm text-muted-foreground">Membros vinculados</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DataGridWrapper<Congregation>
            persistKey="congregations"
            rows={congregations}
            columns={columns}
            getRowId={(row) => row.id}
            newLabel="Nova Congregação"
            onNew={() => setDrawer({ open: true, congregation: null })}
            searchPlaceholder="Buscar por nome, código, líder..."
            emptyMessage="Nenhuma congregação encontrada"
          />
        </div>
      </PageTransition>

      <Sheet open={drawer.open} onOpenChange={(open) => setDrawer((d) => ({ ...d, open }))}>
        <SheetContent className="w-full max-w-md sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {drawer.congregation ? "Editar Congregação" : "Nova Congregação"}
            </SheetTitle>
            <SheetDescription>
              {drawer.congregation
                ? "Atualize os dados da congregação."
                : "Preencha os dados da nova congregação."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <CongregationForm
              congregation={drawer.congregation}
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
              A congregação <strong>{deleting?.name}</strong> será removida da lista.
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
