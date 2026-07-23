"use client"

import { useState, useSyncExternalStore } from "react"
import { Bell, Moon, Search, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/providers/auth-provider"
import { CommandPalette } from "./command-palette"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const emptySubscribe = () => () => {}

const notifications = [
  { id: 1, text: "Novo administrador cadastrado", time: "5 min", unread: true },
  { id: 2, text: "Organização \"Igreja Central Demo\" atualizada", time: "1h", unread: true },
  { id: 3, text: "Plano \"Pro\" atingiu 80% do limite de uso", time: "3h", unread: false },
]

export function Header() {
  const { resolvedTheme, setTheme } = useTheme()
  const { admin, logout } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)

  const initials = admin?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-card px-4">
      <SidebarTrigger />

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />

      <button
        onClick={() => setCommandOpen(true)}
        className="hidden flex-1 max-w-sm items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-ring sm:flex"
      >
        <Search className="size-3.5" />
        <span className="flex-1 text-left">Buscar...</span>
        <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
      </button>

      <div className="flex-1" />

      {mounted && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        >
          {resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      )}

      <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-card" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end">
          <DropdownMenuLabel className="flex items-center justify-between">
            Notificações
            {unreadCount > 0 && <Badge variant="secondary">{unreadCount} novas</Badge>}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.map((n) => (
            <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 whitespace-normal">
              <div className="flex w-full items-start gap-2">
                {n.unread && <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />}
                <span className="text-sm leading-snug">{n.text}</span>
              </div>
              <span className="pl-3.5 text-xs text-muted-foreground">{n.time} atrás</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-white">
                {initials ?? "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{admin?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{admin?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
