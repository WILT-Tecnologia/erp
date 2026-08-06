"use client"

import { useMemo, useState } from "react"
import { DynamicIcon, dynamicIconImports } from "lucide-react/dynamic"
import { Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const ICON_NAMES = Object.keys(dynamicIconImports)

export function LucideIcon({
  name,
  className,
}: {
  name: string | null | undefined
  className?: string
}) {
  if (!name || !(name in dynamicIconImports)) {
    return <Circle className={className} />
  }

  return (
    <DynamicIcon
      name={name as keyof typeof dynamicIconImports}
      className={className}
    />
  )
}

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const filteredIcons = useMemo(() => {
    if (!query) return ICON_NAMES.slice(0, 120)
    const q = query.toLowerCase()
    return ICON_NAMES.filter((name) => name.includes(q)).slice(0, 120)
  }, [query])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2"
        >
          <LucideIcon name={value} className="size-4" />
          {value || "Selecionar ícone"}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[70vh] max-w-lg flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Selecionar ícone</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Buscar ícone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="grid grid-cols-6 gap-2 overflow-y-auto pr-1">
          {filteredIcons.map((name) => (
            <button
              type="button"
              key={name}
              title={name}
              onClick={() => {
                onChange(name)
                setOpen(false)
              }}
              className={cn(
                "flex flex-col items-center gap-1 rounded-md border p-2 text-[10px] text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                value === name &&
                  "border-primary bg-accent text-accent-foreground"
              )}
            >
              <LucideIcon name={name} className="size-4" />
              <span className="w-full truncate text-center">{name}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
