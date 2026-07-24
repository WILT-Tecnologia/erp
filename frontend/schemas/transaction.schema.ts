import { z } from "zod"

export const transactionSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória").max(255),
  category: z.string().min(1, "Categoria é obrigatória"),
  type: z.enum(["receita", "despesa"]),
  amount: z.coerce.number().positive("Valor deve ser maior que zero"),
  account: z.string().min(1, "Conta é obrigatória"),
  method: z.string().min(1, "Forma de pagamento é obrigatória"),
  status: z.enum(["pago", "pendente", "atrasado"]),
  date: z.string().min(1, "Data é obrigatória"),
})

export type TransactionFormData = z.input<typeof transactionSchema>
