import { z } from "zod"

export const planSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255),
  slug: z
    .string()
    .min(1, "Slug é obrigatório")
    .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífen"),
  description: z.string().optional().or(z.literal("")),
  price_monthly: z.coerce.number().min(0, "Deve ser maior ou igual a 0"),
  price_yearly: z.coerce.number().min(0, "Deve ser maior ou igual a 0"),
  trial_days: z.coerce.number().int().min(0).max(365),
  max_users: z.coerce.number().int().min(1, "Deve ser maior que 0"),
  max_members: z.coerce.number().int().min(1, "Deve ser maior que 0"),
  max_storage_gb: z.coerce.number().int().min(1, "Deve ser maior que 0"),
  features: z.array(z.string()).optional(),
  is_public: z.boolean().default(true),
  sort_order: z.coerce.number().int().min(0),
  status: z.enum(["active", "inactive"]),
})

export type PlanFormData = z.input<typeof planSchema>
