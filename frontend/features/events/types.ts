export type EventStatus = "scheduled" | "ongoing" | "completed" | "cancelled"

export type EventCategory =
  | "Culto"
  | "Conferência"
  | "Retiro"
  | "Educação"
  | "Música"
  | "Batismo"
  | "Seminário"

export interface Event {
  id: string
  title: string
  church: string
  category: EventCategory
  date: string
  location: string
  participants: number
  capacity: number
  status: EventStatus
}
