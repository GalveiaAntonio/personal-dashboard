import Link from 'next/link'
import { ESTADOS_PROJETO } from '@/lib/estados'

type Cli = { id: string; nome: string; empresa: string | null }

export default function FormProjeto({ p, clientes, action, cancelar }: {
  p?: Record<string, string | number | null>; clientes: Cli[]; action: (f: FormData) => void | Promise<void>; cancelar: string
}) {
  return (
    <form action={action}>
      <label><span>Nome do projeto</span><input name="nome" defaultValue={String(p?.nome ?? '')} required /></label>
      <label><span>Cliente</span>
        <select name="cliente_id" defaultValue={String(p?.cliente_id ?? '')}>
          <option value="">Sem cliente</option>
          {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}{c.empresa ? ` (${c.empresa})` : ''}</option>)}
        </select>
      </label>
      <label><span>Estado</span>
        <select name="estado" defaultValue={String(p?.estado ?? 'Planning')}>{ESTADOS_PROJETO.map(e => <option key={e}>{e}</option>)}</select>
      </label>
      <label><span>Valor (€)</span><input name="valor" inputMode="decimal" defaultValue={p?.valor != null ? String(p.valor) : ''} placeholder="1200" /></label>
      <label><span>Prazo</span><input type="date" name="prazo" defaultValue={String(p?.prazo ?? '')} /></label>
      <label><span>Descrição</span><textarea name="descricao" rows={3} defaultValue={String(p?.descricao ?? '')} /></label>
      <div className="acts"><Link href={cancelar} className="btn ghost">Cancelar</Link><button className="btn">Guardar</button></div>
    </form>
  )
}