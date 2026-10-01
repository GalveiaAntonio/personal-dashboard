import { COR } from '@/lib/estados'
import { data as fmt, hoje } from '@/lib/format'
import { alternarTarefa, apagarTarefa } from '@/app/(app)/projetos/actions'

type T = { id: string; titulo: string; prazo: string | null; prioridade: string; feita: boolean }

export default function Tarefa({ t, contexto }: { t: T; contexto?: string }) {
  const atrasada = !t.feita && !!t.prazo && t.prazo < hoje()
  const linha = [contexto, t.prazo ? (atrasada ? 'Atrasada, ' : 'Prazo: ') + fmt(t.prazo) : null].filter(Boolean).join(' | ')
  return (
    <div className="tarefa">
      <form action={alternarTarefa.bind(null, t.id, !t.feita)}>
        <button className={'check' + (t.feita ? ' on' : '')} aria-label={t.feita ? 'Marcar como por fazer' : 'Marcar como feita'}>{t.feita ? '✓' : ''}</button>
      </form>
      <div className={t.feita ? 'feita' : ''}>{t.titulo}{linha && <span className={'sub' + (atrasada ? ' atraso' : '')}>{linha}</span>}</div>
      <span className="badge" style={{ '--c': COR[t.prioridade] } as React.CSSProperties}>{t.prioridade}</span>
      <form action={apagarTarefa.bind(null, t.id)}><button className="btn ghost" aria-label="Apagar tarefa">Apagar</button></form>
    </div>
  )
}