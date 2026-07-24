"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Church,
  Home,
  Users,
  Users2,
  GitBranch,
  CalendarDays,
  Wallet,
  BarChart3,
  Target,
  UserCog,
  Settings,
  LogOut,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useAuth } from "@/providers/auth-provider"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Organizações", href: "/organizations", icon: Building2 },
  { label: "Igrejas", href: "/churches", icon: Church },
  { label: "Congregações", href: "/congregations", icon: Home },
  { label: "Membros", href: "/members", icon: Users },
  { label: "Famílias", href: "/families", icon: Users2 },
  { label: "Departamentos", href: "/departments", icon: GitBranch },
  { label: "Eventos", href: "/events", icon: CalendarDays },
  { label: "Financeiro", href: "/financial", icon: Wallet },
  { label: "Relatórios", href: "/reports", icon: BarChart3 },
  { label: "Pipeline CRM", href: "/crm", icon: Target },
  { label: "Administradores", href: "/admins", icon: UserCog },
  { label: "Usuários", href: "/users", icon: Users },
  { label: "Configurações", href: "/settings", icon: Settings },
]

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange: setOpen }: CommandPaletteProps) {
  const router = useRouter()
  const { logout } = useAuth()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [open, setOpen])

  const go = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buscar páginas, ações..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Navegação">
          {navItems.map((item) => (
            <CommandItem key={item.href} onSelect={() => go(item.href)}>
              <item.icon />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Conta">
          <CommandItem
            onSelect={() => {
              setOpen(false)
              logout()
            }}
          >
            <LogOut />
            <span>Sair</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
