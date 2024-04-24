import { fireEvent, render } from "@testing-library/react";
import App from "../../App";
import { insert } from "../../services/photos";

jest.mock("../services/photos", () => ({
  ...jest.requireActual("../services/photos"),
  insert: (file: File) => {
    return Promise.resolve({
      name: file.name,
      url: `http://example.com/${file.name}`,
    });
  },
}));

const file = new File(["hello"], "mock-photo-name", { type: "image/png" });

describe("Home e2e", () => {
  it("Should load file", async () => {
    const { getByTestId } = render(<App />);

    const inputField = getByTestId("fileInput") as HTMLInputElement;
    fireEvent.change(inputField, { target: { files: [file] } });

    expect(inputField.files).toHaveLength(1);
    expect(inputField.files?.[0]).toStrictEqual(file);
  });

  it("Should upload file", async () => {
    const { getByTestId, getByDisplayValue } = render(<App />);

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
});
