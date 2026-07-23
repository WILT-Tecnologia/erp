import { z } from "zod"

export const eventSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(255),
  church: z.string().min(1, "Igreja é obrigatória").max(255),
  category: z.enum([
    "Culto",
    "Conferência",
    "Retiro",
    "Educação",
    "Música",
    "Batismo",
    "Seminário",
  ]),
  date: z.string().min(1, "Data é obrigatória"),
  location: z.string().min(1, "Local é obrigatório").max(255),
  participants: z.number().int().min(0, "Deve ser um número positivo"),
  capacity: z.number().int().min(1, "Capacidade deve ser maior que zero"),
  status: z.enum(["scheduled", "ongoing", "completed", "cancelled"]),
})

export type EventFormData = z.input<typeof eventSchema>
