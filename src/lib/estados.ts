export const ESTADOS = ['Lead', 'Contactado', 'Negociação', 'Cliente ativo', 'Cliente antigo', 'Perdido'] as const
export const ESTADOS_PROJETO = ['Planning', 'Briefing', 'Design', 'Development', 'Review', 'Revisions', 'Finalização', 'Entregue', 'Cancelado'] as const
export const PRIORIDADES = ['Baixa', 'Média', 'Alta'] as const

export const COR: Record<string, string> = {
  'Lead': '#8A8A8A', 'Contactado': '#5B9BF5', 'Negociação': '#E0A63A',
  'Cliente ativo': '#4CC38A', 'Cliente antigo': '#6B6B6B', 'Perdido': '#F0645A',
  'Planning': '#8A8A8A', 'Briefing': '#A0A0A0', 'Design': '#9D8CE6', 'Development': '#5B9BF5', 'Review': '#E0A63A',
  'Revisions': '#D08C2E', 'Finalização': '#3CC4CF', 'Entregue': '#4CC38A', 'Cancelado': '#F0645A',
  'Baixa': '#8A8A8A', 'Média': '#E0A63A', 'Alta': '#F0645A',
}