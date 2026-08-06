"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Breadcrumb } from "@/components/layouts/breadcrumb"
import { PageTransition } from "@/components/shared/animations"
import { DataGridWrapper } from "@/components/shared/DataGrid"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus } from "lucide-react"
import type { GridColDef } from "@mui/x-data-grid"
import type { MenuRoute } from "@/types"
import { useMenuRoutes } from "@/features/menu-routes/hooks/useMenuRoutes"
import { MenuRouteForm } from "@/features/menu-routes/components/menu-route-form"
import { LucideIcon } from "@/features/menu-routes/components/icon-picker"
import type { MenuRouteFormData } from "@/schemas/menu-route.schema"

export default function MenuRoutesPage() {
  const {
    menuRoutes,
    meta,
    isLoading,
    page,
    perPage,
    search,
    setPage,
    setPerPage,
    setSearch,
    createMenuRoute,
    editMenuRoute,
    deleteMenuRoute,
  } = useMenuRoutes()

  const [sheet, setSheet] = useState<{
    open: boolean
    menuRoute: MenuRoute | null
    parentId: string | null
  }>({ open: false, menuRoute: null, parentId: null })
  const [deleting, setDeleting] = useState<MenuRoute | null>(null)
  const [isPending, setIsPending] = useState(false)
  const [isDeletingChild, setIsDeletingChild] = useState<string | null>(null)

  const children = deleting
    ? menuRoutes.filter((route) => route.parent_id === deleting.id)
    : []

  const handleSubmit = async (data: MenuRouteFormData) => {
    setIsPending(true)
    try {
      const payload = { ...data, parent_id: data.parent_id || undefined }
      if (sheet.menuRoute) {
        await editMenuRoute(sheet.menuRoute.id, payload)
      } else {
        await createMenuRoute(payload)
      }
      setSheet({ open: false, menuRoute: null, parentId: null })
    } finally {
      setIsPending(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting || children.length > 0) return
    await deleteMenuRoute(deleting.id)
    setDeleting(null)
  }

  const handleDeleteChild = async (child: MenuRoute) => {
    setIsDeletingChild(child.id)
    try {
      await deleteMenuRoute(child.id)
    } finally {
      setIsDeletingChild(null)
    }
  }

  const columns: GridColDef<MenuRoute>[] = [
    {
      field: "icon",
      headerName: "",
      width: 56,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <LucideIcon name={params.value} className="size-4" />
      ),
    },
    {
      field: "title",
      headerName: "Título",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{params.row.title}</div>
          <div className="truncate text-xs text-muted-foreground">
            {params.row.slug}
          </div>
        </div>
      ),
    },
    {
      field: "category",
      headerName: "Categoria",
      width: 180,
      renderCell: (params) => <Badge variant="outline">{params.value}</Badge>,
    },
    {
      field: "parent",
      headerName: "Rota pai",
      width: 160,
      valueGetter: (_value, row) => row.parent_id,
      renderCell: (params) => {
        const parent = menuRoutes.find((r) => r.id === params.row.parent_id)
        return (
          <span className="text-sm text-muted-foreground">
            {parent?.title ?? "—"}
          </span>
        )
      },
    },
    {
      field: "permissions",
      headerName: "Permissões",
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Badge variant="secondary">{params.row.permissions.length}</Badge>
      ),
    },
    {
      field: "sort_order",
      headerName: "Posição",
      width: 100,
    },
    {
      field: "is_active",
      headerName: "Ativa",
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <Badge>Ativa</Badge>
        ) : (
          <Badge variant="secondary">Inativa</Badge>
        ),
    },
    {
      field: "actions",
      headerName: "",
      width: 100,
      sortable: false,
      filterable: false,
      hideable: false,
      disableExport: true,
      renderCell: (params) => (
        <div className="row-actions flex h-full items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() =>
              setSheet({ open: true, menuRoute: params.row, parentId: null })
            }
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setDeleting(params.row)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <AppLayout>
      <PageTransition>
        <div className="space-y-6">
          <Breadcrumb
            items={[{ label: "Serviços Globais" }, { label: "Rotas do Menu" }]}
          />

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Rotas do Menu
              </h1>
              <p className="mt-1 text-muted-foreground">
                Configure as rotas exibidas na sidebar e as permissões de acesso
                a cada uma
              </p>
            </div>
          </div>

          <DataGridWrapper<MenuRoute>
            persistKey="menu-routes"
            rows={menuRoutes}
            columns={columns}
            loading={isLoading}
            getRowId={(row) => row.id}
            newLabel="Nova Rota"
            onNew={() =>
              setSheet({ open: true, menuRoute: null, parentId: null })
            }
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar por título ou slug..."
            paginationMode="server"
            rowCount={meta?.total ?? 0}
            paginationModel={{ page: page - 1, pageSize: perPage }}
            onPaginationModelChange={(model) => {
              setPage(model.page + 1)
              setPerPage(model.pageSize)
            }}
            emptyMessage="Nenhuma rota cadastrada"
          />
        </div>
      </PageTransition>

      <Sheet
        open={sheet.open}
        onOpenChange={(open) => setSheet((s) => ({ ...s, open }))}
      >
        <SheetContent className="flex w-full max-w-lg flex-col sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {sheet.menuRoute ? "Editar Rota" : "Nova Rota"}
            </SheetTitle>
            <SheetDescription>
              {sheet.menuRoute
                ? "Atualize os dados da rota do menu."
                : "Preencha os dados para criar uma nova rota do menu."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 flex-1 overflow-hidden">
            <MenuRouteForm
              menuRoute={sheet.menuRoute}
              parentId={sheet.parentId}
              onSubmit={handleSubmit}
              isPending={isPending}
            />
          </div>

          {sheet.menuRoute && (
            <div className="mt-4 border-t pt-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium">Rotas filhas</h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  onClick={() =>
                    setSheet({
                      open: true,
                      menuRoute: null,
                      parentId: sheet.menuRoute!.id,
                    })
                  }
                >
                  <Plus className="size-3.5" />
                  Adicionar filho
                </Button>
              </div>
              <div className="space-y-1">
                {menuRoutes
                  .filter((route) => route.parent_id === sheet.menuRoute!.id)
                  .map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                    >
                      <span>{child.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() =>
                          setSheet({
                            open: true,
                            menuRoute: child,
                            parentId: null,
                          })
                        }
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                {children.length > 0 ? (
                  <div className="space-y-3">
                    <p>
                      A rota <strong>{deleting?.title}</strong> possui
                      rotas-filhas vinculadas. Remova ou edite cada uma antes de
                      excluir o pai:
                    </p>
                    <div className="space-y-1">
                      {children.map((child) => (
                        <div
                          key={child.id}
                          className="flex items-center justify-between rounded-md border px-3 py-2 text-sm text-foreground"
                        >
                          <span>{child.title}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                              onClick={() =>
                                setSheet({
                                  open: true,
                                  menuRoute: child,
                                  parentId: null,
                                })
                              }
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              disabled={isDeletingChild === child.id}
                              onClick={() => handleDeleteChild(child)}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <span>
                    Esta ação não pode ser desfeita. A rota{" "}
                    <strong>{deleting?.title}</strong> será removida
                    permanentemente.
                  </span>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={children.length > 0}
              onClick={handleDelete}
            >
              Excluir
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}
