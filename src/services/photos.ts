import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { storage } from "../libs/firebase";
import { Photo } from "../types/photos";
import { v4 as createId } from "uuid";

export const getAll = async () => {
  let list: Photo[] = [];

  const imagesFolder = ref(storage, "images");
  const photoList = await listAll(imagesFolder);

  for (let i in photoList.items) {
    const photUrl = await getDownloadURL(photoList.items[i]);

    list.push({
      name: photoList.items[i].name,
      url: photUrl,
    });
  }

  return list;
};



export const postFile = async (file: File) => {
  if(['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)){

    const randomName = createId()
    const newFile = ref(storage, `images/${randomName}- ${file.name}`)
    const upload = await uploadBytes(newFile, file)
    const photoUrl = await getDownloadURL(upload.ref)

    return {
      name: upload.ref.name,
      url: photoUrl
    } as Photo

  }else{
    return new Error("Tipo de arquivo não permitido")
  }

}