import Link from 'next/link'
import { ESTADOS } from '@/lib/estados'

const CAMPOS = [['nome', 'Nome'], ['empresa', 'Empresa'], ['email', 'Email'], ['telefone', 'Telefone'],
  ['website', 'Website'], ['nif', 'NIF'], ['morada', 'Morada'], ['pais', 'País']] as const

export default function FormCliente({ c, action, cancelar }: {
  c?: Record<string, string | null>; action: (f: FormData) => void | Promise<void>; cancelar: string
}) {
  return (
    <form action={action}>
      {CAMPOS.map(([k, l]) => (
        <label key={k}><span>{l}</span>
          <input name={k} defaultValue={c?.[k] ?? (k === 'pais' ? 'Portugal' : '')} required={k === 'nome'} />
        </label>
      ))}
      <label><span>Estado</span>
        <select name="estado" defaultValue={c?.estado ?? 'Lead'}>{ESTADOS.map(e => <option key={e}>{e}</option>)}</select>
      </label>
      <label><span>Primeiro contacto</span><input type="date" name="primeiro_contacto" defaultValue={c?.primeiro_contacto ?? ''} /></label>
      <label><span>Último contacto</span><input type="date" name="ultimo_contacto" defaultValue={c?.ultimo_contacto ?? ''} /></label>
      <div className="acts">
        <Link href={cancelar} className="btn ghost">Cancelar</Link>
        <button className="btn">Guardar</button>
      </div>
    </form>
  )
}
