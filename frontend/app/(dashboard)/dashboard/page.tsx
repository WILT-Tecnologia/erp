"use client"

import { AppLayout } from "@/components/layouts/app-layout"
import { Breadcrumb } from "@/components/layouts/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageTransition } from "@/components/shared/animations"
import { Users, Activity, TrendingUp, DollarSign } from "lucide-react"

const stats = [
  {
    title: "Usuários",
    value: "1,234",
    description: "Usuários ativos",
    icon: Users,
    trend: "+12%",
  },
  {
    title: "Receita",
    value: "R$ 45,678",
    description: "Receita mensal",
    icon: DollarSign,
    trend: "+8%",
  },
  {
    title: "Atividades",
    value: "456",
    description: "Atividades hoje",
    icon: Activity,
    trend: "+23%",
  },
  {
    title: "Crescimento",
    value: "12.5%",
    description: "Crescimento mensal",
    icon: TrendingUp,
    trend: "+2.1%",
  },
]

export default function DashboardPage() {
  return (
    <AppLayout>
      <PageTransition>
        <div className="space-y-6">
          <Breadcrumb items={[{ label: "Dashboard" }]} />

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Visão geral do sistema
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                    <span className="text-xs text-green-600 dark:text-green-400">
                      {stat.trend}
                    </span>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  )
}
