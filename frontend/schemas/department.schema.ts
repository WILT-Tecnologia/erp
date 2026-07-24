import { z } from "zod"

export const departmentSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255),
  church: z.string().min(1, "Igreja é obrigatória").max(255),
  leader: z.string().min(1, "Líder é obrigatório").max(255),
  members: z.number().int().min(0, "Deve ser um número positivo"),
  description: z.string().max(500),
  status: z.enum(["active", "inactive"]),
})

export type DepartmentFormData = z.input<typeof departmentSchema>
