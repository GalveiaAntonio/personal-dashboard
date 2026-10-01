export const data = (d?: string | null) =>
  d ? new Date(d.length === 10 ? d + 'T00:00' : d).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

export const eur = (n?: number | string | null) =>
  n == null || n === '' ? '—' : new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(Number(n))

export const hoje = () => new Date().toLocaleDateString('sv-SE')