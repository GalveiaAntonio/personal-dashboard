'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { data as fmt } from '@/lib/format'

type Doc = { id: string; tipo: string; nome: string; caminho: string; criado_em: string }

export default function Documentos({ clienteId, docs }: { clienteId: string; docs: Doc[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [tipo, setTipo] = useState('Contrato')
  const [msg, setMsg] = useState('')
  const [a, setA] = useState(false)

  async function carregar(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target
    const files = Array.from(input.files ?? [])
    if (!files.length) return
    setA(true); setMsg('')
    for (const f of files) {
      const limpo = f.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w.\-]+/g, '_')
      const caminho = `${clienteId}/${Date.now()}-${limpo}`
      const up = await supabase.storage.from('documentos').upload(caminho, f)
      if (up.error) { setMsg(up.error.message); continue }
      const { error } = await supabase.from('documentos').insert({ cliente_id: clienteId, tipo, nome: f.name, caminho })
      if (error) setMsg(error.message)
    }
    input.value = ''
    setA(false); router.refresh()
  }

  async function abrir(caminho: string) {
    const w = window.open('', '_blank')
    const { data, error } = await supabase.storage.from('documentos').createSignedUrl(caminho, 60)
    if (error || !data) { w?.close(); setMsg(error?.message ?? 'Não foi possível abrir o ficheiro.'); return }
    if (w) w.location.href = data.signedUrl
  }

  async function remover(d: Doc) {
    if (!confirm('Remover este documento?')) return
    await supabase.storage.from('documentos').remove([d.caminho])
    await supabase.from('documentos').delete().eq('id', d.id)
    router.refresh()
  }

  return (
    <>
      <div className="tools">
        <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ width: 'auto' }}>
          <option>Contrato</option><option>Proposta</option><option>Outro</option>
        </select>
        <input type="file" multiple onChange={carregar} disabled={a} style={{ maxWidth: 320 }} />
        {a && <span className="sub">A carregar…</span>}
      </div>
      {msg && <p className="erro" role="alert">{msg}</p>}
      {docs.length ? docs.map(d => (
        <div className="doc" key={d.id}>
          <div>{d.nome}<span className="sub">{d.tipo}, {fmt(d.criado_em)}</span></div>
          <div className="acts" style={{ margin: 0 }}>
            <button className="btn ghost" onClick={() => abrir(d.caminho)}>Abrir</button>
            <button className="btn ghost" onClick={() => remover(d)}>Remover</button>
          </div>
        </div>
      )) : <div className="empty" style={{ padding: 0 }}>Ainda sem documentos. Escolhe o tipo e carrega o ficheiro.</div>}
    </>
  )
}
