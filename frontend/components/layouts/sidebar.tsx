"use client"

import { useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Church, ChevronRight } from "lucide-react"
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useAuth } from "@/providers/auth-provider"
import { usePermissions } from "@/features/auth/permissions"
import { useSidebarRoutes } from "@/features/menu-routes/hooks/useSidebarRoutes"
import { LucideIcon } from "@/features/menu-routes/components/icon-picker"
import type { MenuRoute } from "@/types"

function isActiveOrHasActiveDescendant(
  route: MenuRoute,
  pathname: string
): boolean {
  if (pathname === route.slug || pathname.startsWith(`${route.slug}/`))
    return true
  return route.children.some((child) =>
    isActiveOrHasActiveDescendant(child, pathname)
  )
}

function filterVisibleRoutes(
  routes: MenuRoute[],
  hasAnyPermission: (names: string[]) => boolean
): MenuRoute[] {
  return routes
    .map((route) => {
      const children = filterVisibleRoutes(route.children, hasAnyPermission)
      const isVisible = hasAnyPermission(route.permissions.map((p) => p.name))
      if (!isVisible && children.length === 0) return null
      return { ...route, children }
    })
    .filter((route): route is MenuRoute => route !== null)
}

function groupByCategory(routes: MenuRoute[]): Map<string, MenuRoute[]> {
  const groups = new Map<string, MenuRoute[]>()
  for (const route of routes) {
    const group = groups.get(route.category) ?? []
    group.push(route)
    groups.set(route.category, group)
  }
  return groups
}

function MenuRouteNode({
  route,
  pathname,
  depth = 0,
}: {
  route: MenuRoute
  pathname: string
  depth?: number
}) {
  const isActive = pathname === route.slug
  const hasActiveDescendant = isActiveOrHasActiveDescendant(route, pathname)

  if (route.children.length > 0) {
    const ItemComp = depth === 0 ? SidebarMenuItem : SidebarMenuSubItem
    const ButtonComp = depth === 0 ? SidebarMenuButton : SidebarMenuSubButton

    return (
      <Collapsible
        defaultOpen={hasActiveDescendant}
        className="group/collapsible"
      >
        <ItemComp>
          <CollapsibleTrigger asChild>
            <ButtonComp isActive={isActive} className="cursor-pointer">
              <LucideIcon name={route.icon} className="size-4" />
              <span>{route.title}</span>
              <ChevronRight className="ml-auto size-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </ButtonComp>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {route.children.map((child) => (
                <MenuRouteNode
                  key={child.id}
                  route={child}
                  pathname={pathname}
                  depth={depth + 1}
                />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </ItemComp>
      </Collapsible>
    )
  }

  const ItemComp = depth === 0 ? SidebarMenuItem : SidebarMenuSubItem
  const ButtonComp = depth === 0 ? SidebarMenuButton : SidebarMenuSubButton

  return (
    <ItemComp>
      <ButtonComp asChild isActive={isActive} tooltip={route.title}>
        <Link href={route.slug}>
          <LucideIcon name={route.icon} className="size-4" />
          <span>{route.title}</span>
        </Link>
      </ButtonComp>
    </ItemComp>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const { admin } = useAuth()
  const { hasAnyPermission } = usePermissions()
  const { routes, isLoading } = useSidebarRoutes()

  const visibleRoutes = useMemo(
    () => filterVisibleRoutes(routes, hasAnyPermission),
    [routes, hasAnyPermission]
  )

  const groupedRoutes = useMemo(
    () => groupByCategory(visibleRoutes),
    [visibleRoutes]
  )

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
            <span className="text-sm font-bold text-sidebar-foreground">
              ERP Sistema
            </span>
            <span className="text-[11px] text-sidebar-foreground/50">
              Multi-Tenant SaaS
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {!isLoading &&
          Array.from(groupedRoutes.entries()).map(
            ([category, categoryRoutes]) => (
              <SidebarGroup key={category}>
                <SidebarGroupLabel className="text-sidebar-foreground/40">
                  {category}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {categoryRoutes.map((route) => (
                      <MenuRouteNode
                        key={route.id}
                        route={route}
                        pathname={pathname}
                      />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )
          )}
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
            <span className="truncate text-[11px] text-sidebar-foreground/50">
              Administrador
            </span>
          </div>
          <ChevronRight className="size-3.5 shrink-0 text-sidebar-foreground/40 group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarFooter>
    </SidebarPrimitive>
  )
}
