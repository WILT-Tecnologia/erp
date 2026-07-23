import { z } from "zod"

export const congregationSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255),
  code: z.string().min(1, "Código é obrigatório").max(20),
  church: z.string().min(1, "Igreja é obrigatória"),
  leader: z.string().min(1, "Líder é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "UF é obrigatória").max(2),
  members: z
    .string()
    .min(1, "Obrigatório")
    .regex(/^\d+$/, "Deve ser um número")
    .refine((v) => Number(v) >= 0, "Deve ser um número válido"),
  phone: z.string().min(1, "Telefone é obrigatório").max(20),
  status: z.enum(["active", "inactive"]),
})

export type CongregationFormData = z.input<typeof congregationSchema>
