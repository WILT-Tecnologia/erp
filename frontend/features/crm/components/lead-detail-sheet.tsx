"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mail,
  Phone,
  CheckSquare,
  Clock,
  MessageSquare,
  Tag,
} from "lucide-react"
import { STAGES, type CRMLead, type LeadStage } from "../types"

interface LeadDetailSheetProps {
  lead: CRMLead | null
  onClose: () => void
  onChangeStage: (id: string, stage: LeadStage) => void
  onSaveNote: (id: string, note: string) => void
}

export function LeadDetailSheet({
  lead,
  onClose,
  onChangeStage,
  onSaveNote,
}: LeadDetailSheetProps) {
  const [note, setNote] = useState(lead?.notes ?? "")

  if (!lead) return null
  const stage = STAGES.find((s) => s.id === lead.status)!

  return (
    <Sheet open={!!lead} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full max-w-lg overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <div className="mb-1 flex items-center gap-2">
            <Badge style={{ backgroundColor: stage.colorVar, color: "white" }}>{stage.label}</Badge>
            {lead.value > 0 && (
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                R$ {lead.value.toLocaleString("pt-BR")}
              </span>
            )}
          </div>
          <SheetTitle>{lead.name}</SheetTitle>
          <SheetDescription>Responsável: {lead.assignee}</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="info" className="mt-4">
          <TabsList>
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="atividades">Atividades</TabsTrigger>
            <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border bg-muted/40 p-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="size-3" /> E-mail
                </div>
                <div className="truncate text-sm font-medium">{lead.email}</div>
              </div>
              <div className="rounded-lg border bg-muted/40 p-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="size-3" /> Telefone
                </div>
                <div className="text-sm font-medium">{lead.phone}</div>
              </div>
            </div>

            {lead.tags.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Tags
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {lead.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="gap-1">
                      <Tag className="size-2.5" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Atualizar estágio
              </div>
              <Select
                value={lead.status}
                onValueChange={(value) => onChangeStage(lead.id, value as LeadStage)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Anotações
              </div>
              <Textarea
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Adicione uma nota sobre este contato..."
              />
              <Button
                size="sm"
                className="mt-2"
                onClick={() => {
                  onSaveNote(lead.id, note)
                  toast.success("Nota salva")
                }}
              >
                Salvar nota
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="atividades">
            {lead.activities.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nenhuma atividade registrada ainda.
              </p>
            ) : (
              <div className="space-y-4">
                {lead.activities.map((a) => (
                  <div key={a.id} className="flex gap-3">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <MessageSquare className="size-3.5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm">{a.text}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {a.date} · {a.user}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tarefas">
            {lead.tasks.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nenhuma tarefa pendente.
              </p>
            ) : (
              <div className="space-y-2">
                {lead.tasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3"
                  >
                    <CheckSquare
                      className={`size-4 ${t.done ? "text-emerald-500" : "text-muted-foreground/40"}`}
                    />
                    <div className={`flex-1 text-sm ${t.done ? "text-muted-foreground line-through" : ""}`}>
                      {t.label}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {t.due}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
