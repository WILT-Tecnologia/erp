"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import { authService } from "../services/auth.service"
import type { LoginFormData } from "../types/auth.types"
import { toast } from "sonner"

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuthStore()

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await authService.login(data)
      login(response.user, response.tokens)
      toast.success("Login realizado com sucesso!")
      router.push("/dashboard")
    } catch (error) {
      const err = error as { body?: { message?: string } }
      toast.error(
        err.body?.message ?? "Erro ao realizar login. Verifique suas credenciais."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return {
    handleLogin,
    isLoading,
  }
}
