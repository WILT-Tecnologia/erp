import useSWR, { type SWRConfiguration } from "swr"
import { useState, useCallback } from "react"
import { api } from "@/services/api"
import type { PaginatedResponse } from "@/types"

interface UsePaginatedApiOptions<T>
  extends SWRConfiguration<PaginatedResponse<T>> {
  perPage?: number
  skipAuth?: boolean
}

export function usePaginatedApi<T>(
  key: string,
  options: UsePaginatedApiOptions<T> = {}
) {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(options.perPage ?? 10)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({})

  const params = new URLSearchParams()
  params.set("page", String(page))
  params.set("per_page", String(perPage))
  if (search) params.set("search", search)
  Object.entries(filters).forEach(([k, v]) => {
    if (v) params.set(k, v)
  })

  const queryKey = `${key}?${params.toString()}`

  const fetcher = async (url: string) => {
    const response = await api.get<PaginatedResponse<T>>(url, {
      skipAuth: options.skipAuth,
    })
    return response
  }

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<T>>(
    queryKey,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      ...options,
    }
  )

  const goToPage = useCallback((p: number) => setPage(p), [])
  const nextPage = useCallback(
    () => setPage((p) => Math.min(p + 1, data?.meta.last_page ?? p)),
    [data?.meta.last_page]
  )
  const prevPage = useCallback(
    () => setPage((p) => Math.max(p - 1, 1)),
    []
  )
  const setSearchTerm = useCallback(
    (term: string) => {
      setSearch(term)
      setPage(1)
    },
    []
  )

  return {
    data: data?.data ?? [],
    meta: data?.meta ?? null,
    isLoading,
    error,
    mutate,
    page,
    perPage,
    search,
    filters,
    setPage: goToPage,
    setPerPage,
    setSearch: setSearchTerm,
    setFilters,
    nextPage,
    prevPage,
  }
}
