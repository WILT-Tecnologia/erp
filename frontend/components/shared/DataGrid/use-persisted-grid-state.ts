import { useEffect, useState } from "react"
import type {
  GridColumnVisibilityModel,
  GridSortModel,
  GridFilterModel,
} from "@mui/x-data-grid"

interface PersistedGridState {
  columnVisibilityModel: GridColumnVisibilityModel
  sortModel: GridSortModel
  filterModel: GridFilterModel | undefined
}

const DEFAULT_STATE: PersistedGridState = {
  columnVisibilityModel: {},
  sortModel: [],
  filterModel: undefined,
}

function readPersistedState(key: string): PersistedGridState {
  if (typeof window === "undefined") return DEFAULT_STATE
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE
  } catch {
    return DEFAULT_STATE
  }
}

/**
 * Persiste visibilidade de colunas, ordenação e filtros de um DataGrid no
 * localStorage, por chave. Usado pelo wrapper de components/shared/DataGrid
 * para que cada listagem lembre a preferência do usuário entre sessões.
 */
export function usePersistedGridState(persistKey?: string) {
  const storageKey = persistKey ? `datagrid:${persistKey}` : null
  const [state, setState] = useState<PersistedGridState>(() =>
    storageKey ? readPersistedState(storageKey) : DEFAULT_STATE
  )

  useEffect(() => {
    if (!storageKey) return
    window.localStorage.setItem(storageKey, JSON.stringify(state))
  }, [storageKey, state])

  return {
    columnVisibilityModel: state.columnVisibilityModel,
    sortModel: state.sortModel,
    filterModel: state.filterModel,
    setColumnVisibilityModel: (columnVisibilityModel: GridColumnVisibilityModel) =>
      setState((s) => ({ ...s, columnVisibilityModel })),
    setSortModel: (sortModel: GridSortModel) => setState((s) => ({ ...s, sortModel })),
    setFilterModel: (filterModel: GridFilterModel) => setState((s) => ({ ...s, filterModel })),
  }
}
