"use client"

import { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { AppLayout } from "@/components/layouts/app-layout"
import { Breadcrumb } from "@/components/layouts/breadcrumb"
import { PageTransition } from "@/components/shared/animations"
import { DataGridWrapper } from "@/components/shared/DataGrid"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  PiggyBank,
} from "lucide-react"
import type { GridColDef } from "@mui/x-data-grid"
import { useTransactions } from "@/features/financial/hooks/useTransactions"
import { TransactionForm } from "@/features/financial/components/transaction-form"
import type { Transaction } from "@/features/financial/types"
import type { TransactionFormData } from "@/schemas/transaction.schema"

const statusMap: Record<Transaction["status"], { label: string; variant: "default" | "secondary" | "destructive" }> = {
  pago: { label: "Pago", variant: "default" },
  pendente: { label: "Pendente", variant: "secondary" },
  atrasado: { label: "Atrasado", variant: "destructive" },
}

const monthlyTrend = [
  { month: "Fev", receita: 42000, despesa: 28000 },
  { month: "Mar", receita: 45000, despesa: 30000 },
  { month: "Abr", receita: 41000, despesa: 32000 },
  { month: "Mai", receita: 50000, despesa: 31000 },
  { month: "Jun", receita: 53000, despesa: 33000 },
  { month: "Jul", receita: 58430, despesa: 35200 },
]

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export default function FinancialPage() {
  const { transactions, accounts, createTransaction, editTransaction, deleteTransaction } =
    useTransactions()

  const [drawer, setDrawer] = useState<{ open: boolean; transaction: Transaction | null }>({
    open: false,
    transaction: null,
  })
  const [deleting, setDeleting] = useState<Transaction | null>(null)

  const totalReceitas = transactions
    .filter((t) => t.type === "receita" && t.status === "pago")
    .reduce((s, t) => s + t.amount, 0)
  const totalDespesas = transactions
    .filter((t) => t.type === "despesa" && t.status === "pago")
    .reduce((s, t) => s + t.amount, 0)
  const saldo = totalReceitas - totalDespesas
  const pendente = transactions
    .filter((t) => t.status === "pendente")
    .reduce((s, t) => s + t.amount, 0)

  const handleSubmit = (data: TransactionFormData) => {
    if (drawer.transaction) {
      editTransaction(drawer.transaction.id, data)
    } else {
      createTransaction(data)
    }
    setDrawer({ open: false, transaction: null })
  }

  const handleDelete = () => {
    if (!deleting) return
    deleteTransaction(deleting.id)
    setDeleting(null)
  }

  const columns: GridColDef<Transaction>[] = [
    {
      field: "description",
      headerName: "Descrição",
      flex: 1,
      minWidth: 240,
      renderCell: (params) => (
        <div className="flex h-full items-center gap-3">
          <div
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
              params.row.type === "receita"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {params.row.type === "receita" ? (
              <ArrowUpRight className="size-4" />
            ) : (
              <ArrowDownRight className="size-4" />
            )}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{params.row.description}</div>
            <div className="truncate text-xs text-muted-foreground">{params.row.category}</div>
          </div>
        </div>
      ),
    },
    { field: "account", headerName: "Conta", width: 160 },
    {
      field: "amount",
      headerName: "Valor",
      width: 150,
      renderCell: (params) => (
        <span
          className={`text-sm font-semibold ${
            params.row.type === "receita"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-destructive"
          }`}
        >
          {params.row.type === "receita" ? "+ " : "- "}
          {formatCurrency(params.row.amount)}
        </span>
      ),
    },
    {
      field: "date",
      headerName: "Data",
      width: 130,
      valueFormatter: (value: string) => new Date(value).toLocaleDateString("pt-BR"),
    },
    { field: "method", headerName: "Forma", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const s = statusMap[params.value as Transaction["status"]]
        return <Badge variant={s.variant}>{s.label}</Badge>
      },
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 80,
      sortable: false,
      filterable: false,
      disableExport: true,
      renderCell: (params) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setDrawer({ open: true, transaction: params.row })}
            >
              <Pencil className="size-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleting(params.row)}
            >
              <Trash2 className="size-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <AppLayout>
      <PageTransition>
        <div className="space-y-6">
          <Breadcrumb items={[{ label: "Financeiro" }]} />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
              <p className="mt-1 text-muted-foreground">
                Receitas, despesas e contas da organização
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-5">
              <CardContent className="p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="size-5" />
                </div>
                <div className="mt-3 text-2xl font-bold">{formatCurrency(totalReceitas)}</div>
                <div className="mt-1 text-sm text-muted-foreground">Receitas do mês</div>
              </CardContent>
            </Card>
            <Card className="p-5">
              <CardContent className="p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <TrendingDown className="size-5" />
                </div>
                <div className="mt-3 text-2xl font-bold">{formatCurrency(totalDespesas)}</div>
                <div className="mt-1 text-sm text-muted-foreground">Despesas do mês</div>
              </CardContent>
            </Card>
            <Card className="p-5">
              <CardContent className="p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <DollarSign className="size-5" />
                </div>
                <div className="mt-3 text-2xl font-bold">{formatCurrency(saldo)}</div>
                <div className="mt-1 text-sm text-muted-foreground">Saldo</div>
              </CardContent>
            </Card>
            <Card className="p-5">
              <CardContent className="p-0">
                <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Wallet className="size-5" />
                </div>
                <div className="mt-3 text-2xl font-bold">{formatCurrency(pendente)}</div>
                <div className="mt-1 text-sm text-muted-foreground">A receber / pagar</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="transactions">Transações</TabsTrigger>
              <TabsTrigger value="accounts">Contas</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="p-5">
                <CardContent className="p-0">
                  <h3 className="mb-4 text-sm font-semibold">Receitas vs Despesas — 2026</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={monthlyTrend}>
                      <defs>
                        <linearGradient id="finReceita" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--success)" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="var(--success)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="finDespesa" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--destructive)" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="var(--destructive)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                        formatter={(v) => formatCurrency(Number(v))}
                      />
                      <Area
                        type="monotone"
                        dataKey="receita"
                        stroke="var(--success)"
                        strokeWidth={2}
                        fill="url(#finReceita)"
                        name="Receita"
                      />
                      <Area
                        type="monotone"
                        dataKey="despesa"
                        stroke="var(--destructive)"
                        strokeWidth={2}
                        fill="url(#finDespesa)"
                        name="Despesa"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid gap-4 lg:grid-cols-3">
                <Card className="p-5 lg:col-span-2">
                  <CardContent className="p-0">
                    <h3 className="mb-3 text-sm font-semibold">Últimas transações</h3>
                    <div className="flex flex-col">
                      {transactions.slice(0, 6).map((t, i) => (
                        <div
                          key={t.id}
                          className={`flex items-center justify-between py-2.5 ${
                            i < 5 ? "border-b" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex size-8 items-center justify-center rounded-lg ${
                                t.type === "receita"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : "bg-destructive/10 text-destructive"
                              }`}
                            >
                              {t.type === "receita" ? (
                                <ArrowUpRight className="size-4" />
                              ) : (
                                <ArrowDownRight className="size-4" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{t.description}</div>
                              <div className="text-xs text-muted-foreground">
                                {t.category} · {new Date(t.date).toLocaleDateString("pt-BR")}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-sm font-semibold ${
                                t.type === "receita"
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-destructive"
                              }`}
                            >
                              {t.type === "receita" ? "+ " : "- "}
                              {formatCurrency(t.amount)}
                            </div>
                            <Badge variant={statusMap[t.status].variant} className="mt-1">
                              {statusMap[t.status].label}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-5">
                  <CardContent className="p-0">
                    <h3 className="mb-3 text-sm font-semibold">Contas bancárias</h3>
                    <div className="flex flex-col gap-2">
                      {accounts.map((a) => (
                        <div key={a.id} className="rounded-lg border bg-muted/40 p-3">
                          <div className="flex items-center gap-2">
                            {a.type === "Caixa" ? (
                              <Wallet className="size-3.5 text-muted-foreground" />
                            ) : a.type === "Poupança" ? (
                              <PiggyBank className="size-3.5 text-muted-foreground" />
                            ) : (
                              <CreditCard className="size-3.5 text-muted-foreground" />
                            )}
                            <span className="text-sm font-medium">{a.name}</span>
                          </div>
                          <div className="mt-1.5 text-lg font-bold">
                            {formatCurrency(a.balance)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 rounded-lg bg-primary/10 p-3">
                      <div className="text-xs text-primary">Total consolidado</div>
                      <div className="text-lg font-bold text-primary">
                        {formatCurrency(accounts.reduce((s, a) => s + a.balance, 0))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <DataGridWrapper<Transaction>
                persistKey="financial-transactions"
                rows={transactions}
                columns={columns}
                getRowId={(row) => row.id}
                newLabel="Nova Transação"
                onNew={() => setDrawer({ open: true, transaction: null })}
                searchPlaceholder="Buscar por descrição, categoria..."
                paginationMode="client"
                emptyMessage="Nenhuma transação encontrada"
              />
            </TabsContent>

            <TabsContent value="accounts">
              <div className="grid gap-4 sm:grid-cols-2">
                {accounts.map((a) => (
                  <Card key={a.id} className="p-5">
                    <CardContent className="p-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            {a.type === "Caixa" ? (
                              <Wallet className="size-5" />
                            ) : a.type === "Poupança" ? (
                              <PiggyBank className="size-5" />
                            ) : (
                              <CreditCard className="size-5" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-bold">{a.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {a.bank || a.type}
                            </div>
                          </div>
                        </div>
                        <Badge>Ativa</Badge>
                      </div>
                      <div className="mt-4 text-2xl font-extrabold tracking-tight">
                        {formatCurrency(a.balance)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>

      <Sheet open={drawer.open} onOpenChange={(open) => setDrawer((d) => ({ ...d, open }))}>
        <SheetContent className="w-full max-w-md overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{drawer.transaction ? "Editar Transação" : "Nova Transação"}</SheetTitle>
            <SheetDescription>
              {drawer.transaction
                ? "Atualize os dados da transação."
                : "Registre uma nova receita ou despesa."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <TransactionForm transaction={drawer.transaction} onSubmit={handleSubmit} />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A transação{" "}
              <strong>{deleting?.description}</strong> será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}
