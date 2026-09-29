import FormCliente from '@/components/FormCliente'
import { criarCliente } from '../actions'

export default function Novo() {
  return (
    <>
      <div className="head"><h1>Novo cliente</h1></div>
      <div style={{ maxWidth: 460 }}><FormCliente action={criarCliente} cancelar="/clientes" /></div>
    </>
  )
}
