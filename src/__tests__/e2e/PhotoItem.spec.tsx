import { fireEvent, render } from "@testing-library/react";
import PhotoItem from "../../components/photoItem";
import { Photo } from "../../types/photo";
import { PhotoList } from "../../App.styles";
import { deleteImage } from "../../services/photos";

const photos = [
  { name: "photo1", url: "https://example.com/photo1.jpg" },
  { name: "photo2", url: "https://example.com/photo2.jpg" },
];

const handleDelete = jest.fn(({ name }) => {
  return photos.filter((item) => item.name !== name);
});

jest.mock("../../services/photos", () => ({
  ...jest.requireActual("../../services/photos"),
  deleteImage: (name: string) => handleDelete(name),
}));

const photoItem = (photo: Photo) => (
  <PhotoItem
    key={photo.name}
    name={photo.name}
    url={photo.url}
    handleDelete={() => handleDelete(photo.name)}
  />
);

describe("Photo Item", () => {
  it("should delete item", () => {
    const { getAllByText } = render(
      <PhotoList>{photos.map((photo) => photoItem(photo))}</PhotoList>
    );

    const buttonDelete = getAllByText("Delete");

    fireEvent.click(buttonDelete[0]);

    const imgDele = deleteImage(photos[0].name);
    expect(photos).toEqual(imgDele);
  });
});
