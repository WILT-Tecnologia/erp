import { buildEndpoint } from "./endpoints"
import { authInterceptor } from "./interceptors"
import type { RequestConfig, HttpMethod } from "./types"

class ApiClient {
  private interceptors = [authInterceptor]

  private async request<T>(
    method: HttpMethod,
    path: string,
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = buildEndpoint(path)

    let finalConfig: RequestConfig = {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...config.headers,
      },
      ...config,
    }

    if (data && method !== "GET") {
      finalConfig.body = JSON.stringify(data)
    }

    if (config.params) {
      const searchParams = new URLSearchParams()
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value))
        }
      })
      finalConfig = {
        ...finalConfig,
        params: undefined,
      }
    }

    for (const interceptor of this.interceptors) {
      if (interceptor.onRequest) {
        finalConfig = await interceptor.onRequest(finalConfig)
      }
    }

    const paramsStr = config.params
      ? "?" +
        new URLSearchParams(
          Object.entries(config.params).reduce(
            (acc, [k, v]) => {
              if (v !== undefined) acc[k] = String(v)
              return acc
            },
            {} as Record<string, string>
          )
        ).toString()
      : ""

    const response = await fetch(`${url}${paramsStr}`, finalConfig)

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      const error = new Error(
        errorBody.message || `HTTP ${response.status}`
      ) as Error & { status: number; body: unknown }
      error.status = response.status
      error.body = errorBody

      for (const interceptor of this.interceptors) {
        if (interceptor.onError) {
          throw await interceptor.onError(error)
        }
      }

      throw error
    }

    const result = await response.json()

    for (const interceptor of this.interceptors) {
      if (interceptor.onResponse) {
        return await interceptor.onResponse(result)
      }
    }

    return result as T
  }

  get<T>(path: string, config?: RequestConfig) {
    return this.request<T>("GET", path, undefined, config)
  }

  post<T>(path: string, data?: unknown, config?: RequestConfig) {
    return this.request<T>("POST", path, data, config)
  }

  put<T>(path: string, data?: unknown, config?: RequestConfig) {
    return this.request<T>("PUT", path, data, config)
  }

  patch<T>(path: string, data?: unknown, config?: RequestConfig) {
    return this.request<T>("PATCH", path, data, config)
  }

  delete<T>(path: string, config?: RequestConfig) {
    return this.request<T>("DELETE", path, undefined, config)
  }
}

export const api = new ApiClient()
