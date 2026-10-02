'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Res = { href: string; nome: string; tipo: string }

export default function Pesquisa() {
  const [supabase] = useState(() => createClient())
  const ref = useRef<HTMLInputElement>(null)
  const [q, setQ] = useState('')
  const [res, setRes] = useState<Res[]>([])

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); ref.current?.focus() }
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  useEffect(() => {
    const t = q.trim().replace(/[%,()]/g, ' ').trim()
    if (!t) { setRes([]); return }
    const espera = setTimeout(async () => {
      const [c, p, k] = await Promise.all([
        supabase.from('clientes').select('id,nome').eq('arquivado', false).or(`nome.ilike.%${t}%,empresa.ilike.%${t}%`).limit(5),
        supabase.from('projetos').select('id,nome').eq('arquivado', false).ilike('nome', `%${t}%`).limit(5),
        supabase.from('tarefas').select('id,titulo,projeto_id').ilike('titulo', `%${t}%`).limit(5),
      ])
      setRes([
        ...(c.data ?? []).map(x => ({ href: `/clientes/${x.id}`, nome: x.nome, tipo: 'Cliente' })),
        ...(p.data ?? []).map(x => ({ href: `/projetos/${x.id}`, nome: x.nome, tipo: 'Projeto' })),
        ...(k.data ?? []).map(x => ({ href: x.projeto_id ? `/projetos/${x.projeto_id}` : '/tarefas', nome: x.titulo, tipo: 'Tarefa' })),
      ])
    }, 250)
    return () => clearTimeout(espera)
  }, [q, supabase])

  const fechar = () => { setQ(''); setRes([]) }

  return (
    <div className="srch">
      <input ref={ref} value={q} onChange={e => setQ(e.target.value)} placeholder="Pesquisar" autoComplete="off"
        onKeyDown={e => { if (e.key === 'Escape') fechar() }} />
      <kbd>Ctrl + K</kbd>
      {q.trim() && (
        <div id="gres">
          {res.length
            ? res.map(r => <Link key={r.tipo + r.href + r.nome} href={r.href} onClick={fechar}>{r.nome} <small>{r.tipo}</small></Link>)
            : <div className="vazio">Sem resultados</div>}
        </div>
      )}
    </div>
  )
}