declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string
    NEXT_PUBLIC_API_VERSION: string
    NEXT_PUBLIC_APP_NAME: string
    NEXT_PUBLIC_APP_ENV: "development" | "staging" | "production"
  }
}
