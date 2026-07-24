"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { AppLayout } from "@/components/layouts/app-layout"
import { Breadcrumb } from "@/components/layouts/breadcrumb"
import { PageTransition } from "@/components/shared/animations"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Target, TrendingUp, DollarSign, Users } from "lucide-react"
import { STAGES, type CRMLead, type LeadStage } from "@/features/crm/types"
import { initialLeads } from "@/features/crm/data/leads"
import { LeadCard } from "@/features/crm/components/lead-card"
import { LeadDetailSheet } from "@/features/crm/components/lead-detail-sheet"
import { NewLeadSheet } from "@/features/crm/components/new-lead-sheet"

export default function CRMPage() {
  const [leads, setLeads] = useState<CRMLead[]>(initialLeads)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = useMemo(
    () =>
      leads.filter((l) =>
        JSON.stringify(l).toLowerCase().includes(search.toLowerCase())
      ),
    [leads, search]
  )

  const selectedLead = leads.find((l) => l.id === selectedId) ?? null

  const totalProposta = leads
    .filter((l) => l.status === "proposta")
    .reduce((sum, l) => sum + l.value, 0)

  const handleChangeStage = (id: string, stage: LeadStage) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: stage, updatedAt: new Date().toISOString() } : l
      )
    )
    toast.success("Estágio atualizado")
  }

  const handleSaveNote = (id: string, note: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notes: note } : l)))
  }

  const handleCreateLead = (data: {
    name: string
    email: string
    phone: string
    assignee: string
    status: LeadStage
    value: number
    tags: string[]
  }) => {
    const newLead: CRMLead = {
      id: crypto.randomUUID(),
      ...data,
      notes: "",
      updatedAt: new Date().toISOString(),
      activities: [],
      tasks: [],
    }
    setLeads((prev) => [newLead, ...prev])
    setShowNew(false)
    toast.success("Lead criado com sucesso!")
  }

  const kpis = [
    { label: "Total no pipeline", value: leads.length, icon: Users },
    {
      label: "Convertidos",
      value: leads.filter((l) => l.status === "ganho").length,
      icon: Target,
    },
    {
      label: "Em proposta",
      value: leads.filter((l) => l.status === "proposta").length,
      icon: TrendingUp,
    },
    {
      label: "Valor em proposta",
      value: `R$ ${totalProposta.toLocaleString("pt-BR")}`,
      icon: DollarSign,
    },
  ]

  return (
    <AppLayout>
      <PageTransition>
        <div className="space-y-6">
          <Breadcrumb items={[{ label: "Pipeline CRM" }]} />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Pipeline CRM</h1>
              <p className="mt-1 text-muted-foreground">
                {leads.length} contatos no pipeline
              </p>
            </div>
            <Button onClick={() => setShowNew(true)} className="gap-1.5">
              <Plus className="size-4" />
              Novo Lead
            </Button>
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
                    <div className="text-xs text-muted-foreground">{k.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar leads..."
              className="pl-9"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4">
            {STAGES.map((stage) => {
              const stageLeads = filtered.filter((l) => l.status === stage.id)
              return (
                <div key={stage.id} className="w-64 shrink-0">
                  <div
                    className="mb-2.5 flex items-center justify-between rounded-lg px-3.5 py-2.5"
                    style={{ backgroundColor: `color-mix(in srgb, ${stage.colorVar} 12%, transparent)` }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: stage.colorVar }}
                      />
                      <span className="text-sm font-semibold" style={{ color: stage.colorVar }}>
                        {stage.label}
                      </span>
                    </div>
                    <span
                      className="rounded-full px-1.5 py-0.5 text-xs font-bold"
                      style={{ backgroundColor: `color-mix(in srgb, ${stage.colorVar} 20%, transparent)`, color: stage.colorVar }}
                    >
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {stageLeads.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} onClick={() => setSelectedId(lead.id)} />
                    ))}
                    <button
                      onClick={() => setShowNew(true)}
                      className="flex items-center gap-2 rounded-lg border border-dashed p-2.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <Plus className="size-3.5" />
                      Adicionar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </PageTransition>

      <LeadDetailSheet
        lead={selectedLead}
        onClose={() => setSelectedId(null)}
        onChangeStage={handleChangeStage}
        onSaveNote={handleSaveNote}
      />
      <NewLeadSheet open={showNew} onOpenChange={setShowNew} onSubmit={handleCreateLead} />
    </AppLayout>
  )
}
