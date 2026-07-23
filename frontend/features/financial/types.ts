export type TransactionType = "receita" | "despesa"
export type TransactionStatus = "pago" | "pendente" | "atrasado"

export interface Transaction {
  id: string
  description: string
  category: string
  type: TransactionType
  amount: number
  account: string
  method: string
  status: TransactionStatus
  date: string
}

export interface BankAccount {
  id: string
  name: string
  bank: string
  balance: number
  type: "Corrente" | "Poupança" | "Caixa"
}
