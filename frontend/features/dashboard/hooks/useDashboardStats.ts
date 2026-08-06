"use client"

import { useApi } from "@/hooks/useApi"
import { API_ENDPOINTS } from "@/constants"
import type { DashboardPeriod, DashboardStats } from "@/types"

interface UseDashboardStatsParams {
  period: DashboardPeriod
  from?: string
  to?: string
}

export function useDashboardStats({
  period,
  from,
  to,
}: UseDashboardStatsParams) {
  const params = new URLSearchParams({ period })
  if (period === "custom" && from && to) {
    params.set("from", from)
    params.set("to", to)
  }

  const key =
    period === "custom" && (!from || !to)
      ? null
      : `${API_ENDPOINTS.DASHBOARD_STATS}?${params.toString()}`

  const { data, isLoading, error, mutate } = useApi<DashboardStats>(key)

  return {
    stats: data,
    isLoading,
    error,
    refresh: mutate,
  }
}
