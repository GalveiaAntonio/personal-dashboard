'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const txt = (f: FormData, k: string) => String(f.get(k) ?? '').trim() || null

function dados(f: FormData) {
  const nome = String(f.get('nome') ?? '').trim()
  if (!nome) throw new Error('O nome é obrigatório.')
  return {
    nome, empresa: txt(f, 'empresa'), email: txt(f, 'email'), telefone: txt(f, 'telefone'),
    website: txt(f, 'website'), nif: txt(f, 'nif'), morada: txt(f, 'morada'), pais: txt(f, 'pais'),
    estado: String(f.get('estado')),
    primeiro_contacto: txt(f, 'primeiro_contacto') ?? undefined,
    ultimo_contacto: txt(f, 'ultimo_contacto'),
  }
}

function atualizar() {
  revalidatePath('/'); revalidatePath('/clientes')
}

export async function criarCliente(f: FormData) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('clientes').insert(dados(f)).select('id').single()
  if (error) throw new Error(error.message)
  atualizar()
  redirect(`/clientes/${data.id}`)
}

export async function atualizarCliente(id: string, f: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('clientes').update(dados(f)).eq('id', id)
  if (error) throw new Error(error.message)
  atualizar()
  redirect(`/clientes/${id}`)
}

export async function mudarEstado(id: string, f: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('clientes').update({ estado: String(f.get('estado')) }).eq('id', id)
  if (error) throw new Error(error.message)
  atualizar(); revalidatePath(`/clientes/${id}`)
}

export async function arquivarCliente(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('clientes').update({ arquivado: true }).eq('id', id)
  if (error) throw new Error(error.message)
  atualizar()
  redirect('/clientes')
}

export async function adicionarNota(id: string, f: FormData) {
  const texto = String(f.get('texto') ?? '').trim()
  if (!texto) return
  const supabase = await createClient()
  const { error } = await supabase.from('notas').insert({ cliente_id: id, texto })
  if (error) throw new Error(error.message)
  revalidatePath(`/clientes/${id}`)
}
