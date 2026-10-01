import { createClient } from '@/lib/supabase/server'
import { PRIORIDADES } from '@/lib/estados'
import { hoje } from '@/lib/format'
import Tarefa from '@/components/Tarefa'
import { criarTarefa } from '../projetos/actions'

export default async function Tarefas() {
  const supabase = await createClient()
  const [{ data: ts }, { data: projetos }] = await Promise.all([
    supabase.from('tarefas').select('*, projetos(nome)').order('prazo', { ascending: true, nullsFirst: false }),
    supabase.from('projetos').select('id,nome').eq('arquivado', false).order('nome'),
  ])
  const h = hoje()
  const abertas = ts?.filter(t => !t.feita) ?? []
  const feitas = (ts?.filter(t => t.feita) ?? []).slice(-10).reverse()
  const grupos: [string, typeof abertas][] = [
    ['Atrasadas', abertas.filter(t => t.prazo && t.prazo < h)],
    ['Hoje', abertas.filter(t => t.prazo === h)],
    ['Próximas', abertas.filter(t => t.prazo && t.prazo > h)],
    ['Sem data', abertas.filter(t => !t.prazo)],
  ]
  return (
    <>
      <div className="head"><h1>Tarefas</h1></div>
      <form action={criarTarefa.bind(null, null)} className="sec">
        <input name="titulo" placeholder="Nova tarefa (ex.: Responder ao João)" required />
        <div className="acts" style={{ marginTop: 8 }}>
          <select name="projeto_id" style={{ width: 'auto' }}><option value="">Sem projeto</option>{projetos?.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}</select>
          <input type="date" name="prazo" style={{ width: 'auto' }} />
          <select name="prioridade" defaultValue="Média" style={{ width: 'auto' }}>{PRIORIDADES.map(x => <option key={x}>{x}</option>)}</select>
          <button className="btn">Adicionar</button>
        </div>
      </form>
      {grupos.filter(([, l]) => l.length).map(([nome, l]) => (
        <section className="sec" key={nome}><h2>{nome}</h2>{l.map(t => <Tarefa key={t.id} t={t} contexto={t.projetos?.nome} />)}</section>
      ))}
      {!abertas.length && <div className="empty">Sem tarefas por fazer. Adiciona a primeira acima.</div>}
      {feitas.length > 0 && (
        <details><summary style={{ cursor: 'pointer', color: 'var(--muted)' }}>Concluídas recentemente</summary>
          {feitas.map(t => <Tarefa key={t.id} t={t} contexto={t.projetos?.nome} />)}
        </details>
      )}
    </>
  )
}