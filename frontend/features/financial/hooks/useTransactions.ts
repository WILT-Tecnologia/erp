"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import type { BankAccount, Transaction } from "../types"
import type { TransactionFormData } from "@/schemas/transaction.schema"

const initialAccounts: BankAccount[] = [
  { id: "acc-1", name: "Conta Principal", bank: "Banco do Brasil", balance: 48320.5, type: "Corrente" },
  { id: "acc-2", name: "Conta Operacional", bank: "Bradesco", balance: 12450, type: "Corrente" },
  { id: "acc-3", name: "Caixa", bank: "", balance: 3200, type: "Caixa" },
  { id: "acc-4", name: "Poupança Missões", bank: "Caixa Econômica", balance: 24800, type: "Poupança" },
]

const initialTransactions: Transaction[] = [
  {
    id: "tx-1",
    description: "Dízimo culto domingo",
    category: "Dízimos",
    type: "receita",
    amount: 12450,
    account: "Conta Principal",
    method: "PIX",
    status: "pago",
    date: "2026-07-20",
  },
  {
    id: "tx-2",
    description: "Oferta especial - missões",
    category: "Ofertas",
    type: "receita",
    amount: 3200,
    account: "Poupança Missões",
    method: "PIX",
    status: "pago",
    date: "2026-07-19",
  },
  {
    id: "tx-3",
    description: "Conta de água",
    category: "Utilidades",
    type: "despesa",
    amount: 320,
    account: "Conta Operacional",
    method: "Boleto",
    status: "atrasado",
    date: "2026-07-15",
  },
  {
    id: "tx-4",
    description: "Material Escola Dominical",
    category: "Materiais",
    type: "despesa",
    amount: 450,
    account: "Conta Operacional",
    method: "Cartão de Débito",
    status: "pendente",
    date: "2026-07-18",
  },
  {
    id: "tx-5",
    description: "Conferência de Jovens - inscrições",
    category: "Eventos",
    type: "receita",
    amount: 5850,
    account: "Conta Principal",
    method: "PIX",
    status: "pago",
    date: "2026-07-17",
  },
  {
    id: "tx-6",
    description: "Energia elétrica",
    category: "Infraestrutura",
    type: "despesa",
    amount: 890,
    account: "Conta Operacional",
    method: "Débito automático",
    status: "pago",
    date: "2026-07-10",
  },
  {
    id: "tx-7",
    description: "Dízimo culto quarta-feira",
    category: "Dízimos",
    type: "receita",
    amount: 4780,
    account: "Conta Principal",
    method: "Dinheiro",
    status: "pago",
    date: "2026-07-09",
  },
  {
    id: "tx-8",
    description: "Reforma do salão social",
    category: "Infraestrutura",
    type: "despesa",
    amount: 4800,
    account: "Conta Principal",
    method: "Transferência",
    status: "pendente",
    date: "2026-07-05",
  },
]

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [accounts] = useState<BankAccount[]>(initialAccounts)

  const createTransaction = useCallback((data: TransactionFormData) => {
    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      ...data,
      amount: Number(data.amount),
    }
    setTransactions((prev) => [transaction, ...prev])
    toast.success("Transação registrada com sucesso!")
    return transaction
  }, [])

  const editTransaction = useCallback((id: string, data: TransactionFormData) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data, amount: Number(data.amount) } : t))
    )
    toast.success("Transação atualizada com sucesso!")
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
    toast.success("Transação removida com sucesso!")
  }, [])

  return {
    transactions,
    accounts,
    createTransaction,
    editTransaction,
    deleteTransaction,
  }
}
