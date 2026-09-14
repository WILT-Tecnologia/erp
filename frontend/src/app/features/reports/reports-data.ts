export const revenueTrend = [
  { month: 'Mar', receita: 42000, despesa: 28000 },
  { month: 'Abr', receita: 45000, despesa: 30000 },
  { month: 'Mai', receita: 41000, despesa: 32000 },
  { month: 'Jun', receita: 50000, despesa: 31000 },
  { month: 'Jul', receita: 53000, despesa: 33000 },
  { month: 'Ago', receita: 58430, despesa: 35200 },
];

export const memberGrowth = [
  { month: 'Mar', novos: 8, visitantes: 22 },
  { month: 'Abr', novos: 11, visitantes: 30 },
  { month: 'Mai', novos: 9, visitantes: 25 },
  { month: 'Jun', novos: 14, visitantes: 38 },
  { month: 'Jul', novos: 16, visitantes: 41 },
  { month: 'Ago', novos: 19, visitantes: 47 },
];

export const membersByDepartment = [
  { name: 'Louvor', value: 24 },
  { name: 'Jovens', value: 38 },
  { name: 'Infantil', value: 30 },
  { name: 'Diaconia', value: 18 },
  { name: 'Missões', value: 12 },
];

export interface PeriodSummaryItem {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export const periodSummary: PeriodSummaryItem[] = [
  { label: 'Receita total', value: 'R$ 58.430', change: '+15%', positive: true },
  { label: 'Despesa total', value: 'R$ 35.200', change: '+4%', positive: false },
  { label: 'Saldo do mês', value: 'R$ 23.230', change: '+28%', positive: true },
  { label: 'Novos membros', value: '19', change: '+26%', positive: true },
  { label: 'Visitantes', value: '47', change: '-12%', positive: false },
  { label: 'Eventos realizados', value: '3', change: '+1', positive: true },
];

export interface ReportCard {
  icon: string;
  title: string;
  description: string;
}

export const reportCards: ReportCard[] = [
  { icon: 'groups', title: 'Relatório de Membros', description: 'Cadastros, status e crescimento por período' },
  { icon: 'payments', title: 'Relatório Financeiro', description: 'Receitas, despesas, balanço e DRE' },
  { icon: 'event', title: 'Relatório de Eventos', description: 'Participação, inscrições e check-in' },
  { icon: 'trending_up', title: 'Relatório CRM', description: 'Leads, conversões e follow-ups' },
  { icon: 'description', title: 'Relatório de Auditoria', description: 'Logs de acesso e alterações no sistema' },
  { icon: 'bar_chart', title: 'Relatório Executivo', description: 'Resumo gerencial completo mensal' },
];
