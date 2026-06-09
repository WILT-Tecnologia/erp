import { apiConfig as config } from "@/config/env"

export const API_CONFIG = {
  BASE_URL: config.baseUrl,
  TIMEOUT: config.timeout,
  RETRY_COUNT: config.retryCount,
} as const
