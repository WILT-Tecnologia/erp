export type LeadStage = "novo" | "contato" | "qualificado" | "proposta" | "ganho" | "perdido"

export interface StageConfig {
  id: LeadStage
  label: string
  colorVar: string
}

export const STAGES: StageConfig[] = [
  { id: "novo", label: "Novos Contatos", colorVar: "var(--muted-foreground)" },
  { id: "contato", label: "Em Contato", colorVar: "var(--info)" },
  { id: "qualificado", label: "Qualificados", colorVar: "#7C3AED" },
  { id: "proposta", label: "Proposta/Follow-up", colorVar: "var(--warning)" },
  { id: "ganho", label: "Convertidos", colorVar: "var(--success)" },
  { id: "perdido", label: "Perdidos", colorVar: "var(--destructive)" },
]

export interface LeadActivity {
  id: string
  type: "whatsapp" | "call" | "email" | "note"
  text: string
  date: string
  user: string
}

export interface LeadTask {
  id: string
  label: string
  due: string
  done: boolean
}

export interface CRMLead {
  id: string
  name: string
  email: string
  phone: string
  assignee: string
  status: LeadStage
  value: number
  tags: string[]
  notes: string
  updatedAt: string
  activities: LeadActivity[]
  tasks: LeadTask[]
}

export interface NewLeadInput {
  name: string
  email: string
  phone: string
  assignee: string
  value: number
  tags: string
}
