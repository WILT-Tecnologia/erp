"use client"

import { useState } from "react"
import { toast } from "sonner"
import { AppLayout } from "@/components/layouts/app-layout"
import { Breadcrumb } from "@/components/layouts/breadcrumb"
import { PageTransition } from "@/components/shared/animations"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/providers/auth-provider"
import { SettingRow } from "@/features/settings/components/setting-row"

const NOTIFICATION_DEFAULTS = [
  { key: "new_admin", label: "Novo administrador cadastrado", description: "Receber alerta ao criar um novo administrador", on: true },
  { key: "new_org", label: "Nova organização criada", description: "Notificar quando uma organização for provisionada", on: true },
  { key: "org_suspended", label: "Organização suspensa", description: "Alertar quando uma organização for suspensa", on: true },
  { key: "plan_limit", label: "Limite de plano atingido", description: "Avisar quando um tenant se aproximar do limite do plano", on: true },
  { key: "login_alert", label: "Login de administrador", description: "Alerta de acesso ao painel central", on: false },
]

const CHANNEL_DEFAULTS = [
  { key: "email", label: "E-mail", on: true },
  { key: "push", label: "Push (navegador)", on: true },
  { key: "whatsapp", label: "WhatsApp", on: false },
]

export default function SettingsPage() {
  const { admin } = useAuth()

  const [profileName, setProfileName] = useState(admin?.name ?? "")
  const [profileEmail, setProfileEmail] = useState(admin?.email ?? "")
  const [loadedAdminId, setLoadedAdminId] = useState<string | null>(null)

  if (admin && admin.id !== loadedAdminId) {
    setLoadedAdminId(admin.id)
    setProfileName(admin.name)
    setProfileEmail(admin.email)
  }

  const [orgName, setOrgName] = useState("ERP Sistema")
  const [orgTimezone, setOrgTimezone] = useState("America/Sao_Paulo")
  const [orgLanguage, setOrgLanguage] = useState("pt-BR")

  const [notifications, setNotifications] = useState(
    Object.fromEntries(NOTIFICATION_DEFAULTS.map((n) => [n.key, n.on]))
  )
  const [channels, setChannels] = useState(
    Object.fromEntries(CHANNEL_DEFAULTS.map((c) => [c.key, c.on]))
  )

  const [twoFactor, setTwoFactor] = useState(true)
  const [auditLog, setAuditLog] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState("24h")

  const initials = (admin?.name ?? "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <AppLayout>
      <PageTransition>
        <div className="space-y-6">
          <Breadcrumb items={[{ label: "Configurações" }]} />

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie sua conta e as preferências do sistema
            </p>
          </div>

          <Tabs defaultValue="perfil">
            <TabsList>
              <TabsTrigger value="perfil">Perfil</TabsTrigger>
              <TabsTrigger value="organizacao">Organização</TabsTrigger>
              <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
              <TabsTrigger value="seguranca">Segurança</TabsTrigger>
            </TabsList>

            <TabsContent value="perfil">
              <Card>
                <CardHeader>
                  <CardTitle>Perfil</CardTitle>
                  <CardDescription>Suas informações pessoais de administrador.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-16">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-violet-600 text-lg font-bold text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" disabled>
                      Alterar foto
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">Nome</Label>
                      <Input
                        id="profile-name"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-email">E-mail</Label>
                      <Input
                        id="profile-email"
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button onClick={() => toast.success("Perfil atualizado com sucesso!")}>
                    Salvar alterações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="organizacao">
              <Card>
                <CardHeader>
                  <CardTitle>Organização</CardTitle>
                  <CardDescription>
                    Preferências gerais exibidas em e-mails e relatórios.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="org-name">Nome do sistema</Label>
                    <Input
                      id="org-name"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Fuso horário</Label>
                      <Select value={orgTimezone} onValueChange={setOrgTimezone}>
                        <SelectTrigger className="max-w-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Sao_Paulo">America/Sao_Paulo (UTC-3)</SelectItem>
                          <SelectItem value="America/Manaus">America/Manaus (UTC-4)</SelectItem>
                          <SelectItem value="America/Noronha">America/Noronha (UTC-2)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Idioma padrão</Label>
                      <Select value={orgLanguage} onValueChange={setOrgLanguage}>
                        <SelectTrigger className="max-w-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                          <SelectItem value="en-US">English</SelectItem>
                          <SelectItem value="es-ES">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={() => toast.success("Configurações da organização salvas!")}>
                    Salvar configurações
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notificacoes">
              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription>Escolha o que você quer ser notificado.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    {NOTIFICATION_DEFAULTS.map((n) => (
                      <SettingRow key={n.key} label={n.label} description={n.description}>
                        <Switch
                          checked={notifications[n.key]}
                          onCheckedChange={(checked) => {
                            setNotifications((prev) => ({ ...prev, [n.key]: checked }))
                            toast.success("Preferência de notificação atualizada")
                          }}
                        />
                      </SettingRow>
                    ))}
                  </div>
                  <div className="mt-4 border-t pt-4">
                    <div className="mb-2 text-sm font-semibold">Canais de notificação</div>
                    {CHANNEL_DEFAULTS.map((c) => (
                      <SettingRow key={c.key} label={c.label}>
                        <Switch
                          checked={channels[c.key]}
                          onCheckedChange={(checked) => {
                            setChannels((prev) => ({ ...prev, [c.key]: checked }))
                            toast.success("Canal de notificação atualizado")
                          }}
                        />
                      </SettingRow>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seguranca" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Segurança da conta</CardTitle>
                  <CardDescription>Políticas de acesso e autenticação.</CardDescription>
                </CardHeader>
                <CardContent>
                  <SettingRow
                    label="Autenticação em dois fatores (2FA)"
                    description="Exigir 2FA para todos os administradores"
                  >
                    <Switch
                      checked={twoFactor}
                      onCheckedChange={(checked) => {
                        setTwoFactor(checked)
                        toast.success("Preferência de 2FA atualizada")
                      }}
                    />
                  </SettingRow>
                  <SettingRow
                    label="Expiração de sessão"
                    description="Encerrar sessão automaticamente após inatividade"
                  >
                    <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8h">8 horas</SelectItem>
                        <SelectItem value="24h">24 horas</SelectItem>
                        <SelectItem value="7d">7 dias</SelectItem>
                        <SelectItem value="30d">30 dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingRow>
                  <SettingRow
                    label="Log de auditoria completo"
                    description="Registrar todas as ações administrativas"
                  >
                    <Switch
                      checked={auditLog}
                      onCheckedChange={(checked) => {
                        setAuditLog(checked)
                        toast.success("Preferência de auditoria atualizada")
                      }}
                    />
                  </SettingRow>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alterar senha</CardTitle>
                  <CardDescription>
                    Recomendamos usar uma senha forte e exclusiva para esta conta.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova senha</Label>
                      <Input id="new-password" type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar senha</Label>
                      <Input id="confirm-password" type="password" placeholder="••••••••" />
                    </div>
                  </div>
                  <Button onClick={() => toast.success("Senha atualizada com sucesso!")}>
                    Atualizar senha
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </AppLayout>
  )
}
