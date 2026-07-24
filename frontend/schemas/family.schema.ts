import { z } from "zod"

export const familySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255),
  leader: z.string().min(1, "Responsável é obrigatório").max(255),
  members: z
    .string()
    .min(1, "Obrigatório")
    .regex(/^\d+$/, "Deve ser um número")
    .refine((v) => Number(v) >= 1, "Deve ter ao menos 1 membro"),
  church: z.string().min(1, "Igreja é obrigatória"),
  address: z.string().min(1, "Endereço é obrigatório"),
  status: z.enum(["active", "inactive"]),
})

export type FamilyFormData = z.input<typeof familySchema>
