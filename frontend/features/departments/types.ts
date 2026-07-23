export type DepartmentStatus = "active" | "inactive"

export interface Department {
  id: string
  name: string
  church: string
  leader: string
  members: number
  description: string
  status: DepartmentStatus
}
