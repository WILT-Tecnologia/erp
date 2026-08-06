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
import { Input } from "@/components/ui/input"
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
  Square,
  MessageSquare,
  Tag,
  Plus,
} from "lucide-react"
import { STAGES, type LeadStage } from "../types"
import type { Contact } from "@/types"

interface LeadDetailSheetProps {
  contact: Contact | null
  onClose: () => void
  onChangeStage: (id: string, stage: LeadStage) => void
  onSaveNote: (id: string, note: string) => void
  onAddActivity: (id: string, text: string) => void
  onAddTask: (id: string, label: string) => void
  onToggleTask: (id: string, taskId: string, done: boolean) => void
}

export function LeadDetailSheet({
  contact,
  onClose,
  onChangeStage,
  onSaveNote,
  onAddActivity,
  onAddTask,
  onToggleTask,
}: LeadDetailSheetProps) {
  const [note, setNote] = useState(contact?.notes ?? "")
  const [newActivity, setNewActivity] = useState("")
  const [newTask, setNewTask] = useState("")

  if (!contact) return null
  const stage = STAGES.find((s) => s.id === contact.status)!

  return (
    <Sheet
      open={!!contact}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <SheetContent className="w-full max-w-lg overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <div className="mb-1 flex items-center gap-2">
            <Badge style={{ backgroundColor: stage.colorVar, color: "white" }}>
              {stage.label}
            </Badge>
            {contact.value > 0 && (
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                R$ {contact.value.toLocaleString("pt-BR")}
              </span>
            )}
          </div>
          <SheetTitle>{contact.name}</SheetTitle>
          <SheetDescription>
            Responsável: {contact.assignee ?? "—"}
          </SheetDescription>
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
                <div className="truncate text-sm font-medium">
                  {contact.email ?? "—"}
                </div>
              </div>
              <div className="rounded-lg border bg-muted/40 p-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="size-3" /> Telefone
                </div>
                <div className="text-sm font-medium">
                  {contact.phone ?? "—"}
                </div>
              </div>
            </div>

            {contact.tags.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Tags
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {contact.tags.map((tag) => (
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
                value={contact.status}
                onValueChange={(value) =>
                  onChangeStage(contact.id, value as LeadStage)
                }
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
                  onSaveNote(contact.id, note)
                  toast.success("Nota salva")
                }}
              >
                Salvar nota
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="atividades" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Registrar uma atividade..."
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newActivity.trim()) {
                    onAddActivity(contact.id, newActivity.trim())
                    setNewActivity("")
                  }
                }}
              />
              <Button
                size="icon"
                variant="outline"
                disabled={!newActivity.trim()}
                onClick={() => {
                  onAddActivity(contact.id, newActivity.trim())
                  setNewActivity("")
                }}
              >
                <Plus className="size-4" />
              </Button>
            </div>
            {contact.activities.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nenhuma atividade registrada ainda.
              </p>
            ) : (
              <div className="space-y-4">
                {contact.activities.map((a) => (
                  <div key={a.id} className="flex gap-3">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <MessageSquare className="size-3.5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm">{a.text}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {a.occurred_at
                          ? new Date(a.occurred_at).toLocaleString("pt-BR")
                          : "—"}
                        {a.user ? ` · ${a.user}` : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tarefas" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Nova tarefa..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTask.trim()) {
                    onAddTask(contact.id, newTask.trim())
                    setNewTask("")
                  }
                }}
              />
              <Button
                size="icon"
                variant="outline"
                disabled={!newTask.trim()}
                onClick={() => {
                  onAddTask(contact.id, newTask.trim())
                  setNewTask("")
                }}
              >
                <Plus className="size-4" />
              </Button>
            </div>
            {contact.tasks.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nenhuma tarefa pendente.
              </p>
            ) : (
              <div className="space-y-2">
                {contact.tasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onToggleTask(contact.id, t.id, !t.done)}
                    className="flex w-full items-center gap-3 rounded-lg border bg-muted/40 p-3 text-left"
                  >
                    {t.done ? (
                      <CheckSquare className="size-4 text-emerald-500" />
                    ) : (
                      <Square className="size-4 text-muted-foreground/40" />
                    )}
                    <div
                      className={`flex-1 text-sm ${t.done ? "text-muted-foreground line-through" : ""}`}
                    >
                      {t.label}
                    </div>
                    {t.due_date && (
                      <div className="text-xs text-muted-foreground">
                        {new Date(t.due_date).toLocaleDateString("pt-BR")}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
