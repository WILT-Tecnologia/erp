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
import { MoreHorizontal, Pencil, Trash2, Users2, Home } from "lucide-react"
import type { GridColDef } from "@mui/x-data-grid"
import type { Family } from "@/features/families/types"
import { initialFamilies } from "@/features/families/data"
import { FamilyForm } from "@/features/families/components/family-form"
import type { FamilyFormData } from "@/schemas/family.schema"

export default function FamiliesPage() {
  const [families, setFamilies] = useState<Family[]>(initialFamilies)
  const [drawer, setDrawer] = useState<{ open: boolean; family: Family | null }>({
    open: false,
    family: null,
  })
  const [deleting, setDeleting] = useState<Family | null>(null)
  const [isPending, setIsPending] = useState(false)

  const stats = useMemo(
    () => ({
      total: families.length,
      members: families.reduce((sum, f) => sum + f.members, 0),
    }),
    [families]
  )

  const handleSubmit = async (data: FamilyFormData) => {
    setIsPending(true)
    try {
      const payload = { ...data, members: Number(data.members) }
      if (drawer.family) {
        setFamilies((prev) =>
          prev.map((f) => (f.id === drawer.family!.id ? { ...f, ...payload } : f))
        )
        toast.success("Família atualizada com sucesso!")
      } else {
        setFamilies((prev) => [...prev, { ...payload, id: crypto.randomUUID() }])
        toast.success("Família criada com sucesso!")
      }
      setDrawer({ open: false, family: null })
    } finally {
      setIsPending(false)
    }
  }

  const handleDelete = () => {
    if (!deleting) return
    setFamilies((prev) => prev.filter((f) => f.id !== deleting.id))
    toast.success("Família removida com sucesso!")
    setDeleting(null)
  }

  const columns: GridColDef<Family>[] = [
    {
      field: "name",
      headerName: "Família",
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <div className="flex h-full items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600">
            <Home className="size-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{params.row.name}</div>
            <div className="truncate text-xs text-muted-foreground">{params.row.leader}</div>
          </div>
        </div>
      ),
    },
    { field: "address", headerName: "Endereço", flex: 1, minWidth: 220 },
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
            <DropdownMenuItem onClick={() => setDrawer({ open: true, family: params.row })}>
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
          <Breadcrumb items={[{ label: "Famílias" }]} />

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Famílias</h1>
            <p className="mt-1 text-muted-foreground">Gerencie os núcleos familiares</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <CardContent className="flex items-center gap-3 p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users2 className="size-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Famílias cadastradas</div>
                </div>
              </CardContent>
            </Card>
            <Card className="p-5">
              <CardContent className="flex items-center gap-3 p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Home className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.members}</div>
                  <div className="text-sm text-muted-foreground">Pessoas nas famílias</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DataGridWrapper<Family>
            persistKey="families"
            rows={families}
            columns={columns}
            getRowId={(row) => row.id}
            newLabel="Nova Família"
            onNew={() => setDrawer({ open: true, family: null })}
            searchPlaceholder="Buscar por nome, responsável..."
            emptyMessage="Nenhuma família encontrada"
          />
        </div>
      </PageTransition>

      <Sheet open={drawer.open} onOpenChange={(open) => setDrawer((d) => ({ ...d, open }))}>
        <SheetContent className="w-full max-w-md sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{drawer.family ? "Editar Família" : "Nova Família"}</SheetTitle>
            <SheetDescription>
              {drawer.family ? "Atualize os dados da família." : "Preencha os dados da nova família."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <FamilyForm family={drawer.family} onSubmit={handleSubmit} isPending={isPending} />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              A família <strong>{deleting?.name}</strong> será removida da lista.
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
