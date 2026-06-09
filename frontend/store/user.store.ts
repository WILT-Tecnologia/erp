import { create } from "zustand"
import type { User, PaginationMeta } from "@/types"

interface UserState {
  users: User[]
  selectedUser: User | null
  pagination: PaginationMeta | null
  isLoading: boolean

  setUsers: (users: User[]) => void
  setSelectedUser: (user: User | null) => void
  setPagination: (pagination: PaginationMeta | null) => void
  setLoading: (isLoading: boolean) => void
  addUser: (user: User) => void
  updateUser: (id: number, userData: Partial<User>) => void
  removeUser: (id: number) => void
}

export const useUserStore = create<UserState>()((set) => ({
  users: [],
  selectedUser: null,
  pagination: null,
  isLoading: false,

  setUsers: (users) => set({ users }),

  setSelectedUser: (user) => set({ selectedUser: user }),

  setPagination: (pagination) => set({ pagination }),

  setLoading: (isLoading) => set({ isLoading }),

  addUser: (user) =>
    set((state) => ({ users: [...state.users, user] })),

  updateUser: (id, userData) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, ...userData } : u
      ),
      selectedUser:
        state.selectedUser?.id === id
          ? { ...state.selectedUser, ...userData }
          : state.selectedUser,
    })),

  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
      selectedUser:
        state.selectedUser?.id === id ? null : state.selectedUser,
    })),
}))
