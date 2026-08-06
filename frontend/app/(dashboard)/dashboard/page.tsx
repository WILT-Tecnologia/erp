"use client"

import { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import { AppLayout } from "@/components/layouts/app-layout"
import { Breadcrumb } from "@/components/layouts/breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageTransition } from "@/components/shared/animations"
import {
  Users,
  Building2,
  ShieldCheck,
  Church,
  UserPlus,
  Building,
  XCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
} from "lucide-react"
import { useApi } from "@/hooks/useApi"
import { API_ENDPOINTS } from "@/constants"
import type { Organization, PaginatedResponse } from "@/types"
import type { DashboardPeriod } from "@/types"
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats"
import { PeriodFilter } from "@/features/dashboard/components/period-filter"

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function timeAgo(iso: string | null) {
  if (!iso) return "—"
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: ptBR })
}

function KpiCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  sub?: string
}) {
  return (
    <Card className="p-5">
      <CardContent className="p-0">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
        <div className="mt-3 text-2xl font-bold tracking-tight">{value}</div>
        <div className="mt-1 text-sm text-muted-foreground">{label}</div>
        {sub && (
          <div className="mt-1 text-xs text-muted-foreground/70">{sub}</div>
        )}
      </CardContent>
    </Card>
  )
}

const ACTIVITY_ICONS = {
  organization: { icon: Building, color: "var(--primary)" },
  admin: { icon: UserPlus, color: "var(--info)" },
  subscription: { icon: XCircle, color: "var(--warning)" },
} as const

export default function DashboardPage() {
  const [period, setPeriod] = useState<DashboardPeriod>("month")
  const [range, setRange] = useState<DateRange | undefined>(undefined)

  const { stats, isLoading } = useDashboardStats({
    period,
    from: range?.from?.toISOString(),
    to: range?.to?.toISOString(),
  })

  const { data: organizations } = useApi<PaginatedResponse<Organization>>(
    `${API_ENDPOINTS.ORGANIZATIONS}?per_page=5`
  )

  const growthData =
    stats?.growth.map((point) => ({
      month: point.month.slice(5),
      organizacoes: point.total,
    })) ?? []
  const trendData =
    stats?.revenue_expense_trend.map((point) => ({
      month: point.month.slice(5),
      receita: point.revenue,
      despesa: point.expense,
    })) ?? []

  return (
    <AppLayout>
      <PageTransition>
        <div className="space-y-6">
          <Breadcrumb items={[{ label: "Dashboard" }]} />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="mt-1 text-muted-foreground">
                Visão geral do sistema
              </p>
            </div>
            <PeriodFilter
              period={period}
              range={range}
              onPeriodChange={setPeriod}
              onRangeChange={setRange}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Administradores"
              value={stats?.admins_count ?? (isLoading ? "…" : "—")}
              icon={ShieldCheck}
              sub="Contas com acesso central"
            />
            <KpiCard
              label="Usuários comuns"
              value={stats?.common_users_count ?? (isLoading ? "…" : "—")}
              icon={Users}
              sub="Usuários de todas as organizações"
            />
            <KpiCard
              label="Organizações ativas"
              value={
                stats?.active_organizations_count ?? (isLoading ? "…" : "—")
              }
              icon={Building2}
              sub={`De ${stats?.organizations_count ?? 0} organizações`}
            />
            <KpiCard
              label="Congregações ativas"
              value={
                stats?.active_congregations_count ?? (isLoading ? "…" : "—")
              }
              icon={Church}
              sub="Em todas as organizações"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Receita do mês"
              value={formatCurrency(stats?.revenue_month ?? 0)}
              icon={TrendingUp}
            />
            <KpiCard
              label="Despesas do mês"
              value={formatCurrency(stats?.churn_amount ?? 0)}
              icon={TrendingDown}
              sub="Assinaturas canceladas no período"
            />
            <KpiCard
              label="Saldo do mês"
              value={formatCurrency(stats?.balance_month ?? 0)}
              icon={DollarSign}
            />
            <KpiCard
              label="A Receber / Pagar"
              value={formatCurrency(stats?.past_due_amount ?? 0)}
              icon={Wallet}
              sub="Assinaturas em atraso"
            />
          </div>

          <Card className="w-full p-5">
            <CardContent className="p-0">
              <div className="mb-4">
                <h3 className="text-sm font-semibold">
                  Crescimento de organizações
                </h3>
                <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="orgGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--primary)"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--primary)"
                        stopOpacity={0}
                      />
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

          <Card className="w-full p-5">
            <CardContent className="p-0">
              <div className="mb-4">
                <h3 className="text-sm font-semibold">Receita vs Despesas</h3>
                <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="finReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--primary)"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--primary)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="finDespesa" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--destructive)"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--destructive)"
                        stopOpacity={0}
                      />
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
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="receita"
                    name="Receita"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fill="url(#finReceita)"
                  />
                  <Area
                    type="monotone"
                    dataKey="despesa"
                    name="Despesa"
                    stroke="var(--destructive)"
                    strokeWidth={2}
                    fill="url(#finDespesa)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="p-5">
              <CardContent className="p-0">
                <h3 className="mb-3 text-sm font-semibold">
                  Atividades recentes
                </h3>
                <div className="flex flex-col">
                  {stats?.recent_activities.length ? (
                    stats.recent_activities.map((activity, i) => {
                      const meta = ACTIVITY_ICONS[activity.type]
                      return (
                        <div
                          key={activity.id}
                          className={`flex gap-3 py-2.5 ${
                            i < stats.recent_activities.length - 1
                              ? "border-b"
                              : ""
                          }`}
                        >
                          <div
                            className="flex size-7 shrink-0 items-center justify-center rounded-full"
                            style={{
                              backgroundColor: `color-mix(in srgb, ${meta.color} 15%, transparent)`,
                            }}
                          >
                            <meta.icon
                              className="size-3.5"
                              style={{ color: meta.color }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm leading-snug">
                              {activity.text}
                            </div>
                            <div className="mt-0.5 text-xs text-muted-foreground">
                              {timeAgo(activity.created_at)}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="py-4 text-sm text-muted-foreground">
                      Nenhuma atividade recente.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="p-5">
              <CardContent className="p-0">
                <h3 className="mb-3 text-sm font-semibold">
                  Últimas organizações cadastradas
                </h3>
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
                          <div className="truncate text-sm font-medium">
                            {org.name}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {org.slug}
                          </div>
                        </div>
                        <Badge
                          variant={
                            org.status === "active" ? "default" : "secondary"
                          }
                        >
                          {org.status === "active"
                            ? "Ativa"
                            : org.status === "suspended"
                              ? "Suspensa"
                              : "Inativa"}
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

            <Card className="p-5">
              <CardContent className="p-0">
                <h3 className="mb-3 text-sm font-semibold">
                  Últimos usuários cadastrados
                </h3>
                <div className="flex flex-col">
                  {stats?.recent_users.length ? (
                    stats.recent_users.map((user, i) => (
                      <div
                        key={`${user.name}-${user.created_at}-${i}`}
                        className={`flex items-center gap-3 py-2.5 ${
                          stats.recent_users.length - 1 > i ? "border-b" : ""
                        }`}
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-600 text-xs font-bold text-white">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">
                            {user.name}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {user.organization}
                          </div>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {timeAgo(user.created_at)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="py-4 text-sm text-muted-foreground">
                      Nenhum usuário cadastrado ainda.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  )
}
