export type MemberStatus = "active" | "inactive" | "visitor"

export interface Member {
  id: string
  name: string
  email: string
  phone: string
  church: string
  department: string
  status: MemberStatus
  joined_at: string
}
