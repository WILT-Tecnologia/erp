export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
  timeout?: number
  skipAuth?: boolean
}

export interface ApiRequestInterceptors {
  onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
  onResponse?: <T>(response: T) => T | Promise<T>
  onError?: (error: Error) => Error | Promise<Error>
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
