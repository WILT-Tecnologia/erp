export type ChurchStatus = "active" | "inactive"

export interface Church {
  id: string
  name: string
  code: string
  city: string
  state: string
  pastor: string
  phone: string
  email: string
  members: number
  congregations: number
  founded_at: string
  status: ChurchStatus
}
