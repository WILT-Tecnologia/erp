"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
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
import { MoreHorizontal, Pencil, Trash2, Users, UserCheck, UserPlus } from "lucide-react"
import type { GridColDef } from "@mui/x-data-grid"
import type { Member } from "@/features/members/types"
import { initialMembers } from "@/features/members/data"
import { MemberForm } from "@/features/members/components/member-form"
import type { MemberFormData } from "@/schemas/member.schema"

const statusMap: Record<Member["status"], { label: string; variant: "default" | "secondary" | "outline" }> = {
  active: { label: "Ativo", variant: "default" },
  inactive: { label: "Inativo", variant: "secondary" },
  visitor: { label: "Visitante", variant: "outline" },
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [drawer, setDrawer] = useState<{ open: boolean; member: Member | null }>({
    open: false,
    member: null,
  })
  const [deleting, setDeleting] = useState<Member | null>(null)
  const [isPending, setIsPending] = useState(false)

  const stats = useMemo(
    () => ({
      total: members.length,
      active: members.filter((m) => m.status === "active").length,
      visitors: members.filter((m) => m.status === "visitor").length,
    }),
    [members]
  )

  const handleSubmit = async (data: MemberFormData) => {
    setIsPending(true)
    try {
      if (drawer.member) {
        setMembers((prev) =>
          prev.map((m) => (m.id === drawer.member!.id ? { ...m, ...data } : m))
        )
        toast.success("Membro atualizado com sucesso!")
      } else {
        setMembers((prev) => [
          ...prev,
          { ...data, id: crypto.randomUUID(), joined_at: new Date().toISOString() },
        ])
        toast.success("Membro criado com sucesso!")
      }
      setDrawer({ open: false, member: null })
    } finally {
      setIsPending(false)
    }
  }

  const handleDelete = () => {
    if (!deleting) return
    setMembers((prev) => prev.filter((m) => m.id !== deleting.id))
    toast.success("Membro removido com sucesso!")
    setDeleting(null)
  }

  const columns: GridColDef<Member>[] = [
    {
      field: "name",
      headerName: "Membro",
      flex: 1,
      minWidth: 240,
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
    { field: "phone", headerName: "Telefone", width: 150 },
    { field: "department", headerName: "Departamento", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => {
        const s = statusMap[params.value as Member["status"]]
        return <Badge variant={s.variant}>{s.label}</Badge>
      },
    },
    {
      field: "joined_at",
      headerName: "Desde",
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
            <DropdownMenuItem onClick={() => setDrawer({ open: true, member: params.row })}>
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
          <Breadcrumb items={[{ label: "Membros" }]} />

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Membros</h1>
            <p className="mt-1 text-muted-foreground">Gerencie os membros das igrejas</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <CardContent className="flex items-center gap-3 p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total de membros</div>
                </div>
              </CardContent>
            </Card>
            <Card className="p-5">
              <CardContent className="flex items-center gap-3 p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <UserCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.active}</div>
                  <div className="text-sm text-muted-foreground">Ativos</div>
                </div>
              </CardContent>
            </Card>
            <Card className="p-5">
              <CardContent className="flex items-center gap-3 p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <UserPlus className="size-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.visitors}</div>
                  <div className="text-sm text-muted-foreground">Visitantes</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DataGridWrapper<Member>
            persistKey="members"
            rows={members}
            columns={columns}
            getRowId={(row) => row.id}
            newLabel="Novo Membro"
            onNew={() => setDrawer({ open: true, member: null })}
            searchPlaceholder="Buscar por nome, e-mail..."
            emptyMessage="Nenhum membro encontrado"
          />
        </div>
      </PageTransition>

      <Sheet open={drawer.open} onOpenChange={(open) => setDrawer((d) => ({ ...d, open }))}>
        <SheetContent className="w-full max-w-md sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{drawer.member ? "Editar Membro" : "Novo Membro"}</SheetTitle>
            <SheetDescription>
              {drawer.member ? "Atualize os dados do membro." : "Preencha os dados do novo membro."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <MemberForm member={drawer.member} onSubmit={handleSubmit} isPending={isPending} />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              O membro <strong>{deleting?.name}</strong> será removido da lista.
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
