"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useApi } from "@/hooks/useApi"
import { API_ENDPOINTS } from "@/constants"
import type { PaginatedResponse, PermissionDefinition } from "@/types"

interface MenuRoutePermissionsFieldProps {
  value: string[]
  onChange: (value: string[]) => void
}

export function MenuRoutePermissionsField({
  value,
  onChange,
}: MenuRoutePermissionsFieldProps) {
  const [open, setOpen] = useState(false)
  const { data } = useApi<PaginatedResponse<PermissionDefinition>>(
    `${API_ENDPOINTS.PERMISSION_DEFINITIONS}?per_page=100`
  )
  const permissions = data?.data ?? []

  const toggle = (id: string) => {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id]
    )
  }

  const selected = permissions.filter((p) => value.includes(p.id))

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {selected.length > 0
              ? `${selected.length} selecionada(s)`
              : "Selecionar permissões"}
            <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Buscar permissão..." />
            <CommandList>
              <CommandEmpty>Nenhuma permissão encontrada.</CommandEmpty>
              <CommandGroup>
                {permissions.map((permission) => (
                  <CommandItem
                    key={permission.id}
                    value={permission.name}
                    onSelect={() => toggle(permission.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 size-4",
                        value.includes(permission.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {permission.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selected.map((permission) => (
            <Badge key={permission.id} variant="secondary" className="gap-1">
              {permission.label}
              <button type="button" onClick={() => toggle(permission.id)}>
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
