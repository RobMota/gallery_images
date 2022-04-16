import { FormEvent, useEffect, useState } from "react";
import * as S from "./App.styles";
import PhotoItem from "./components/PhotosItems";
import * as Photos from "./services/photos";
import { Photo } from "./types/photos";

const App = () => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const getPhotos = async () => {
      setLoading(true);
      setPhotos(await Photos.getAll());
      setLoading(false);
    };

    getPhotos();
  }, []);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const file = formData.get("image") as File;

    if (file && file.size > 0) {
      setUploading(true);
      const result = await Photos.postFile(file);
      setUploading(false);

      if (result instanceof Error) {
        alert(`${result.name} - ${result.message}`);
      } else {
        const newPhotoList = [...photos];
        console.log("newPhotoList", newPhotoList);
        newPhotoList.push(result);
        setPhotos(newPhotoList);
      }
    }
  };

  return (
    <S.Container>
      <S.Area>
        <S.Header>Galeria de fotos</S.Header>

        <S.UploadForm method="POST" onSubmit={handleFormSubmit}>
          <input type="file" name="image" />
          <button type="submit">Enviar</button>
          {uploading && "Enviando..."}
        </S.UploadForm>

        {loading && (
          <S.ScreenWarning>
            <div className="emoji">✋</div>
            <div>Carregando...</div>
          </S.ScreenWarning>
        )}

        {!loading && photos.length > 0 && (
          <S.PhotoList>
            {photos.map((item) => (
              <PhotoItem key={item.name} url={item.url} name={item.name} />
            ))}
          </S.PhotoList>
        )}

        {!loading && photos.length === 0 && (
          <S.ScreenWarning>
            <div className="emoji">🥺</div>
            <div>Não há imagens cadastradas.</div>
          </S.ScreenWarning>
        )}
      </S.Area>
    </S.Container>
  );
};

export default App;
