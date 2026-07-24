import { z } from "zod"

export const organizationSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255),
  legal_name: z.string().max(255).optional().or(z.literal("")),
  slug: z
    .string()
    .min(1, "Slug é obrigatório")
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífen"),
  cnpj: z
    .string()
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v === "" || v.length === 14, "CNPJ deve ter 14 dígitos")
    .optional()
    .or(z.literal("")),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  whatsapp: z.string().max(20).optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  status: z.enum(["active", "suspended", "inactive"]),
  timezone: z.string().min(1, "Fuso horário é obrigatório"),
  language: z.string().min(1, "Idioma é obrigatório"),
  plan_id: z.string().optional().or(z.literal("")),
  owner_admin_id: z.string().optional().or(z.literal("")),
})

export type OrganizationFormData = z.input<typeof organizationSchema>
