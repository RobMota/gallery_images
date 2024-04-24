import * as C from "./styles";

type Props = {
  name: string;
  url: string;
  handleDelete: (name: string) => void;
};

const PhotoItem = ({ name, url, handleDelete }: Props) => {
  return (
    <C.Container>
      <img src={url} alt={name} />
      <p>{name}</p>
      <button onClick={() => handleDelete(name)} type="button">
        Delete
      </button>
    </C.Container>
  );
};

export default PhotoItem;
