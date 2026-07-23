"use client"

import { useState } from "react"
import { toast } from "sonner"
import { AppLayout } from "@/components/layouts/app-layout"
import { Breadcrumb } from "@/components/layouts/breadcrumb"
import { PageTransition } from "@/components/shared/animations"
import { DataGridWrapper } from "@/components/shared/DataGrid"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
import { MoreHorizontal, Pencil, Trash2, Church as ChurchIcon, Users, Building2 } from "lucide-react"
import type { GridColDef } from "@mui/x-data-grid"
import type { Church } from "@/features/churches/types"
import { ChurchForm } from "@/features/churches/components/church-form"
import type { ChurchFormData } from "@/schemas/church.schema"

const initialChurches: Church[] = [
  { id: "1", name: "Igreja Central", code: "IC-001", city: "São Paulo", state: "SP", pastor: "Rev. Marcos Ferreira", phone: "(11) 3456-7890", email: "central@igrejacentral.local", members: 1240, congregations: 4, founded_at: "1985-03-10", status: "active" },
  { id: "2", name: "Igreja Filial Norte", code: "IF-002", city: "São Paulo", state: "SP", pastor: "Rev. Paulo Lima", phone: "(11) 3567-8901", email: "norte@igrejacentral.local", members: 380, congregations: 2, founded_at: "1998-06-22", status: "active" },
  { id: "3", name: "Igreja Filial Sul", code: "IF-003", city: "São Paulo", state: "SP", pastor: "Rev. Antônio Santos", phone: "(11) 3678-9012", email: "sul@igrejacentral.local", members: 290, congregations: 1, founded_at: "2001-11-05", status: "active" },
  { id: "4", name: "Igreja Filial Leste", code: "IF-004", city: "São Paulo", state: "SP", pastor: "Rev. João Alves", phone: "(11) 3789-0123", email: "leste@igrejacentral.local", members: 420, congregations: 2, founded_at: "2003-02-14", status: "active" },
  { id: "5", name: "Congregação Campinas", code: "CC-005", city: "Campinas", state: "SP", pastor: "Ev. Ricardo Moura", phone: "(19) 3456-7890", email: "campinas@igrejacentral.local", members: 165, congregations: 0, founded_at: "2010-09-18", status: "active" },
  { id: "6", name: "Congregação Santos", code: "CS-006", city: "Santos", state: "SP", pastor: "Ev. Silvia Costa", phone: "(13) 3456-7890", email: "santos@igrejacentral.local", members: 82, congregations: 0, founded_at: "2015-04-30", status: "inactive" },
]

export default function ChurchesPage() {
  const [churches, setChurches] = useState<Church[]>(initialChurches)
  const [drawer, setDrawer] = useState<{ open: boolean; church: Church | null }>({
    open: false,
    church: null,
  })
  const [deleting, setDeleting] = useState<Church | null>(null)
  const [isPending, setIsPending] = useState(false)

  const activeCount = churches.filter((c) => c.status === "active").length
  const totalMembers = churches.reduce((sum, c) => sum + c.members, 0)
  const totalCongregations = churches.reduce((sum, c) => sum + c.congregations, 0)

  const handleSubmit = async (data: ChurchFormData) => {
    setIsPending(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      if (drawer.church) {
        setChurches((prev) =>
          prev.map((c) => (c.id === drawer.church!.id ? { ...c, ...data } : c))
        )
        toast.success("Igreja atualizada com sucesso!")
      } else {
        const newChurch: Church = { id: crypto.randomUUID(), ...data }
        setChurches((prev) => [newChurch, ...prev])
        toast.success("Igreja criada com sucesso!")
      }
      setDrawer({ open: false, church: null })
    } finally {
      setIsPending(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setChurches((prev) => prev.filter((c) => c.id !== deleting.id))
    toast.success("Igreja removida com sucesso!")
    setDeleting(null)
  }

  const columns: GridColDef<Church>[] = [
    {
      field: "name",
      headerName: "Igreja",
      flex: 1,
      minWidth: 240,
      renderCell: (params) => (
        <div className="flex h-full items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600">
            <ChurchIcon className="size-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{params.row.name}</div>
            <div className="truncate text-xs text-muted-foreground">{params.row.code}</div>
          </div>
        </div>
      ),
    },
    {
      field: "city",
      headerName: "Cidade/UF",
      width: 160,
      valueGetter: (_value, row) => `${row.city}/${row.state}`,
    },
    { field: "pastor", headerName: "Pastor responsável", width: 200 },
    { field: "members", headerName: "Membros", width: 110, type: "number" },
    { field: "congregations", headerName: "Congregações", width: 130, type: "number" },
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
            <DropdownMenuItem onClick={() => setDrawer({ open: true, church: params.row })}>
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
          <Breadcrumb items={[{ label: "Igrejas" }]} />

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Igrejas</h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie as unidades eclesiásticas da organização
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-5">
              <CardContent className="p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <ChurchIcon className="size-5 text-primary" />
                </div>
                <div className="mt-3 text-2xl font-bold tracking-tight">{churches.length}</div>
                <div className="mt-1 text-sm text-muted-foreground">Total de igrejas</div>
              </CardContent>
            </Card>
            <Card className="p-5">
              <CardContent className="p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="size-5 text-primary" />
                </div>
                <div className="mt-3 text-2xl font-bold tracking-tight">{activeCount}</div>
                <div className="mt-1 text-sm text-muted-foreground">Igrejas ativas</div>
              </CardContent>
            </Card>
            <Card className="p-5">
              <CardContent className="p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-5 text-primary" />
                </div>
                <div className="mt-3 text-2xl font-bold tracking-tight">{totalMembers.toLocaleString("pt-BR")}</div>
                <div className="mt-1 text-sm text-muted-foreground">Membros no total</div>
              </CardContent>
            </Card>
            <Card className="p-5">
              <CardContent className="p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="size-5 text-primary" />
                </div>
                <div className="mt-3 text-2xl font-bold tracking-tight">{totalCongregations}</div>
                <div className="mt-1 text-sm text-muted-foreground">Congregações vinculadas</div>
              </CardContent>
            </Card>
          </div>

          <DataGridWrapper<Church>
            persistKey="churches"
            rows={churches}
            columns={columns}
            getRowId={(row) => row.id}
            newLabel="Nova Igreja"
            onNew={() => setDrawer({ open: true, church: null })}
            paginationMode="client"
            emptyMessage="Nenhuma igreja encontrada"
          />
        </div>
      </PageTransition>

      <Sheet
        open={drawer.open}
        onOpenChange={(open) => setDrawer((d) => ({ ...d, open }))}
      >
        <SheetContent className="w-full max-w-md overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{drawer.church ? "Editar Igreja" : "Nova Igreja"}</SheetTitle>
            <SheetDescription>
              {drawer.church
                ? "Atualize os dados da igreja."
                : "Preencha os dados para cadastrar uma nova igreja."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <ChurchForm church={drawer.church} onSubmit={handleSubmit} isPending={isPending} />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A igreja <strong>{deleting?.name}</strong>{" "}
              será removida permanentemente.
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
