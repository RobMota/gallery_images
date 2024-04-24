import { render } from "@testing-library/react";
import App from "../../App";
import "@testing-library/jest-dom";
import { PhotoList } from "../../App.styles";
import PhotoItem from "../../components/photoItem";
import * as C from "../../App.styles";
import { Photo } from "../../types/photo";

const photos = [
  { name: "photo1", url: "https://example.com/photo1.jpg" },
  { name: "photo2", url: "https://example.com/photo2.jpg" },
];

const handleDelete = jest.fn(({ name }) => {
  return photos.filter((item) => item.name !== name);
});

const loading = false;

const photoItem = (photo: Photo) => (
  <PhotoItem
    key={photo.name}
    name={photo.name}
    url={photo.url}
    handleDelete={handleDelete}
  />
);

describe("Home page", () => {
  afterEach(() => jest.resetAllMocks());

  it("Shold render title from home page", () => {
    const { getByText } = render(<App />);
    expect(getByText("Image Gallery")).toBeInTheDocument();
  });

  it("Should render images", () => {
    const { getByText } = render(
      <PhotoList>{photos.map((photo) => photoItem(photo))}</PhotoList>
    );
    expect(getByText(photos[0].name)).toBeInTheDocument();
  });

  it("does not render image when loading is true", () => {
    const { getByText } = render(
      <PhotoList>
        {!loading ? (
          <C.ScreenWarning>
            <div>Loading...</div>
          </C.ScreenWarning>
        ) : (
          photos.map((photo) => photoItem(photo))
        )}
      </PhotoList>
    );

    expect(getByText("Loading...")).toBeInTheDocument();
  });

  it("should not render images on the screen when there are no registered photos", () => {
    const noImages = [{ name: "", url: "" }];

    const { queryAllByRole, getByText } = render(
      <PhotoList>
        {loading && noImages.length > 0 ? (
          noImages.map((photo) => photoItem(photo))
        ) : (
          <C.ScreenWarning>
            <div data-testid="title">There are no registered photos.</div>
          </C.ScreenWarning>
        )}
      </PhotoList>
    );

    expect(queryAllByRole("img")).toHaveLength(0);
    expect(getByText("There are no registered photos.")).toBeInTheDocument();
  });
});
