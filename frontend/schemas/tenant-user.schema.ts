import { z } from "zod"

export const tenantUserSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(255),
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  phone: z.string().max(20).optional().or(z.literal("")),
  role: z.enum(["Administrador", "Gestor", "Pastor", "Financeiro", "Operador"]),
  organization: z.string().min(1, "Organização é obrigatória"),
  status: z.enum(["Ativo", "Inativo", "Suspenso"]),
})

export type TenantUserFormData = z.input<typeof tenantUserSchema>
