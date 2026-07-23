export type FamilyStatus = "active" | "inactive"

export interface Family {
  id: string
  name: string
  leader: string
  members: number
  church: string
  address: string
  status: FamilyStatus
}
