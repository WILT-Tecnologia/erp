"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
  ChevronRight,
} from "lucide-react"
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/providers/auth-provider"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: "Principal",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Gestão",
    items: [
      { label: "Organizações", href: "/organizations", icon: Building2 },
      { label: "Igrejas", href: "/churches", icon: Church },
      { label: "Congregações", href: "/congregations", icon: Home },
      { label: "Membros", href: "/members", icon: Users },
      { label: "Famílias", href: "/families", icon: Users2 },
      { label: "Departamentos", href: "/departments", icon: GitBranch },
      { label: "Eventos", href: "/events", icon: CalendarDays },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { label: "Financeiro", href: "/financial", icon: Wallet },
      { label: "Relatórios", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    label: "CRM",
    items: [{ label: "Pipeline CRM", href: "/crm", icon: Target }],
  },
  {
    label: "Administração",
    items: [
      { label: "Administradores", href: "/admins", icon: UserCog },
      { label: "Usuários", href: "/users", icon: Users },
      { label: "Configurações", href: "/settings", icon: Settings },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { admin } = useAuth()

  const initials = admin?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <SidebarPrimitive collapsible="icon" className="border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-600">
            <Church className="size-4 text-white" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold text-sidebar-foreground">ERP Sistema</span>
            <span className="text-[11px] text-sidebar-foreground/50">Multi-Tenant SaaS</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-sidebar-foreground/40">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.href)
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-600 text-xs font-bold text-white">
            {initials ?? "U"}
          </div>
          <div className="flex min-w-0 flex-1 flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold text-sidebar-foreground">
              {admin?.name ?? "Usuário"}
            </span>
            <span className="truncate text-[11px] text-sidebar-foreground/50">Administrador</span>
          </div>
          <ChevronRight className="size-3.5 shrink-0 text-sidebar-foreground/40 group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarFooter>
    </SidebarPrimitive>
  )
}
