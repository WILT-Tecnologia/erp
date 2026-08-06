"use client"

import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { useDraggable, useDroppable } from "@dnd-kit/core"
import { Plus } from "lucide-react"
import { STAGES, type LeadStage } from "../types"
import type { Contact } from "@/types"
import { LeadCard } from "./lead-card"

function DraggableCard({
  contact,
  onClick,
}: {
  contact: Contact
  onClick: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: contact.id,
    })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <LeadCard contact={contact} onClick={onClick} />
    </div>
  )
}

function DroppableColumn({
  stageId,
  children,
}: {
  stageId: LeadStage
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stageId })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-1 flex-col gap-2 rounded-lg p-1 transition-colors ${
        isOver ? "bg-accent" : ""
      }`}
    >
      {children}
    </div>
  )
}

interface KanbanBoardProps {
  contacts: Contact[]
  onCardClick: (id: string) => void
  onChangeStage: (id: string, stage: LeadStage) => void
  onAddNew: () => void
}

export function KanbanBoard({
  contacts,
  onCardClick,
  onChangeStage,
  onAddNew,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const activeContact = contacts.find((c) => c.id === activeId) ?? null

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const contact = contacts.find((c) => c.id === active.id)
    const newStage = over.id as LeadStage
    if (contact && contact.status !== newStage) {
      onChangeStage(contact.id, newStage)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageContacts = contacts.filter((c) => c.status === stage.id)
          return (
            <div key={stage.id} className="w-64 shrink-0">
              <div
                className="mb-2.5 flex items-center justify-between rounded-lg px-3.5 py-2.5"
                style={{
                  backgroundColor: `color-mix(in srgb, ${stage.colorVar} 12%, transparent)`,
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: stage.colorVar }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: stage.colorVar }}
                  >
                    {stage.label}
                  </span>
                </div>
                <span
                  className="rounded-full px-1.5 py-0.5 text-xs font-bold"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${stage.colorVar} 20%, transparent)`,
                    color: stage.colorVar,
                  }}
                >
                  {stageContacts.length}
                </span>
              </div>

              <DroppableColumn stageId={stage.id}>
                {stageContacts.map((contact) => (
                  <DraggableCard
                    key={contact.id}
                    contact={contact}
                    onClick={() => onCardClick(contact.id)}
                  />
                ))}
                <button
                  onClick={onAddNew}
                  className="flex items-center gap-2 rounded-lg border border-dashed p-2.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Plus className="size-3.5" />
                  Adicionar
                </button>
              </DroppableColumn>
            </div>
          )
        })}
      </div>

      <DragOverlay>
        {activeContact ? (
          <LeadCard contact={activeContact} onClick={() => {}} />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
