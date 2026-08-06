"use client"

import { Badge } from "@/components/ui/badge"
import type { Contact } from "@/types"

interface LeadCardProps {
  contact: Contact
  onClick: () => void
}

export function LeadCard({ contact, onClick }: LeadCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border bg-card p-3.5 text-left transition-colors hover:border-primary hover:shadow-sm"
    >
      <div className="mb-2 text-sm font-semibold leading-tight">
        {contact.name}
      </div>
      <div className="mb-2 text-xs text-muted-foreground">
        {contact.assignee}
      </div>
      {contact.tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {contact.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      <div className="mt-2 flex items-center justify-between">
        {contact.value > 0 ? (
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            R$ {contact.value.toLocaleString("pt-BR")}
          </span>
        ) : (
          <span className="truncate text-xs text-muted-foreground">
            {contact.email}
          </span>
        )}
        <span className="shrink-0 pl-2 text-[11px] text-muted-foreground">
          {new Date(contact.updated_at).toLocaleDateString("pt-BR")}
        </span>
      </div>
    </button>
  )
}
