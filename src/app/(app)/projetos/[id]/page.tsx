import { Fragment } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ESTADOS_PROJETO, PRIORIDADES } from '@/lib/estados'
import { data as fmt, eur } from '@/lib/format'
import Estado from '@/components/Estado'
import FormProjeto from '@/components/FormProjeto'
import Tarefa from '@/components/Tarefa'
import { arquivarProjeto, atualizarProjeto, criarTarefa, mudarEstadoProjeto } from '../actions'

export default async function Ficha({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ editar?: string }>
}) {
  const { id } = await params
  const { editar } = await searchParams
  const supabase = await createClient()
  const { data: p } = await supabase.from('projetos').select('*, clientes(id,nome)').eq('id', id).eq('arquivado', false).maybeSingle()
  if (!p) notFound()
  const { data: tarefas } = await supabase.from('tarefas').select('*').eq('projeto_id', id)
    .order('feita').order('prazo', { ascending: true, nullsFirst: false })
  const { data: clientes } = editar
    ? await supabase.from('clientes').select('id,nome,empresa').eq('arquivado', false).order('nome')
    : { data: [] }

  const total = tarefas?.length ?? 0
  const feitas = tarefas?.filter(t => t.feita).length ?? 0
  const pr = total ? Math.round((100 * feitas) / total) : null
  const dl: [string, React.ReactNode][] = [
    ['Cliente', p.clientes ? <Link href={`/clientes/${p.clientes.id}`} style={{ color: 'var(--pri)' }}>{p.clientes.nome}</Link> : null],
    ['Valor', p.valor != null ? eur(p.valor) : null],
    ['Prazo', p.prazo ? fmt(p.prazo) : null],
    ['Progresso', pr == null ? null : `${pr}% (${feitas} de ${total} tarefas)`],
    ['Descrição', p.descricao],
  ]

  return (
    <>
      <Link href="/projetos" className="back">‹ Projetos</Link>
      <div className="head">
        <div><h1>{p.nome}</h1><Estado e={p.estado} /></div>
        <form action={mudarEstadoProjeto.bind(null, id)} className="acts" style={{ margin: 0 }}>
          <select name="estado" defaultValue={p.estado} style={{ width: 'auto' }}>{ESTADOS_PROJETO.map(e => <option key={e}>{e}</option>)}</select>
          <button className="btn ghost">Mudar estado</button>
        </form>
      </div>
      <div className="ficha">
        <div>
          <div className="head" style={{ marginBottom: 14 }}>
            <h2>Dados</h2>
            {!editar && <Link href={`/projetos/${id}?editar=1`} className="btn ghost">Editar</Link>}
          </div>
          {editar
            ? <FormProjeto p={p} clientes={clientes ?? []} action={atualizarProjeto.bind(null, id)} cancelar={`/projetos/${id}`} />
            : <dl>{dl.map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v || <span style={{ color: 'var(--muted)' }}>—</span>}</dd></Fragment>)}</dl>}
          <details style={{ marginTop: 28 }}>
            <summary style={{ cursor: 'pointer', color: 'var(--muted)' }}>Arquivar projeto</summary>
            <p style={{ color: 'var(--muted)' }}>O projeto deixa de aparecer na lista, mas os dados e as tarefas ficam guardados.</p>
            <form action={arquivarProjeto.bind(null, id)}><button className="btn ghost" style={{ color: 'var(--danger)' }}>Arquivar</button></form>
          </details>
        </div>
        <div>
          <h2 style={{ marginBottom: 14 }}>Tarefas</h2>
          <form action={criarTarefa.bind(null, id)} className="sec">
            <input name="titulo" placeholder="Nova tarefa (ex.: Homepage)" required />
            <div className="acts" style={{ marginTop: 8 }}>
              <input type="date" name="prazo" style={{ width: 'auto' }} />
              <select name="prioridade" defaultValue="Média" style={{ width: 'auto' }}>{PRIORIDADES.map(x => <option key={x}>{x}</option>)}</select>
              <button className="btn">Adicionar</button>
            </div>
          </form>
          {tarefas?.length ? tarefas.map(t => <Tarefa key={t.id} t={t} />) : <div className="empty" style={{ padding: 0 }}>Ainda sem tarefas. Divide o projeto em passos (wireframe, homepage, testes, deploy…).</div>}
        </div>
      </div>
    </>
  )
}