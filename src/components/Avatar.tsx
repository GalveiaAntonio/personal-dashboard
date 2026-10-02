const IMAGEM = '/avatar.png'

export default function Avatar() {
  return <div className="avatar" role="img" aria-label="Perfil" style={{ backgroundImage: `url(${IMAGEM})` }} />
}