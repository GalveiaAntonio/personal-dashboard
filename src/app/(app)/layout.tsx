import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'

async function sair() {
  'use server'
  await (await createClient()).auth.signOut()
  redirect('/login')
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <aside>
        <div className="brand">Painel</div>
        <Nav />
        <form action={sair}><button className="lnk">Terminar sessão</button></form>
      </aside>
      <main>{children}</main>
    </div>
  )
}
