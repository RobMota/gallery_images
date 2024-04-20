import { render, fireEvent } from "@testing-library/react";
import App from "../App";
import "@testing-library/jest-dom";
import { insert } from "../services/photos";
import { PhotoList } from "../App.styles";
import PhotoItem from "../components/photoItem";
import * as C from "../App.styles";

jest.mock("../services/photos", () => ({
  ...jest.requireActual("../services/photos"),
  insert: (file: File) => {
    const returnPromise = Promise.resolve({
      name: file.name,
      url: `http://example.com/${file.name}`,
    });

    return returnPromise;
  },
}));

describe("Home page", () => {
  afterEach(() => jest.resetAllMocks());

  it("Shold render title from home page", () => {
    const { getByText } = render(<App />);
    expect(getByText("Photo Gallery")).toBeInTheDocument();
  });

  it("Should load file", async () => {
    const { getByTestId } = render(<App />);
    const file = new File(["test file content"], "test.png", {
      type: "image/png",
    });

    const inputField = getByTestId("fileInput") as HTMLInputElement;
    fireEvent.change(inputField, { target: { files: [file] } });

    expect(inputField.files).toHaveLength(1);
    expect(inputField.files?.[0]).toStrictEqual(file);
  });

  it("Should upload file", async () => {
    const { getByTestId, getByDisplayValue } = render(<App />);

    const file = new File(["hello"], "mock-photo-name", { type: "image/png" });
    const inputField = getByTestId("fileInput") as HTMLInputElement;
    fireEvent.change(inputField, { target: { files: [file] } });

    const buttonUpload = getByDisplayValue("Send");
    fireEvent.click(buttonUpload as HTMLButtonElement);

    const resultPromise = {
      name: file.name,
      url: `http://example.com/${file.name}`,
    };

    return insert(file).then((data) => expect(data).toEqual(resultPromise));
  });

  it("Should render images", () => {
    const handleDelete = jest.fn();

    const photos = [
      { name: "photo1", url: "https://example.com/photo1.jpg" },
      { name: "photo2", url: "https://example.com/photo2.jpg" },
    ];

    const { getByText } = render(
      <PhotoList>
        {photos.map((photo) => (
          <PhotoItem
            key={photo.name}
            name={photo.name}
            url={photo.url}
            handleDelete={handleDelete}
          />
        ))}
      </PhotoList>
    );

    expect(getByText(photos[0].name)).toBeInTheDocument();
  });

  it("does not render photo items when loading is true", () => {
    const handleDelete = jest.fn();
    const loading = jest.fn(() => false);

    const photos = [
      { name: "photo1", url: "https://example.com/photo1.jpg" },
      { name: "photo2", url: "https://example.com/photo2.jpg" },
    ];

    const { getByText } = render(
      <PhotoList>
        {!loading && photos.length > 0 ? (
          photos.map((photo) => (
            <PhotoItem
              key={photo.name}
              name={photo.name}
              url={photo.url}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <C.ScreenWarning>
            <div className="emoji">✋</div>
            <div>Loading...</div>
          </C.ScreenWarning>
        )}
      </PhotoList>
    );

    expect(getByText("Loading...")).toBeInTheDocument();
  });

  it("should not render images on the screen when there are no registered photos", () => {
    const handleDelete = jest.fn();

    const loading = jest.fn(() => false);
    const photos = [{ name: "", url: "" }];

    const { queryAllByRole, getByText } = render(
      <PhotoList>
        {!loading && photos.length > 0 ? (
          photos.map((photo) => (
            <PhotoItem
              key={photo.name}
              name={photo.name}
              url={photo.url}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          <C.ScreenWarning>
            <div className="emoji">😢</div>
            <div data-testid="title">There are no registered photos.</div>
          </C.ScreenWarning>
        )}
      </PhotoList>
    );

    expect(queryAllByRole("img")).toHaveLength(0);
    expect(getByText("There are no registered photos.")).toBeInTheDocument();
  });
});
