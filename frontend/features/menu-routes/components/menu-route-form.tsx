"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  menuRouteSchema,
  type MenuRouteFormData,
} from "@/schemas/menu-route.schema"
import type { MenuRoute, PaginatedResponse } from "@/types"
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
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { IconPicker } from "./icon-picker"
import { MenuRoutePermissionsField } from "./menu-route-permissions-field"

interface MenuRouteFormProps {
  menuRoute?: MenuRoute | null
  parentId?: string | null
  onSubmit: (data: MenuRouteFormData) => Promise<void>
  isPending?: boolean
}

const NONE = "__none__"

export function MenuRouteForm({
  menuRoute,
  parentId,
  onSubmit,
  isPending,
}: MenuRouteFormProps) {
  const { data: menuRoutesResponse } = useApi<PaginatedResponse<MenuRoute>>(
    `${API_ENDPOINTS.MENU_ROUTES}?per_page=100`
  )
  const parentOptions = (menuRoutesResponse?.data ?? []).filter(
    (r) => r.id !== menuRoute?.id
  )

  const categoryOptions = Array.from(
    new Set((menuRoutesResponse?.data ?? []).map((r) => r.category))
  )

  const form = useForm<MenuRouteFormData>({
    resolver: zodResolver(menuRouteSchema),
    mode: "onChange",
    defaultValues: {
      title: menuRoute?.title ?? "",
      slug: menuRoute?.slug ?? "",
      icon: menuRoute?.icon ?? "",
      category: menuRoute?.category ?? "",
      sort_order: menuRoute?.sort_order ?? 10,
      parent_id: menuRoute?.parent_id ?? parentId ?? "",
      is_active: menuRoute?.is_active ?? true,
      permission_ids: menuRoute?.permissions.map((p) => p.id) ?? [],
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col"
      >
        <div className="flex-1 space-y-4 overflow-y-auto">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título *</FormLabel>
                <FormControl>
                  <Input placeholder="Dashboard" {...field} />
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
                <FormLabel>Slug/Path *</FormLabel>
                <FormControl>
                  <Input placeholder="/admin/dashboard" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ícone</FormLabel>
                <FormControl>
                  <IconPicker
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={() => (
              <FormItem>
                <FormLabel>Categoria *</FormLabel>
                <Controller
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <div className="flex gap-2">
                      <Select
                        value={
                          categoryOptions.includes(field.value)
                            ? field.value
                            : undefined
                        }
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Selecionar existente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryOptions.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        className="flex-1"
                        placeholder="ou digite uma nova"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </div>
                  )}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="sort_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posição *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      value={field.value as number}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parent_id"
              render={() => (
                <FormItem>
                  <FormLabel>Rota pai</FormLabel>
                  <Controller
                    control={form.control}
                    name="parent_id"
                    render={({ field }) => (
                      <Select
                        value={field.value || NONE}
                        onValueChange={(v) =>
                          field.onChange(v === NONE ? "" : v)
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Nenhuma (raiz)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={NONE}>Nenhuma (raiz)</SelectItem>
                          {parentOptions.map((route) => (
                            <SelectItem key={route.id} value={route.id}>
                              {route.title}
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

          <FormField
            control={form.control}
            name="permission_ids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Permissões *</FormLabel>
                <FormControl>
                  <MenuRoutePermissionsField
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <FormLabel className="!mt-0">Ativa</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <hr className="my-4" />

        <Button
          type="submit"
          className="w-full"
          disabled={isPending || !form.formState.isValid}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Salvando...
            </>
          ) : menuRoute ? (
            "Atualizar"
          ) : (
            "Criar Rota"
          )}
        </Button>
      </form>
    </Form>
  )
}
