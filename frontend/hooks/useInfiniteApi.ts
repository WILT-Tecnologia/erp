import useSWRInfinite, {
  type SWRInfiniteConfiguration,
} from "swr/infinite"
import { api } from "@/services/api"
import type { PaginatedResponse } from "@/types"

interface UseInfiniteApiOptions<T>
  extends SWRInfiniteConfiguration<PaginatedResponse<T>> {
  perPage?: number
  skipAuth?: boolean
}

export function useInfiniteApi<T>(
  key: string,
  options: UseInfiniteApiOptions<T> = {}
) {
  const getKey = (
    pageIndex: number,
    previousPageData: PaginatedResponse<T> | null
  ) => {
    if (previousPageData && !previousPageData.data.length) return null
    const params = new URLSearchParams()
    params.set("page", String(pageIndex + 1))
    params.set("per_page", String(options.perPage ?? 10))
    return `${key}?${params.toString()}`
  }

  const fetcher = async (url: string) => {
    const response = await api.get<PaginatedResponse<T>>(url, {
      skipAuth: options.skipAuth,
    })
    return response
  }

  const { data, error, size, setSize, isLoading, mutate } =
    useSWRInfinite<PaginatedResponse<T>>(getKey, fetcher, {
      revalidateOnFocus: false,
      ...options,
    })

  const items = data ? data.flatMap((page) => page.data) : []
  const isReachingEnd = data
    ? data[data.length - 1]?.data.length < (options.perPage ?? 10)
    : false
  const isEmpty = data?.[0]?.data.length === 0

  return {
    data: items,
    isLoading,
    error,
    mutate,
    size,
    setSize,
    isReachingEnd,
    isEmpty,
    loadMore: () => setSize(size + 1),
  }
}
