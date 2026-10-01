import { createClient } from '@/lib/supabase/server'
import FormProjeto from '@/components/FormProjeto'
import { criarProjeto } from '../actions'

export default async function Novo() {
  const supabase = await createClient()
  const { data: clientes } = await supabase.from('clientes').select('id,nome,empresa').eq('arquivado', false).order('nome')
  return (
    <>
      <div className="head"><h1>Novo projeto</h1></div>
      <div style={{ maxWidth: 460 }}><FormProjeto clientes={clientes ?? []} action={criarProjeto} cancelar="/projetos" /></div>
    </>
  )
}