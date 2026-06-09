import type { z } from "zod"
import type { loginSchema } from "@/schemas/login.schema"

export type LoginFormData = z.infer<typeof loginSchema>

export interface AuthState {
  user: import("@/types").User | null
  isAuthenticated: boolean
  isLoading: boolean
}
