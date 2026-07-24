import type { z } from "zod"
import type { loginSchema } from "@/schemas/login.schema"

export type LoginFormData = z.infer<typeof loginSchema>

export interface AuthState {
  admin: import("@/types").Admin | null
  isAuthenticated: boolean
  isLoading: boolean
}
