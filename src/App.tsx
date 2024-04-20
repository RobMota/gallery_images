import { FormEvent, useEffect, useState } from "react";
import * as C from "./App.styles";
import * as Photos from "./services/photos";
import { Photo } from "./types/photo";
import PhotoItem from "./components/photoItem";

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

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const file = formData.get("image") as File;

    if (file && file.size > 0) {
      setUploading(true);

      const result = await Photos.insert(file);

      setUploading(false);

      if (result instanceof Error) {
        alert(result.name + " - " + result.message);
      } else {
        const newPhotoList = [...photos];
        newPhotoList.push(result);
        setPhotos(newPhotoList);
      }
    }
  };

  const handleDelete = async (name: string) => {
    await Photos.deleteImage(name);
    alert("Image deleted");
    const allPhotos = photos.filter((photo) => photo.name !== name);
    setPhotos(allPhotos);
  };

  return (
    <C.Container>
      <C.Area>
        <C.Header>Photo Gallery</C.Header>

        <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
          <input type="file" name="image" data-testid="fileInput" />
          <input type="submit" value="Send" />
          {uploading && "Uploading..."}
        </C.UploadForm>

        {loading && (
          <C.ScreenWarning>
            <div className="emoji">✋</div>
            <div>Loading...</div>
          </C.ScreenWarning>
        )}

        {!loading && photos.length > 0 && (
          <C.PhotoList>
            {photos.map((photo: Photo) => (
              <PhotoItem
                key={photo.name}
                name={photo.name}
                url={photo.url}
                handleDelete={handleDelete}
              />
            ))}
          </C.PhotoList>
        )}

        {!loading && photos.length === 0 && (
          <C.ScreenWarning>
            <div className="emoji">😢</div>
            <div>There are no registered photos.</div>
          </C.ScreenWarning>
        )}
      </C.Area>
    </C.Container>
  );
};

export default App;
