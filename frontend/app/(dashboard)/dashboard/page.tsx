"use client"

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
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageTransition } from "@/components/shared/animations"
import {
  Users,
  Building2,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Building,
  AlertCircle,
} from "lucide-react"
import { useApi } from "@/hooks/useApi"
import { API_ENDPOINTS } from "@/constants"
import type { Admin, Organization, PaginatedResponse, Plan } from "@/types"

const growthData = [
  { month: "Fev", organizacoes: 2 },
  { month: "Mar", organizacoes: 3 },
  { month: "Abr", organizacoes: 3 },
  { month: "Mai", organizacoes: 5 },
  { month: "Jun", organizacoes: 6 },
  { month: "Jul", organizacoes: 8 },
]

const activities = [
  {
    id: 1,
    text: "Novo administrador cadastrado no sistema",
    time: "5 min",
    icon: UserPlus,
    color: "var(--info)",
  },
  {
    id: 2,
    text: "Organização \"Igreja Central Demo\" atualizada",
    time: "1h",
    icon: Building,
    color: "var(--primary)",
  },
  {
    id: 3,
    text: "Plano \"Pro\" atingiu 80% do limite de uso",
    time: "3h",
    icon: AlertCircle,
    color: "var(--warning)",
  },
]

function KpiCard({
  label,
  value,
  icon: Icon,
  trend,
  positive = true,
  sub,
}: {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  trend?: string
  positive?: boolean
  sub?: string
}) {
  return (
    <Card className="p-5">
      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="size-5 text-primary" />
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 text-xs font-semibold ${
                positive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
              }`}
            >
              {positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {trend}
            </div>
          )}
        </div>
        <div className="mt-3 text-2xl font-bold tracking-tight">{value}</div>
        <div className="mt-1 text-sm text-muted-foreground">{label}</div>
        {sub && <div className="mt-1 text-xs text-muted-foreground/70">{sub}</div>}
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { data: admins } = useApi<PaginatedResponse<Admin>>(`${API_ENDPOINTS.ADMINS}?per_page=1`)
  const { data: organizations } = useApi<PaginatedResponse<Organization>>(
    `${API_ENDPOINTS.ORGANIZATIONS}?per_page=5`
  )
  const { data: activeOrganizations } = useApi<PaginatedResponse<Organization>>(
    `${API_ENDPOINTS.ORGANIZATIONS}?per_page=1&status=active`
  )
  const { data: plans } = useApi<PaginatedResponse<Plan>>(`${API_ENDPOINTS.PLANS}?per_page=1`)

  return (
    <AppLayout>
      <PageTransition>
        <div className="space-y-6">
          <Breadcrumb items={[{ label: "Dashboard" }]} />

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Visão geral do sistema</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Administradores"
              value={admins?.meta.total ?? "—"}
              icon={ShieldCheck}
              sub="Contas com acesso central"
            />
            <KpiCard
              label="Organizações"
              value={organizations?.meta.total ?? "—"}
              icon={Building2}
              sub="Tenants cadastrados"
            />
            <KpiCard
              label="Organizações ativas"
              value={activeOrganizations?.meta.total ?? "—"}
              icon={Users}
              trend={
                organizations?.meta.total
                  ? `${Math.round(
                      ((activeOrganizations?.meta.total ?? 0) / organizations.meta.total) * 100
                    )}%`
                  : undefined
              }
              sub="Do total de organizações"
            />
            <KpiCard
              label="Planos"
              value={plans?.meta.total ?? "—"}
              icon={CreditCard}
              sub="Planos configurados"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="p-5 lg:col-span-2">
              <CardContent className="p-0">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">Crescimento de organizações</h3>
                    <p className="text-xs text-muted-foreground">Últimos 6 meses (ilustrativo)</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="orgGrowth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
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
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="organizacoes"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      fill="url(#orgGrowth)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="p-5">
              <CardContent className="p-0">
                <h3 className="mb-3 text-sm font-semibold">Atividades recentes</h3>
                <div className="flex flex-col">
                  {activities.map((a, i) => (
                    <div
                      key={a.id}
                      className={`flex gap-3 py-2.5 ${
                        i < activities.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <div
                        className="flex size-7 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: `color-mix(in srgb, ${a.color} 15%, transparent)` }}
                      >
                        <a.icon className="size-3.5" style={{ color: a.color }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm leading-snug">{a.text}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">{a.time} atrás</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="p-5">
            <CardContent className="p-0">
              <h3 className="mb-3 text-sm font-semibold">Últimas organizações cadastradas</h3>
              <div className="flex flex-col">
                {organizations?.data.length ? (
                  organizations.data.map((org, i) => (
                    <div
                      key={org.id}
                      className={`flex items-center gap-3 py-2.5 ${
                        i < organizations.data.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600">
                        <Building2 className="size-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{org.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{org.slug}</div>
                      </div>
                      <Badge variant={org.status === "active" ? "default" : "secondary"}>
                        {org.status === "active" ? "Ativa" : org.status === "suspended" ? "Suspensa" : "Inativa"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-sm text-muted-foreground">
                    Nenhuma organização cadastrada ainda.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </AppLayout>
  )
}
