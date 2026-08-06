import { create } from "zustand"
import type { Contact, PaginationMeta } from "@/types"

interface ContactState {
  contacts: Contact[]
  selectedContact: Contact | null
  pagination: PaginationMeta | null
  isLoading: boolean

  setContacts: (contacts: Contact[]) => void
  setSelectedContact: (contact: Contact | null) => void
  setPagination: (pagination: PaginationMeta | null) => void
  setLoading: (isLoading: boolean) => void
  addContact: (contact: Contact) => void
  updateContact: (id: string, data: Partial<Contact>) => void
  removeContact: (id: string) => void
}

export const useContactStore = create<ContactState>()((set) => ({
  contacts: [],
  selectedContact: null,
  pagination: null,
  isLoading: false,

  setContacts: (contacts) => set({ contacts }),

  setSelectedContact: (contact) => set({ selectedContact: contact }),

  setPagination: (pagination) => set({ pagination }),

  setLoading: (isLoading) => set({ isLoading }),

  addContact: (contact) =>
    set((state) => ({ contacts: [...state.contacts, contact] })),

  updateContact: (id, data) =>
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id ? { ...c, ...data } : c
      ),
      selectedContact:
        state.selectedContact?.id === id
          ? { ...state.selectedContact, ...data }
          : state.selectedContact,
    })),

  removeContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
      selectedContact:
        state.selectedContact?.id === id ? null : state.selectedContact,
    })),
}))
