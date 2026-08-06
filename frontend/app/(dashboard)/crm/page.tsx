"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { AppLayout } from "@/components/layouts/app-layout"
import { Breadcrumb } from "@/components/layouts/breadcrumb"
import { PageTransition } from "@/components/shared/animations"
import { DataGridWrapper } from "@/components/shared/DataGrid"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import {
  Plus,
  Search,
  Target,
  TrendingUp,
  DollarSign,
  Users,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"
import type { GridColDef } from "@mui/x-data-grid"
import { useApi } from "@/hooks/useApi"
import { API_ENDPOINTS } from "@/constants"
import type { Contact, Organization, PaginatedResponse } from "@/types"
import { STAGES, type LeadStage } from "@/features/crm/types"
import { useContacts } from "@/features/crm/hooks/useContacts"
import { KanbanBoard } from "@/features/crm/components/kanban-board"
import { LeadDetailSheet } from "@/features/crm/components/lead-detail-sheet"
import { NewLeadSheet } from "@/features/crm/components/new-lead-sheet"

const stageMap = Object.fromEntries(STAGES.map((s) => [s.id, s]))

export default function CRMPage() {
  const { data: organizations } = useApi<PaginatedResponse<Organization>>(
    `${API_ENDPOINTS.ORGANIZATIONS}?per_page=100`
  )

  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    string | null
  >(null)
  const [view, setView] = useState<"kanban" | "table">("kanban")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState<Contact | null>(null)

  const organizationId =
    selectedOrganizationId ?? organizations?.data[0]?.id ?? null

  const {
    contacts,
    isLoading,
    createContact,
    editContact,
    deleteContact,
    addActivity,
    addTask,
    toggleTask,
  } = useContacts(organizationId)

  const filtered = useMemo(
    () =>
      contacts.filter((c) =>
        JSON.stringify(c).toLowerCase().includes(search.toLowerCase())
      ),
    [contacts, search]
  )

  const selectedContact = contacts.find((c) => c.id === selectedId) ?? null

  const totalProposta = contacts
    .filter((c) => c.status === "proposta")
    .reduce((sum, c) => sum + c.value, 0)

  const handleChangeStage = async (id: string, stage: LeadStage) => {
    await editContact(id, { status: stage })
    toast.success("Estágio atualizado")
  }

  const handleSaveNote = async (id: string, note: string) => {
    await editContact(id, { notes: note })
  }

  const handleCreateLead = async (data: {
    organization_id: string
    name: string
    email: string
    phone: string
    assignee: string
    status: LeadStage
    value: number
    tags: string[]
  }) => {
    await createContact(data)
    setShowNew(false)
  }

  const handleDelete = async () => {
    if (!deleting) return
    await deleteContact(deleting.id)
    setDeleting(null)
  }

  const kpis = [
    { label: "Total no pipeline", value: contacts.length, icon: Users },
    {
      label: "Convertidos",
      value: contacts.filter((c) => c.status === "ganho").length,
      icon: Target,
    },
    {
      label: "Em proposta",
      value: contacts.filter((c) => c.status === "proposta").length,
      icon: TrendingUp,
    },
    {
      label: "Valor em proposta",
      value: `R$ ${totalProposta.toLocaleString("pt-BR")}`,
      icon: DollarSign,
    },
  ]

  const columns: GridColDef<Contact>[] = [
    { field: "name", headerName: "Nome", flex: 1, minWidth: 200 },
    { field: "email", headerName: "E-mail", width: 200 },
    { field: "phone", headerName: "Telefone", width: 150 },
    { field: "assignee", headerName: "Responsável", width: 160 },
    {
      field: "status",
      headerName: "Estágio",
      width: 160,
      renderCell: (params) => {
        const stage = stageMap[params.value as LeadStage]
        return (
          <Badge style={{ backgroundColor: stage.colorVar, color: "white" }}>
            {stage.label}
          </Badge>
        )
      },
    },
    {
      field: "value",
      headerName: "Valor",
      width: 130,
      renderCell: (params) =>
        params.value > 0 ? `R$ ${params.value.toLocaleString("pt-BR")}` : "—",
    },
    {
      field: "tags",
      headerName: "Tags",
      flex: 1,
      minWidth: 160,
      sortable: false,
      renderCell: (params) => (
        <div className="flex flex-wrap gap-1">
          {(params.value as string[]).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
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
              <DropdownMenuItem onClick={() => setSelectedId(params.row.id)}>
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
          <Breadcrumb items={[{ label: "Pipeline CRM" }]} />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Pipeline CRM
              </h1>
              <p className="mt-1 text-muted-foreground">
                {contacts.length} contatos no pipeline
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={organizationId ?? undefined}
                onValueChange={setSelectedOrganizationId}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Selecionar organização" />
                </SelectTrigger>
                <SelectContent>
                  {organizations?.data.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => setShowNew(true)}
                className="gap-1.5"
                disabled={!organizationId}
              >
                <Plus className="size-4" />
                Novo Lead
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((k) => (
              <Card key={k.label} className="p-4">
                <CardContent className="flex items-center gap-3 p-0">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <k.icon className="size-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">{k.value}</div>
                    <div className="text-xs text-muted-foreground">
                      {k.label}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar leads..."
                className="pl-9"
              />
            </div>
            <Tabs
              value={view}
              onValueChange={(v) => setView(v as "kanban" | "table")}
            >
              <TabsList>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
                <TabsTrigger value="table">Tabela</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {view === "kanban" ? (
            <KanbanBoard
              contacts={filtered}
              onCardClick={setSelectedId}
              onChangeStage={handleChangeStage}
              onAddNew={() => setShowNew(true)}
            />
          ) : (
            <DataGridWrapper<Contact>
              persistKey="crm-contacts"
              rows={filtered}
              columns={columns}
              loading={isLoading}
              getRowId={(row) => row.id}
              emptyMessage="Nenhum contato encontrado"
            />
          )}
        </div>
      </PageTransition>

      <LeadDetailSheet
        contact={selectedContact}
        onClose={() => setSelectedId(null)}
        onChangeStage={handleChangeStage}
        onSaveNote={handleSaveNote}
        onAddActivity={(id, text) => addActivity(id, { type: "note", text })}
        onAddTask={(id, label) => addTask(id, { label })}
        onToggleTask={(id, taskId, done) => toggleTask(id, taskId, done)}
      />
      {organizationId && (
        <NewLeadSheet
          open={showNew}
          onOpenChange={setShowNew}
          organizationId={organizationId}
          onSubmit={handleCreateLead}
        />
      )}

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O contato{" "}
              <strong>{deleting?.name}</strong> será removido permanentemente,
              junto com suas atividades e tarefas.
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
