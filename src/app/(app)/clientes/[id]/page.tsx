import { Fragment } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ESTADOS } from '@/lib/estados'
import { data as fmt } from '@/lib/format'
import Estado from '@/components/Estado'
import FormCliente from '@/components/FormCliente'
import Documentos from '@/components/Documentos'
import { adicionarNota, arquivarCliente, atualizarCliente, mudarEstado } from '../actions'

export default async function Ficha({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ editar?: string }>
}) {
  const { id } = await params
  const { editar } = await searchParams
  const supabase = await createClient()
  const { data: c } = await supabase.from('clientes').select('*').eq('id', id).eq('arquivado', false).maybeSingle()
  if (!c) notFound()
  const { data: notas } = await supabase.from('notas').select('*').eq('cliente_id', id).order('criado_em', { ascending: false })
  const { data: docs } = await supabase.from('documentos').select('*').eq('cliente_id', id).order('criado_em', { ascending: false })

  const dados: [string, string | null][] = [
    ['Empresa', c.empresa], ['Email', c.email], ['Telefone', c.telefone], ['Website', c.website],
    ['NIF', c.nif], ['Morada', c.morada], ['País', c.pais],
    ['Primeiro contacto', c.primeiro_contacto ? fmt(c.primeiro_contacto) : null],
    ['Último contacto', c.ultimo_contacto ? fmt(c.ultimo_contacto) : null],
  ]

  return (
    <>
      <Link href="/clientes" className="back">‹ Clientes</Link>
      <div className="head">
        <div><h1>{c.nome}</h1><Estado e={c.estado} /></div>
        <form action={mudarEstado.bind(null, id)} className="acts" style={{ margin: 0 }}>
          <select name="estado" defaultValue={c.estado} style={{ width: 'auto' }}>{ESTADOS.map(e => <option key={e}>{e}</option>)}</select>
          <button className="btn ghost">Mudar estado</button>
        </form>
      </div>
      <div className="ficha">
        <div>
          <div className="head" style={{ marginBottom: 14 }}>
            <h2>Dados</h2>
            {!editar && <Link href={`/clientes/${id}?editar=1`} className="btn ghost">Editar</Link>}
          </div>
          {editar
            ? <FormCliente c={c} action={atualizarCliente.bind(null, id)} cancelar={`/clientes/${id}`} />
            : <dl>{dados.map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v || <span style={{ color: 'var(--muted)' }}>—</span>}</dd></Fragment>)}</dl>}
          <details style={{ marginTop: 28 }}>
            <summary style={{ cursor: 'pointer', color: 'var(--muted)' }}>Arquivar cliente</summary>
            <p style={{ color: 'var(--muted)' }}>O cliente deixa de aparecer na lista, mas os dados e as notas ficam guardados.</p>
            <form action={arquivarCliente.bind(null, id)}><button className="btn ghost" style={{ color: 'var(--danger)' }}>Arquivar</button></form>
          </details>
        </div>
        <div>
          <h2 style={{ marginBottom: 14 }}>Notas</h2>
          <form action={adicionarNota.bind(null, id)}>
            <textarea name="texto" rows={3} placeholder="Escreve uma nota sobre este cliente" required />
            <div className="acts" style={{ margin: '8px 0 20px' }}><button className="btn">Guardar nota</button></div>
          </form>
          {notas?.length
            ? notas.map(n => <div className="note" key={n.id}><small>{fmt(n.criado_em)}</small><br />{n.texto}</div>)
            : <div className="empty" style={{ padding: 0 }}>Ainda sem notas. Regista aqui o que combinaste com o cliente.</div>}
        </div>
        <div className="full">
          <h2 style={{ marginBottom: 6 }}>Contratos e propostas</h2>
          <p className="sub" style={{ marginBottom: 12 }}>Guarda aqui os documentos já preenchidos deste cliente (PDF ou Word).</p>
          <Documentos clienteId={id} docs={docs ?? []} />
        </div>
      </div>
    </>
  )
}
