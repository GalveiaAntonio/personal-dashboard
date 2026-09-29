import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ESTADOS } from '@/lib/estados'
import Estado from '@/components/Estado'

export default async function Inicio() {
  const supabase = await createClient()
  const { data } = await supabase.from('clientes').select('id,nome,empresa,estado,criado_em').eq('arquivado', false)
  const n = (e: string) => data?.filter(c => c.estado === e).length ?? 0
  const ultimos = [...(data ?? [])].sort((a, b) => b.criado_em.localeCompare(a.criado_em)).slice(0, 4)
  return (
    <>
      <div className="head"><h1>Início</h1><Link href="/clientes/novo" className="btn">Novo cliente</Link></div>
      <div className="stats">
        {ESTADOS.map(e => <div className="stat" key={e}><b>{n(e)}</b><span>{e}</span></div>)}
      </div>
      <h2 style={{ marginBottom: 8 }}>Últimos clientes adicionados</h2>
      {ultimos.length ? ultimos.map(c => (
        <Link key={c.id} href={`/clientes/${c.id}`} className="row" style={{ gridTemplateColumns: '2fr 1fr' }}>
          <div>{c.nome}<span className="sub">{c.empresa}</span></div><Estado e={c.estado} />
        </Link>
      )) : <div className="empty" style={{ padding: 0 }}>Ainda não há clientes. Cria o primeiro em "Novo cliente".</div>}
    </>
  )
}
