import useSWR, { type SWRConfiguration, type SWRResponse } from "swr"
import { api } from "@/services/api"

interface UseApiOptions<T> extends SWRConfiguration<T> {
  skipAuth?: boolean
}

export function useApi<T>(
  key: string | null,
  config?: UseApiOptions<T>
): SWRResponse<T> & { isLoading: boolean } {
  const fetcher = async (url: string) => {
    const response = await api.get<T>(url, {
      skipAuth: config?.skipAuth,
    })
    return response
  }

  const { isLoading, ...swr } = useSWR<T>(key, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
    errorRetryCount: 3,
    ...config,
  })

  return {
    ...swr,
    isLoading: isLoading || (!swr.data && !swr.error),
  }
}
