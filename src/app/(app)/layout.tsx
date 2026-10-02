import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import Avatar from '@/components/Avatar'
import Pesquisa from '@/components/Pesquisa'

async function sair() {
  'use server'
  await (await createClient()).auth.signOut()
  redirect('/login')
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <aside>
        <div className="top"><Avatar /></div>
        <Pesquisa />
        <Nav />
        <form action={sair} className="out"><button className="lnk">Terminar Sessão</button></form>
      </aside>
      <main>{children}</main>
    </div>
  )
}