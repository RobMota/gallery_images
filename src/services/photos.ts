import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { Photo } from "../types/photo";
import { storage } from "../libs/firebase";
import { v4 as createId } from "uuid";

export const getAll = async () => {
  const list: Photo[] = [];

  const imageFolder = ref(storage, "images");
  const photoListt = await listAll(imageFolder);

  for (const i in photoListt.items) {
    const url = await getDownloadURL(photoListt.items[i]);
    list.push({
      name: photoListt.items[i].name,
      url,
    });
  }

  return list;
};

export const insert = async (file: File) => {
  if (["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
    const randomName = createId();

    const newFile = ref(storage, `/images/${randomName}`);

    const upload = await uploadBytes(newFile, file);
    const photourl = await getDownloadURL(upload.ref);

    return {
      name: upload.ref.name,
      url: photourl,
    } as Photo;
  } else {
    return new Error("File type not supported");
  }
};

export const deleteImage = async (imageId: string) => {
  const imageFolder = ref(storage, `/images/${imageId}`);
  return await deleteObject(imageFolder);
};
