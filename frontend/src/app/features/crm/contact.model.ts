export type ContactStage = 'novo' | 'contato' | 'qualificado' | 'proposta' | 'ganho' | 'perdido';

export interface StageConfig {
  id: ContactStage;
  label: string;
  colorVar: string;
}

export const STAGES: StageConfig[] = [
  { id: 'novo', label: 'Novos Contatos', colorVar: 'var(--mat-sys-outline)' },
  { id: 'contato', label: 'Em Contato', colorVar: 'var(--mat-sys-primary)' },
  { id: 'qualificado', label: 'Qualificados', colorVar: 'var(--mat-sys-tertiary)' },
  { id: 'proposta', label: 'Proposta/Follow-up', colorVar: 'var(--mat-sys-primary-fixed-dim)' },
  { id: 'ganho', label: 'Convertidos', colorVar: 'var(--mat-sys-secondary)' },
  { id: 'perdido', label: 'Perdidos', colorVar: 'var(--mat-sys-error)' },
];

export interface ContactActivity {
  id: string;
  type: 'whatsapp' | 'call' | 'email' | 'note';
  text: string;
  user: string | null;
  occurred_at: string | null;
}

export interface ContactTask {
  id: string;
  label: string;
  due_date: string | null;
  done: boolean;
}

export interface Contact {
  id: string;
  organization_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  assignee: string | null;
  status: ContactStage;
  value: number;
  tags: string[];
  notes: string | null;
  activities: ContactActivity[];
  tasks: ContactTask[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    [key: string]: unknown;
  };
  links?: Record<string, unknown>;
}

export interface ContactFormValue {
  organization_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  assignee?: string | null;
  status: ContactStage;
  value?: number;
  tags?: string[];
  notes?: string | null;
}

export interface ContactActivityFormValue {
  type: ContactActivity['type'];
  text: string;
  user?: string | null;
}

export interface ContactTaskFormValue {
  label: string;
  due_date?: string | null;
  done?: boolean;
}

export const ASSIGNEES = ['Pastor Carlos', 'Diácono João', 'Evangelista Ana', 'Secretária Maria', 'Tesoureiro Carlos'];
