"use client"

import { useMemo } from "react"
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  type GridColDef,
  type GridPaginationModel,
  type GridSortModel,
  type GridFilterModel,
  type GridRowIdGetter,
  type GridRowSelectionModel,
  type GridValidRowModel,
} from "@mui/x-data-grid"
import { ptBR } from "@mui/x-data-grid/locales"
import { Inbox, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePersistedGridState } from "./use-persisted-grid-state"

interface DataGridProps<T extends GridValidRowModel> {
  rows: T[]
  columns: GridColDef<T>[]
  getRowId?: GridRowIdGetter<T>
  loading?: boolean
  /** Chave única para persistir colunas/ordenação/filtros no localStorage. */
  persistKey?: string
  emptyMessage?: string
  /** Rótulo e handler do botão de criação exibido na toolbar. */
  newLabel?: string
  onNew?: () => void
  /** Paginação: client-side por padrão, ou server-side controlada pelo caller. */
  paginationMode?: "client" | "server"
  rowCount?: number
  paginationModel?: GridPaginationModel
  onPaginationModelChange?: (model: GridPaginationModel) => void
  pageSizeOptions?: number[]
  sortingMode?: "client" | "server"
  onSortModelChange?: (model: GridSortModel) => void
  filterMode?: "client" | "server"
  onFilterModelChange?: (model: GridFilterModel) => void
  checkboxSelection?: boolean
  rowSelectionModel?: GridRowSelectionModel
  onRowSelectionModelChange?: (model: GridRowSelectionModel) => void
  onRowClick?: (row: T) => void
  height?: number | string
  /**
   * Quando informado, a busca da toolbar passa a ser controlada pelo
   * caller (server-side) em vez do quick filter client-side padrão do
   * MUI — necessário quando `rows` já vem paginado pelo backend.
   */
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
}

function Toolbar({
  newLabel,
  onNew,
  searchValue,
  onSearchChange,
  searchPlaceholder,
}: {
  newLabel?: string
  onNew?: () => void
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
}) {
  return (
    <GridToolbarContainer className="flex items-center gap-2 border-b border-border !p-3">
      <div className="flex flex-1 items-center gap-2">
        {onSearchChange ? (
          <div className="relative w-full max-w-[280px]">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchValue ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder ?? "Pesquisar..."}
              className="h-8 pl-8 text-sm"
            />
          </div>
        ) : (
          <GridToolbarQuickFilter
            className="!m-0 w-full max-w-[280px]"
            slotProps={{
              root: { placeholder: searchPlaceholder ?? "Pesquisar...", size: "small" },
            }}
          />
        )}
      </div>
      <GridToolbarFilterButton />
      <GridToolbarColumnsButton />
      <GridToolbarExport
        slotProps={{ button: { size: "small" } }}
        printOptions={{ disableToolbarButton: true }}
      />
      {onNew && (
        <Button size="sm" onClick={onNew} className="ml-1 gap-1.5">
          <Plus className="size-4" />
          {newLabel ?? "Novo"}
        </Button>
      )}
    </GridToolbarContainer>
  )
}

function EmptyState({ message }: { message?: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
      <Inbox className="size-8 opacity-50" />
      <span className="text-sm">{message ?? "Nenhum registro encontrado"}</span>
    </div>
  )
}

/**
 * Wrapper único do MUI X Data Grid usado por toda a aplicação (ver
 * AGENTS.md — nenhuma página deve instanciar o DataGrid diretamente).
 * Aplica o tema visual do Shadcn/Tailwind, localização pt-BR, toolbar
 * padrão (busca, filtro, colunas, exportação, ação "Novo"), loading e
 * empty state, e persiste colunas/ordenação/filtros por `persistKey`.
 */
export function DataGridWrapper<T extends GridValidRowModel>({
  rows,
  columns,
  getRowId,
  loading,
  persistKey,
  emptyMessage,
  newLabel,
  onNew,
  paginationMode = "client",
  rowCount,
  paginationModel,
  onPaginationModelChange,
  pageSizeOptions = [10, 25, 50],
  sortingMode = "client",
  onSortModelChange,
  filterMode = "client",
  onFilterModelChange,
  checkboxSelection,
  rowSelectionModel,
  onRowSelectionModelChange,
  onRowClick,
  height = 560,
  searchValue,
  onSearchChange,
  searchPlaceholder,
}: DataGridProps<T>) {
  const persisted = usePersistedGridState(persistKey)

  const slots = useMemo(
    () => ({
      toolbar: () => (
        <Toolbar
          newLabel={newLabel}
          onNew={onNew}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
        />
      ),
      noRowsOverlay: () => <EmptyState message={emptyMessage} />,
      noResultsOverlay: () => <EmptyState message="Nenhum resultado para o filtro aplicado" />,
    }),
    [newLabel, onNew, emptyMessage, searchValue, onSearchChange, searchPlaceholder]
  )

  return (
    <div
      style={{ height }}
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
        loading={loading}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
        showToolbar
        slots={slots}
        disableRowSelectionOnClick
        checkboxSelection={checkboxSelection}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={onRowSelectionModelChange}
        onRowClick={onRowClick ? (params) => onRowClick(params.row) : undefined}
        paginationMode={paginationMode}
        rowCount={paginationMode === "server" ? rowCount : undefined}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={pageSizeOptions}
        sortingMode={sortingMode}
        sortModel={persisted.sortModel}
        onSortModelChange={(model) => {
          persisted.setSortModel(model)
          onSortModelChange?.(model)
        }}
        filterMode={filterMode}
        filterModel={persisted.filterModel}
        onFilterModelChange={(model) => {
          persisted.setFilterModel(model)
          onFilterModelChange?.(model)
        }}
        columnVisibilityModel={persisted.columnVisibilityModel}
        onColumnVisibilityModelChange={persisted.setColumnVisibilityModel}
        sx={{
          border: "none",
          fontFamily: "var(--font-inter), system-ui, sans-serif",
          "--DataGrid-rowBorderColor": "var(--border)",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "var(--muted)",
            borderBottom: "1px solid var(--border)",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 600,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--muted-foreground)",
          },
          "& .MuiDataGrid-cell": {
            fontSize: "0.875rem",
            color: "var(--foreground)",
            borderBottom: "1px solid var(--border)",
          },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "var(--muted)",
          },
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "var(--accent)",
          },
          "& .MuiDataGrid-row.Mui-selected:hover": {
            backgroundColor: "var(--accent)",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid var(--border)",
            color: "var(--muted-foreground)",
          },
          "& .MuiDataGrid-overlay": {
            backgroundColor: "var(--card)",
          },
          "& .MuiTablePagination-root": {
            color: "var(--muted-foreground)",
          },
        }}
      />
    </div>
  )
}
