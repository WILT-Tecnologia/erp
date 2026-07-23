import { z } from "zod"

export const memberSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(1, "Telefone é obrigatório").max(20),
  church: z.string().min(1, "Igreja é obrigatória"),
  department: z.string().min(1, "Departamento é obrigatório"),
  status: z.enum(["active", "inactive", "visitor"]),
})

export type MemberFormData = z.input<typeof memberSchema>
