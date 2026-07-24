"use client"

import { toast } from "sonner"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { AppLayout } from "@/components/layouts/app-layout"
import { Breadcrumb } from "@/components/layouts/breadcrumb"
import { PageTransition } from "@/components/shared/animations"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Download,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  FileText,
  ArrowUpRight,
} from "lucide-react"
import { revenueTrend, memberGrowth, membersByDepartment, periodSummary } from "@/features/reports/data"

const PIE_COLORS = ["#2563EB", "#7C3AED", "#16A34A", "#F59E0B", "#0EA5E9"]

const reports = [
  {
    icon: Users,
    title: "Relatório de Membros",
    description: "Cadastros, status e crescimento por período",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: DollarSign,
    title: "Relatório Financeiro",
    description: "Receitas, despesas, balanço e DRE",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Calendar,
    title: "Relatório de Eventos",
    description: "Participação, inscrições e check-in",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: TrendingUp,
    title: "Relatório CRM",
    description: "Leads, conversões e follow-ups",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: FileText,
    title: "Relatório de Auditoria",
    description: "Logs de acesso e alterações no sistema",
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
  {
    icon: BarChart3,
    title: "Relatório Executivo",
    description: "Resumo gerencial completo mensal",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
]

export default function ReportsPage() {
  const handleExport = (title: string, format: string) => {
    toast.success(`${title} exportado em ${format} (simulação)`)
  }

  return (
    <AppLayout>
      <PageTransition>
        <div className="space-y-6">
          <Breadcrumb items={[{ label: "Relatórios" }]} />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
              <p className="mt-1 text-muted-foreground">Análises e exportações do sistema</p>
            </div>
            <Button onClick={() => handleExport("Todos os relatórios", "PDF")}>
              <Download className="size-4" />
              Exportar tudo (PDF)
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((r) => (
              <Card key={r.title} className="p-5 transition-colors hover:border-primary">
                <CardContent className="p-0">
                  <div className="flex items-start justify-between">
                    <div className={`flex size-10 items-center justify-center rounded-lg ${r.bg} ${r.color}`}>
                      <r.icon className="size-5" />
                    </div>
                    <ArrowUpRight className="size-4 text-muted-foreground" />
                  </div>
                  <div className="mt-3.5 text-sm font-bold">{r.title}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleExport(r.title, "PDF")}
                    >
                      <Download className="size-3.5" />
                      PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleExport(r.title, "Excel")}
                    >
                      <Download className="size-3.5" />
                      Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-5">
              <CardContent className="p-0">
                <h3 className="mb-4 text-sm font-semibold">Crescimento Financeiro — 2026</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
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
                    />
                    <Bar dataKey="receita" fill="var(--success)" radius={[4, 4, 0, 0]} name="Receita" />
                    <Bar dataKey="despesa" fill="var(--destructive)" radius={[4, 4, 0, 0]} name="Despesa" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="p-5">
              <CardContent className="p-0">
                <h3 className="mb-4 text-sm font-semibold">Novos Membros vs Visitantes — 2026</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={memberGrowth}>
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
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="novos"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Novos membros"
                    />
                    <Line
                      type="monotone"
                      dataKey="visitantes"
                      stroke="var(--muted-foreground)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Visitantes"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="p-5">
              <CardContent className="p-0">
                <h3 className="mb-4 text-sm font-semibold">Membros por Departamento</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={membersByDepartment}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      dataKey="value"
                      paddingAngle={3}
                    >
                      {membersByDepartment.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [String(v), "membros"]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 flex flex-col gap-1.5">
                  {membersByDepartment.map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                        />
                        <span className="text-muted-foreground">{d.name}</span>
                      </div>
                      <span className="font-semibold">{d.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="p-5 lg:col-span-2">
              <CardContent className="p-0">
                <h3 className="mb-4 text-sm font-semibold">Resumo do Período — Julho 2026</h3>
                <div className="grid grid-cols-3 gap-3">
                  {periodSummary.map((s) => (
                    <div key={s.label} className="rounded-lg border bg-muted/40 p-3.5">
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                      <div className="mt-1.5 text-lg font-bold">{s.value}</div>
                      <div
                        className={`mt-1 text-xs font-semibold ${
                          s.positive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-destructive"
                        }`}
                      >
                        {s.change} vs mês anterior
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-primary/10 p-3.5">
                  <div>
                    <div className="text-sm font-semibold text-primary">
                      Relatório executivo pronto
                    </div>
                    <div className="mt-0.5 text-xs text-primary/80">
                      Gerado automaticamente em 22 Jul 2026
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleExport("Relatório executivo", "PDF")}>
                    <Download className="size-3.5" />
                    Baixar PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  )
}
