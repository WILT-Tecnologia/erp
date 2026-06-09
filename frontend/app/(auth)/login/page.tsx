import { AuthLayout } from "@/components/layouts/auth-layout"
import { LoginForm } from "@/features/auth/components/login-form"

export default function LoginPage() {
  return (
    <AuthLayout
      title="Entrar"
      description="Faça login para acessar o sistema"
    >
      <LoginForm />
    </AuthLayout>
  )
}
