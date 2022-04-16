import * as S from './styles'


type Props = {
  url: string,
  name: string
}

const PhotoItem = ({ url, name}: Props) => {
  return(
    <S.Container>
      <img src={url} alt={name} />
      {name}
    </S.Container>
  )
}

export default PhotoItem