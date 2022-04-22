import * as S from "./styles";

type Props = {
  url: string;
  name: string;
  handleDelete: (name: string) => void
};



const PhotoItem = (props: Props) => {
  return (
    <S.Container>
      <div>
        <img src={props.url} alt={props.name} />

        <p>{props.name}</p>
      </div>
      <button onClick={() => props.handleDelete(props.name)}>Excluir imagem</button>
    </S.Container>
  );
};

export default PhotoItem;
