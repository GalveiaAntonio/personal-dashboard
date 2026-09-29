import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ESTADOS } from '@/lib/estados'
import { data as fmt } from '@/lib/format'
import Estado from '@/components/Estado'

export default async function Clientes({ searchParams }: { searchParams: Promise<{ q?: string; estado?: string }> }) {
  const { q = '', estado = '' } = await searchParams
  const supabase = await createClient()
  let query = supabase.from('clientes').select('id,nome,empresa,email,estado,ultimo_contacto')
    .eq('arquivado', false).order('criado_em', { ascending: false })
  if (estado) query = query.eq('estado', estado)
  const termo = q.replace(/[%,()]/g, ' ').trim()
  if (termo) query = query.or(`nome.ilike.%${termo}%,empresa.ilike.%${termo}%,email.ilike.%${termo}%`)
  const { data: lista } = await query

  const href = (e: string) => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (e) p.set('estado', e)
    const s = p.toString()
    return '/clientes' + (s ? '?' + s : '')
  }

  return (
    <>
      <div className="head"><h1>Clientes</h1><Link href="/clientes/novo" className="btn">Novo cliente</Link></div>
      <form className="tools">
        <input name="q" defaultValue={q} placeholder="Pesquisar por nome, empresa ou email" style={{ maxWidth: 280 }} />
        {estado && <input type="hidden" name="estado" value={estado} />}
        <button className="btn ghost">Pesquisar</button>
        {['', ...ESTADOS].map(e => (
          <Link key={e || 'todos'} href={href(e)} className={'chip' + (estado === e ? ' on' : '')}>{e || 'Todos'}</Link>
        ))}
      </form>
      <div className="row h"><div>Cliente</div><div>Estado</div><div>Último contacto</div><div>Email</div></div>
      {lista?.length ? lista.map(c => (
        <Link key={c.id} href={`/clientes/${c.id}`} className="row">
          <div>{c.nome}<span className="sub">{c.empresa}</span></div>
          <Estado e={c.estado} />
          <div>{fmt(c.ultimo_contacto)}</div>
          <div>{c.email}</div>
        </Link>
      )) : <div className="empty">Nenhum cliente com estes filtros. Limpa a pesquisa ou cria um novo cliente.</div>}
    </>
  )
}
