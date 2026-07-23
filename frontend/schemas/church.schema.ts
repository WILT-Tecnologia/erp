import { z } from "zod"

export const churchSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255),
  code: z.string().min(1, "Código é obrigatório").max(20),
  city: z.string().min(1, "Cidade é obrigatória").max(100),
  state: z.string().min(2, "UF é obrigatória").max(2),
  pastor: z.string().min(1, "Pastor responsável é obrigatório").max(255),
  phone: z.string().max(20),
  email: z.string().email("E-mail inválido").or(z.literal("")),
  members: z.number().int().min(0, "Deve ser um número positivo"),
  congregations: z.number().int().min(0, "Deve ser um número positivo"),
  founded_at: z.string(),
  status: z.enum(["active", "inactive"]),
})

export type ChurchFormData = z.input<typeof churchSchema>
