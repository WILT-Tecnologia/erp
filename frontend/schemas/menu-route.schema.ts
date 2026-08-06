import { z } from "zod"

export const menuRouteSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(150),
  slug: z
    .string()
    .min(1, "Slug/path é obrigatório")
    .regex(
      /^\/[a-z0-9\-/]*$/,
      "Use um path iniciando com / (letras minúsculas, números, hífen)"
    ),
  icon: z.string().optional().or(z.literal("")),
  category: z.string().min(1, "Categoria é obrigatória").max(150),
  sort_order: z.coerce.number().int().min(0),
  parent_id: z.string().optional().or(z.literal("")),
  is_active: z.boolean().default(true),
  permission_ids: z
    .array(z.string())
    .min(1, "Selecione ao menos uma permissão"),
})

export type MenuRouteFormData = z.input<typeof menuRouteSchema>
