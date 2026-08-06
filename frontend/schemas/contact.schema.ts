import { z } from "zod"

export const contactSchema = z.object({
  organization_id: z.string().min(1, "Organização é obrigatória"),
  name: z.string().min(1, "Nome é obrigatório").max(255),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  assignee: z.string().max(150).optional().or(z.literal("")),
  status: z.enum([
    "novo",
    "contato",
    "qualificado",
    "proposta",
    "ganho",
    "perdido",
  ]),
  value: z.coerce.number().min(0).default(0),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional().or(z.literal("")),
})

export type ContactFormData = z.input<typeof contactSchema>
