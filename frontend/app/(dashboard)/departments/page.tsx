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
import { MoreHorizontal, Pencil, Trash2, GitBranch, Users, CheckCircle2 } from "lucide-react"
import type { GridColDef } from "@mui/x-data-grid"
import type { Department } from "@/features/departments/types"
import { DepartmentForm } from "@/features/departments/components/department-form"
import type { DepartmentFormData } from "@/schemas/department.schema"

const initialDepartments: Department[] = [
  { id: "1", name: "Louvor e Adoração", church: "Igreja Central", leader: "Ana Beatriz", members: 32, description: "Ministério responsável pela música e louvor nos cultos", status: "active" },
  { id: "2", name: "Evangelismo", church: "Igreja Central", leader: "Carlos Eduardo", members: 45, description: "Coordena as atividades evangelísticas e de alcance", status: "active" },
  { id: "3", name: "Escola Dominical", church: "Igreja Filial Norte", leader: "Mariana Lima", members: 28, description: "Ensino bíblico semanal para todas as faixas etárias", status: "active" },
  { id: "4", name: "Departamento Feminino", church: "Igreja Central", leader: "Patricia Souza", members: 67, description: "Ministério voltado para as mulheres da congregação", status: "active" },
  { id: "5", name: "Departamento de Jovens", church: "Igreja Filial Sul", leader: "Thiago Mendes", members: 89, description: "Ministério jovem com atividades e células semanais", status: "active" },
  { id: "6", name: "Diaconia", church: "Igreja Central", leader: "Roberto Alves", members: 18, description: "Assistência social e cuidado com os necessitados", status: "active" },
  { id: "7", name: "Infantil", church: "Igreja Filial Leste", leader: "Fernanda Costa", members: 22, description: "Ministério das crianças e berçário", status: "active" },
  { id: "8", name: "Comunicação", church: "Igreja Central", leader: "Lucas Rodrigues", members: 12, description: "Redes sociais, site e comunicação visual", status: "inactive" },
]

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(initialDepartments)
  const [drawer, setDrawer] = useState<{ open: boolean; department: Department | null }>({
    open: false,
    department: null,
  })
  const [deleting, setDeleting] = useState<Department | null>(null)
  const [isPending, setIsPending] = useState(false)

  const activeCount = departments.filter((d) => d.status === "active").length
  const totalMembers = departments.reduce((sum, d) => sum + d.members, 0)

  const handleSubmit = async (data: DepartmentFormData) => {
    setIsPending(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      if (drawer.department) {
        setDepartments((prev) =>
          prev.map((d) => (d.id === drawer.department!.id ? { ...d, ...data } : d))
        )
        toast.success("Departamento atualizado com sucesso!")
      } else {
        const newDepartment: Department = { id: crypto.randomUUID(), ...data }
        setDepartments((prev) => [newDepartment, ...prev])
        toast.success("Departamento criado com sucesso!")
      }
      setDrawer({ open: false, department: null })
    } finally {
      setIsPending(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDepartments((prev) => prev.filter((d) => d.id !== deleting.id))
    toast.success("Departamento removido com sucesso!")
    setDeleting(null)
  }

  const columns: GridColDef<Department>[] = [
    {
      field: "name",
      headerName: "Departamento",
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <div className="flex h-full items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600">
            <GitBranch className="size-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{params.row.name}</div>
            <div className="truncate text-xs text-muted-foreground">{params.row.church}</div>
          </div>
        </div>
      ),
    },
    { field: "leader", headerName: "Líder", width: 180 },
    { field: "members", headerName: "Membros", width: 110, type: "number" },
    {
      field: "description",
      headerName: "Descrição",
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <span className="truncate text-sm text-muted-foreground">{params.value}</span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      renderCell: (params) => (
        <Badge variant={params.value === "active" ? "default" : "secondary"}>
          {params.value === "active" ? "Ativo" : "Inativo"}
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
            <DropdownMenuItem onClick={() => setDrawer({ open: true, department: params.row })}>
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
          <Breadcrumb items={[{ label: "Departamentos" }]} />

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Departamentos</h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie os ministérios e departamentos das igrejas
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <CardContent className="p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <GitBranch className="size-5 text-primary" />
                </div>
                <div className="mt-3 text-2xl font-bold tracking-tight">{departments.length}</div>
                <div className="mt-1 text-sm text-muted-foreground">Total de departamentos</div>
              </CardContent>
            </Card>
            <Card className="p-5">
              <CardContent className="p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle2 className="size-5 text-primary" />
                </div>
                <div className="mt-3 text-2xl font-bold tracking-tight">{activeCount}</div>
                <div className="mt-1 text-sm text-muted-foreground">Departamentos ativos</div>
              </CardContent>
            </Card>
            <Card className="p-5">
              <CardContent className="p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-5 text-primary" />
                </div>
                <div className="mt-3 text-2xl font-bold tracking-tight">{totalMembers}</div>
                <div className="mt-1 text-sm text-muted-foreground">Membros envolvidos</div>
              </CardContent>
            </Card>
          </div>

          <DataGridWrapper<Department>
            persistKey="departments"
            rows={departments}
            columns={columns}
            getRowId={(row) => row.id}
            newLabel="Novo Departamento"
            onNew={() => setDrawer({ open: true, department: null })}
            paginationMode="client"
            emptyMessage="Nenhum departamento encontrado"
          />
        </div>
      </PageTransition>

      <Sheet
        open={drawer.open}
        onOpenChange={(open) => setDrawer((d) => ({ ...d, open }))}
      >
        <SheetContent className="w-full max-w-md overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{drawer.department ? "Editar Departamento" : "Novo Departamento"}</SheetTitle>
            <SheetDescription>
              {drawer.department
                ? "Atualize os dados do departamento."
                : "Preencha os dados para criar um novo departamento."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <DepartmentForm
              department={drawer.department}
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
              Esta ação não pode ser desfeita. O departamento <strong>{deleting?.name}</strong>{" "}
              será removido permanentemente.
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
