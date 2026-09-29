import { COR } from '@/lib/estados'

export default function Estado({ e }: { e: string }) {
  return <span className="badge" style={{ '--c': COR[e] } as React.CSSProperties}>{e}</span>
}
