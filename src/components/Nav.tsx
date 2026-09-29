'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ativos = [{ href: '/', nome: 'Início' }, { href: '/clientes', nome: 'Clientes' }]
const brevemente = ['Leads', 'Projetos', 'Tarefas', 'Propostas', 'Faturas', 'Despesas']

export default function Nav() {
  const p = usePathname()
  return (
    <>
      {ativos.map(l => (
        <Link key={l.href} href={l.href} className={(l.href === '/' ? p === '/' : p.startsWith(l.href)) ? 'on' : ''}>{l.nome}</Link>
      ))}
      {brevemente.map(n => <div key={n} className="soon">{n}<small>em breve</small></div>)}
    </>
  )
}
