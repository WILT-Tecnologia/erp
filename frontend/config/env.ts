export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  API_VERSION: process.env.NEXT_PUBLIC_API_VERSION ?? "v1",
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "ERP Sistema",
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
} as const

export const apiConfig = {
  baseUrl: `${env.API_URL}/api/${env.API_VERSION}`,
  timeout: 30000,
  retryCount: 3,
} as const
