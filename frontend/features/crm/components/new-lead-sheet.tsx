"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { STAGES, type LeadStage } from "../types"

const newLeadSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  assignee: z.string().min(1, "Selecione um responsável"),
  status: z.enum(["novo", "contato", "qualificado", "proposta", "ganho", "perdido"]),
  value: z.coerce.number().min(0).default(0),
  tags: z.string().optional().or(z.literal("")),
})

export type NewLeadFormData = z.input<typeof newLeadSchema>

interface NewLeadSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    name: string
    email: string
    phone: string
    assignee: string
    status: LeadStage
    value: number
    tags: string[]
  }) => void
}

const ASSIGNEES = ["Pastor Carlos", "Diácono João", "Evangelista Ana", "Secretária Maria", "Tesoureiro Carlos"]

export function NewLeadSheet({ open, onOpenChange, onSubmit }: NewLeadSheetProps) {
  const form = useForm<NewLeadFormData>({
    resolver: zodResolver(newLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      assignee: ASSIGNEES[0],
      status: "novo",
      value: 0,
      tags: "",
    },
  })

  const handleSubmit = (data: NewLeadFormData) => {
    onSubmit({
      name: data.name,
      email: data.email ?? "",
      phone: data.phone ?? "",
      assignee: data.assignee,
      status: data.status,
      value: Number(data.value) || 0,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    })
    form.reset()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-md sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Novo Lead / Contato</SheetTitle>
          <SheetDescription>Adicione um novo contato ao pipeline.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-6 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome / Empresa *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Família Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estágio inicial</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STAGES.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assignee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ASSIGNEES.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor potencial (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0,00"
                      {...field}
                      value={field.value as number | string}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (separadas por vírgula)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Família, Jovem, Evangelização" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Criar Lead
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
