import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ESTADOS_PROJETO } from '@/lib/estados'
import { data as fmt, eur } from '@/lib/format'
import Estado from '@/components/Estado'

export default async function Projetos({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado = '' } = await searchParams
  const supabase = await createClient()
  let q = supabase.from('projetos').select('id,nome,estado,valor,prazo,clientes(nome)').eq('arquivado', false).order('criado_em', { ascending: false })
  if (estado) q = q.eq('estado', estado)
  const [{ data: lista }, { data: tar }] = await Promise.all([q, supabase.from('tarefas').select('projeto_id,feita')])
  const prog = (id: string) => {
    const t = tar?.filter(x => x.projeto_id === id) ?? []
    return t.length ? Math.round((100 * t.filter(x => x.feita).length) / t.length) : null
  }
  return (
    <>
      <div className="head"><h1>Projetos</h1><Link href="/projetos/novo" className="btn">Novo projeto</Link></div>
      <div className="tools">
        {['', ...ESTADOS_PROJETO].map(e => (
          <Link key={e || 'todos'} href={e ? `/projetos?estado=${e}` : '/projetos'} className={'chip' + (estado === e ? ' on' : '')}>{e || 'Todos'}</Link>
        ))}
      </div>
      <div className="row h p"><div>Projeto</div><div>Estado</div><div>Prazo</div><div>Valor</div><div>Progresso</div></div>
      {lista?.length ? lista.map(p => {
        const pr = prog(p.id)
        return (
          <Link key={p.id} href={`/projetos/${p.id}`} className="row p">
            <div>{p.nome}<span className="sub">{(p.clientes as unknown as { nome: string } | null)?.nome ?? 'Sem cliente'}</span></div>
            <Estado e={p.estado} />
            <div>{fmt(p.prazo)}</div>
            <div>{eur(p.valor)}</div>
            <div>{pr == null ? <span className="sub">Sem tarefas</span> : <><div className="bar"><i style={{ width: `${pr}%` }} /></div><span className="sub">{pr}%</span></>}</div>
          </Link>
        )
      }) : <div className="empty">Ainda não há projetos {estado ? 'com este estado' : ''}. Cria o primeiro em "Novo projeto".</div>}
    </>
  )
}