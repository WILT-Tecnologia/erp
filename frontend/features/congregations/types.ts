export type CongregationStatus = "active" | "inactive"

export interface Congregation {
  id: string
  name: string
  code: string
  church: string
  leader: string
  city: string
  state: string
  members: number
  phone: string
  status: CongregationStatus
}
