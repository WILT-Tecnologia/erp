import { z } from "zod"

export const userSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido"),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .or(z.literal("")),
  password_confirmation: z.string().or(z.literal("")),
  roles: z.array(z.string()).default([]),
}).refine(
  (data) => {
    if (data.password && data.password !== data.password_confirmation) {
      return false
    }
    return true
  },
  {
    message: "Senhas não conferem",
    path: ["password_confirmation"],
  }
)

export type UserFormData = z.input<typeof userSchema>
