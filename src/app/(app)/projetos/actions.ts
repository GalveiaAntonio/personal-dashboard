'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const txt = (f: FormData, k: string) => String(f.get(k) ?? '').trim() || null

function refrescar() {
  revalidatePath('/projetos'); revalidatePath('/tarefas'); revalidatePath('/')
}

function dados(f: FormData) {
  const nome = String(f.get('nome') ?? '').trim()
  if (!nome) throw new Error('O nome é obrigatório.')
  const v = String(f.get('valor') ?? '').replace(',', '.').trim()
  if (v && isNaN(Number(v))) throw new Error('O valor tem de ser um número.')
  return { nome, cliente_id: txt(f, 'cliente_id'), estado: String(f.get('estado')), valor: v ? Number(v) : null, prazo: txt(f, 'prazo'), descricao: txt(f, 'descricao') }
}

export async function criarProjeto(f: FormData) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('projetos').insert(dados(f)).select('id').single()
  if (error) throw new Error(error.message)
  refrescar()
  redirect(`/projetos/${data.id}`)
}

export async function atualizarProjeto(id: string, f: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('projetos').update(dados(f)).eq('id', id)
  if (error) throw new Error(error.message)
  refrescar()
  redirect(`/projetos/${id}`)
}

export async function mudarEstadoProjeto(id: string, f: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('projetos').update({ estado: String(f.get('estado')) }).eq('id', id)
  if (error) throw new Error(error.message)
  refrescar()
}

export async function arquivarProjeto(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('projetos').update({ arquivado: true }).eq('id', id)
  if (error) throw new Error(error.message)
  refrescar()
  redirect('/projetos')
}

export async function criarTarefa(projetoId: string | null, f: FormData) {
  const titulo = String(f.get('titulo') ?? '').trim()
  if (!titulo) return
  const supabase = await createClient()
  const { error } = await supabase.from('tarefas').insert({
    titulo, projeto_id: projetoId ?? txt(f, 'projeto_id'), prazo: txt(f, 'prazo'), prioridade: String(f.get('prioridade') ?? 'Média'),
  })
  if (error) throw new Error(error.message)
  refrescar()
}

export async function alternarTarefa(id: string, feita: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('tarefas').update({ feita }).eq('id', id)
  if (error) throw new Error(error.message)
  refrescar()
}

export async function apagarTarefa(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('tarefas').delete().eq('id', id)
  if (error) throw new Error(error.message)
  refrescar()
}