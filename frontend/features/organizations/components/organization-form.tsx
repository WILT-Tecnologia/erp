"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  organizationSchema,
  type OrganizationFormData,
} from "@/schemas/organization.schema"
import type { Admin, Organization, PaginatedResponse, Plan } from "@/types"
import { useApi } from "@/hooks/useApi"
import { API_ENDPOINTS } from "@/constants"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface OrganizationFormProps {
  organization?: Organization | null
  onSubmit: (data: OrganizationFormData) => Promise<void>
  isPending?: boolean
}

const NONE = "__none__"

export function OrganizationForm({
  organization,
  onSubmit,
  isPending,
}: OrganizationFormProps) {
  const { data: plansResponse } = useApi<PaginatedResponse<Plan>>(
    `${API_ENDPOINTS.PLANS}?per_page=100`
  )
  const { data: adminsResponse } = useApi<PaginatedResponse<Admin>>(
    `${API_ENDPOINTS.ADMINS}?per_page=100`
  )

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: organization?.name ?? "",
      legal_name: organization?.legal_name ?? "",
      slug: organization?.slug ?? "",
      cnpj: organization?.cnpj ?? "",
      email: organization?.email ?? "",
      phone: organization?.phone ?? "",
      whatsapp: organization?.whatsapp ?? "",
      description: organization?.description ?? "",
      status: organization?.status ?? "active",
      timezone: organization?.timezone ?? "America/Sao_Paulo",
      language: organization?.language ?? "pt-BR",
      plan_id: organization?.plan?.id ?? "",
      owner_admin_id: organization?.owner_admin?.id ?? "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome *</FormLabel>
                <FormControl>
                  <Input placeholder="Igreja Central" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug *</FormLabel>
                <FormControl>
                  <Input placeholder="igreja-central" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="legal_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razão social</FormLabel>
              <FormControl>
                <Input placeholder="Associação Igreja Central" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNPJ</FormLabel>
                <FormControl>
                  <Input placeholder="00000000000000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="contato@igreja.org" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(11) 0000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input placeholder="(11) 90000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Breve descrição da organização" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="suspended">Suspensa</SelectItem>
                    <SelectItem value="inactive">Inativa</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idioma</FormLabel>
                <FormControl>
                  <Input placeholder="pt-BR" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fuso horário</FormLabel>
              <FormControl>
                <Input placeholder="America/Sao_Paulo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="plan_id"
            render={() => (
              <FormItem>
                <FormLabel>Plano</FormLabel>
                <Controller
                  control={form.control}
                  name="plan_id"
                  render={({ field }) => (
                    <Select
                      value={field.value || NONE}
                      onValueChange={(v) => field.onChange(v === NONE ? "" : v)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um plano" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NONE}>Nenhum</SelectItem>
                        {plansResponse?.data.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="owner_admin_id"
            render={() => (
              <FormItem>
                <FormLabel>Administrador responsável</FormLabel>
                <Controller
                  control={form.control}
                  name="owner_admin_id"
                  render={({ field }) => (
                    <Select
                      value={field.value || NONE}
                      onValueChange={(v) => field.onChange(v === NONE ? "" : v)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um admin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NONE}>Nenhum</SelectItem>
                        {adminsResponse?.data.map((admin) => (
                          <SelectItem key={admin.id} value={admin.id}>
                            {admin.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : organization ? (
            "Atualizar"
          ) : (
            "Criar Organização"
          )}
        </Button>
      </form>
    </Form>
  )
}
