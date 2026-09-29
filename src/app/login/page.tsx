'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Login() {
  const router = useRouter()
  const [erro, setErro] = useState('')
  const [a, setA] = useState(false)

  async function entrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setA(true); setErro('')
    const f = new FormData(e.currentTarget)
    const { error } = await createClient().auth.signInWithPassword({
      email: String(f.get('email')), password: String(f.get('password')),
    })
    if (error) { setErro('Email ou palavra-passe incorretos.'); setA(false); return }
    router.replace('/'); router.refresh()
  }

  return (
    <div className="login">
      <form onSubmit={entrar}>
        <h1>Entrar</h1>
        <p>Área privada.</p>
        <label><span>Email</span><input name="email" type="email" autoComplete="username" required /></label>
        <label><span>Palavra-passe</span><input name="password" type="password" autoComplete="current-password" required /></label>
        {erro && <p className="erro" role="alert">{erro}</p>}
        <button className="btn" disabled={a}>{a ? 'A entrar…' : 'Entrar'}</button>
      </form>
    </div>
  )
}
