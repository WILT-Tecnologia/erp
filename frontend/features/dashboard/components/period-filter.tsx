"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { DashboardPeriod } from "@/types"

const PERIOD_OPTIONS: { value: DashboardPeriod; label: string }[] = [
  { value: "week", label: "Esta semana" },
  { value: "month", label: "Este mês" },
  { value: "quarter", label: "Há 3 meses" },
  { value: "year", label: "Este ano" },
  { value: "custom", label: "Personalizado" },
]

interface PeriodFilterProps {
  period: DashboardPeriod
  range: DateRange | undefined
  onPeriodChange: (period: DashboardPeriod) => void
  onRangeChange: (range: DateRange | undefined) => void
}

export function PeriodFilter({
  period,
  range,
  onPeriodChange,
  onRangeChange,
}: PeriodFilterProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <Select
        value={period}
        onValueChange={(value) => {
          onPeriodChange(value as DashboardPeriod)
          if (value === "custom") setOpen(true)
        }}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PERIOD_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {period === "custom" && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <CalendarIcon className="size-4" />
              {range?.from && range?.to
                ? `${range.from.toLocaleDateString("pt-BR")} - ${range.to.toLocaleDateString("pt-BR")}`
                : "Selecionar período"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0">
            <Calendar
              mode="range"
              selected={range}
              onSelect={onRangeChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
