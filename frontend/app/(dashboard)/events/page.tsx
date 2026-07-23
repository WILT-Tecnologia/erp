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
import { MoreHorizontal, Pencil, Trash2, CalendarDays, Users, CheckCircle2 } from "lucide-react"
import type { GridColDef } from "@mui/x-data-grid"
import type { Event, EventStatus } from "@/features/events/types"
import { EventForm } from "@/features/events/components/event-form"
import type { EventFormData } from "@/schemas/event.schema"

const initialEvents: Event[] = [
  { id: "1", title: "Culto de Celebração", church: "Igreja Central", category: "Culto", date: "2026-08-02", location: "Templo Central", participants: 0, capacity: 500, status: "scheduled" },
  { id: "2", title: "Conferência de Jovens 2026", church: "Igreja Central", category: "Conferência", date: "2026-08-09", location: "Centro de Convenções", participants: 234, capacity: 600, status: "scheduled" },
  { id: "3", title: "Retiro Espiritual Casais", church: "Igreja Filial Norte", category: "Retiro", date: "2026-08-22", location: "Sítio São Paulo Interior", participants: 48, capacity: 60, status: "scheduled" },
  { id: "4", title: "Escola Bíblica de Férias", church: "Igreja Central", category: "Educação", date: "2026-08-03", location: "Salão Auxiliar", participants: 87, capacity: 120, status: "ongoing" },
  { id: "5", title: "Coral de Natal Ensaio Final", church: "Igreja Filial Sul", category: "Música", date: "2026-08-17", location: "Sala de Ensaios", participants: 0, capacity: 40, status: "scheduled" },
  { id: "6", title: "Batismo nas Águas", church: "Igreja Central", category: "Batismo", date: "2026-08-31", location: "Rio Cristal", participants: 22, capacity: 30, status: "scheduled" },
  { id: "7", title: "Seminário de Liderança", church: "Igreja Central", category: "Seminário", date: "2026-07-30", location: "Auditório", participants: 95, capacity: 100, status: "completed" },
  { id: "8", title: "Culto de Missões", church: "Igreja Central", category: "Culto", date: "2026-06-14", location: "Templo Central", participants: 0, capacity: 500, status: "cancelled" },
]

const statusMap: Record<EventStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  scheduled: { label: "Agendado", variant: "outline" },
  ongoing: { label: "Em andamento", variant: "default" },
  completed: { label: "Concluído", variant: "secondary" },
  cancelled: { label: "Cancelado", variant: "destructive" },
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [drawer, setDrawer] = useState<{ open: boolean; event: Event | null }>({
    open: false,
    event: null,
  })
  const [deleting, setDeleting] = useState<Event | null>(null)
  const [isPending, setIsPending] = useState(false)

  const scheduledCount = events.filter((e) => e.status === "scheduled" || e.status === "ongoing").length
  const totalParticipants = events.reduce((sum, e) => sum + e.participants, 0)
  const completedCount = events.filter((e) => e.status === "completed").length

  const handleSubmit = async (data: EventFormData) => {
    setIsPending(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      if (drawer.event) {
        setEvents((prev) =>
          prev.map((e) => (e.id === drawer.event!.id ? { ...e, ...data } : e))
        )
        toast.success("Evento atualizado com sucesso!")
      } else {
        const newEvent: Event = { id: crypto.randomUUID(), ...data }
        setEvents((prev) => [newEvent, ...prev])
        toast.success("Evento criado com sucesso!")
      }
      setDrawer({ open: false, event: null })
    } finally {
      setIsPending(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    setEvents((prev) => prev.filter((e) => e.id !== deleting.id))
    toast.success("Evento removido com sucesso!")
    setDeleting(null)
  }

  const columns: GridColDef<Event>[] = [
    {
      field: "title",
      headerName: "Evento",
      flex: 1,
      minWidth: 240,
      renderCell: (params) => (
        <div className="flex h-full items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600">
            <CalendarDays className="size-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{params.row.title}</div>
            <div className="truncate text-xs text-muted-foreground">{params.row.church}</div>
          </div>
        </div>
      ),
    },
    {
      field: "category",
      headerName: "Categoria",
      width: 130,
      renderCell: (params) => <Badge variant="outline">{params.value}</Badge>,
    },
    {
      field: "date",
      headerName: "Data",
      width: 120,
      valueFormatter: (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR"),
    },
    { field: "location", headerName: "Local", width: 180 },
    {
      field: "participants",
      headerName: "Inscritos",
      width: 130,
      valueGetter: (_value, row) => `${row.participants}/${row.capacity}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params) => {
        const s = statusMap[params.value as EventStatus]
        return <Badge variant={s.variant}>{s.label}</Badge>
      },
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
            <DropdownMenuItem onClick={() => setDrawer({ open: true, event: params.row })}>
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
          <Breadcrumb items={[{ label: "Eventos" }]} />

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie os eventos e atividades das igrejas
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <CardContent className="p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <CalendarDays className="size-5 text-primary" />
                </div>
                <div className="mt-3 text-2xl font-bold tracking-tight">{scheduledCount}</div>
                <div className="mt-1 text-sm text-muted-foreground">Agendados / em andamento</div>
              </CardContent>
            </Card>
            <Card className="p-5">
              <CardContent className="p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-5 text-primary" />
                </div>
                <div className="mt-3 text-2xl font-bold tracking-tight">{totalParticipants}</div>
                <div className="mt-1 text-sm text-muted-foreground">Inscritos no total</div>
              </CardContent>
            </Card>
            <Card className="p-5">
              <CardContent className="p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle2 className="size-5 text-primary" />
                </div>
                <div className="mt-3 text-2xl font-bold tracking-tight">{completedCount}</div>
                <div className="mt-1 text-sm text-muted-foreground">Eventos concluídos</div>
              </CardContent>
            </Card>
          </div>

          <DataGridWrapper<Event>
            persistKey="events"
            rows={events}
            columns={columns}
            getRowId={(row) => row.id}
            newLabel="Novo Evento"
            onNew={() => setDrawer({ open: true, event: null })}
            paginationMode="client"
            emptyMessage="Nenhum evento encontrado"
          />
        </div>
      </PageTransition>

      <Sheet
        open={drawer.open}
        onOpenChange={(open) => setDrawer((d) => ({ ...d, open }))}
      >
        <SheetContent className="w-full max-w-md overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{drawer.event ? "Editar Evento" : "Novo Evento"}</SheetTitle>
            <SheetDescription>
              {drawer.event
                ? "Atualize os dados do evento."
                : "Preencha os dados para criar um novo evento."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <EventForm event={drawer.event} onSubmit={handleSubmit} isPending={isPending} />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O evento <strong>{deleting?.title}</strong> será
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
