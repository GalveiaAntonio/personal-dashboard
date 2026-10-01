export const ESTADOS = ['Lead', 'Contactado', 'Negociação', 'Cliente ativo', 'Cliente antigo', 'Perdido'] as const

export const COR: Record<string, string> = {
  'Lead': '#64748B', 'Contactado': '#1F5FBF', 'Negociação': '#C98A0B',
  'Cliente ativo': '#2E7D5B', 'Cliente antigo': '#94A3B8', 'Perdido': '#C0392B',
}

export const ESTADOS_PROJETO = ['Planning', 'Briefing', 'Design', 'Development', 'Review', 'Revisions', 'Finalização', 'Entregue', 'Cancelado'] as const
export const PRIORIDADES = ['Baixa', 'Média', 'Alta'] as const

Object.assign(COR, {
  'Planning': '#64748B', 'Briefing': '#8494A7', 'Design': '#6B5CB5', 'Development': '#1F5FBF', 'Review': '#C98A0B',
  'Revisions': '#B7791F', 'Finalização': '#0E7C86', 'Entregue': '#2E7D5B', 'Cancelado': '#C0392B',
  'Baixa': '#8494A7', 'Média': '#C98A0B', 'Alta': '#C0392B',
})