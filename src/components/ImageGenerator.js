import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Buffer } from "buffer";

import axios from "axios";

const ImageGenerator = ({
  account,
  image,
  name,
  setName,
  description,
  setDescription,
  isLoading,
  setIsLoading,
  setMessage,
  setImage,
  setImageData,
}) => {
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!account) {
      window.alert("Please connect your wallet");
      return;
    }

    if (name === " " || description === " ") {
      window.alert("Please provide a name and description");
      return;
    }

    setIsLoading(true);

    // Calls the API to create image from description
    await createImage();

    setIsLoading(false);
    setMessage(" ");
  };
  const createImage = async () => {
    setMessage("Generating Image");

    // URL to API model stabilityai/stable-diffusion-2
    const URL =
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2";

    //Sends API request
    const response = await axios({
      url: URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
        Accept: "application/json",
        "content-type": "application/json",
      },
      data: JSON.stringify({
        inputs: description,
        options: { wait_for_model: true },
      }),
      responseType: "arraybuffer",
    });

    const type = response.headers["content-type"];
    const data = response.data;

    const base64data = Buffer.from(data).toString("base64");
    const img = `data:${type};base64,` + base64data;
    setImage(img);

    setImageData(data);
  };
  return (
    <Form onSubmit={submitHandler}>
      <Form.Group style={{ width: "28rem", margin: "10px auto" }}>
        <Form.Control
          size="lg"
          type="text"
          placeholder="Give your image a name"
          className="my-2"
          onChange={(e) => setName(e.target.value)}
          disabled={image}
        />
        <Form.Control
          size="lg"
          type="text"
          placeholder="Describe the image you wish to create"
          className="my-2"
          onChange={(e) => setDescription(e.target.value)}
          disabled={image}
        />
        {!isLoading && !image ? (
          <Button
            type="submit"
            variant="outline-primary"
            style={{ fontSize: 20, width: "99%", margin: "3px" }}
          >
            Generate Image
          </Button>
        ) : (
          !isLoading && image && <></>
        )}
      </Form.Group>
    </Form>
  );
};

export default ImageGenerator;
