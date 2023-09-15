import { useEffect, useState } from "react";
import { NFTStorage, File } from "nft.storage";
import { Buffer } from "buffer";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { ethers } from "ethers";
import axios from "axios";

// Components
import Navigation from "./Navigation";
import ImageLoader from "./ImageLoader";
import Loading from "./Loading";

// ABIs: Import your contract ABIs here
import NFT_ABI from "../abis/NFT.json";

// Config: Import your network config here
import config from "../config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [name, setName] = useState(" ");
  const [description, setDescription] = useState(" ");
  const [image, setImage] = useState(null);
  const [url, setURL] = useState(null);

  const [message, setMessage] = useState(" ");
  const [isLoading, setIsLoading] = useState(false);

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    // Load network
    const network = await provider.getNetwork();

    // Initiate contract
    const nft = new ethers.Contract(
      config[network.chainId].NFT.address,
      NFT_ABI,
      provider
    );
    setNFT(nft);
  };

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

  const mintHandler = async (e) => {
    e.preventDefault();

    if (!account) {
      window.alert("Please connect your wallet");
      return;
    }

    if (image) {
      setIsLoading(true);
      //Uploads image to IPFS (NFT.Storage)
      const url = await uploadImage(image);

      //Mint NFT
      await mintImage(url);

      setIsLoading(false);
      setMessage(" ");
    } else if (selectedImage) {
      setIsLoading(true);

      const url = await uploadImage(ImageLoader.file);

      await mintImage(url);
      setIsLoading(false);
      setMessage(" ");
    }
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
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        inputs: description,
        options: { wait_for_model: true },
      }),
      responseType: "arraybuffer",
    });

    const type = response.headers["Content-Type"];
    const data = response.data;

    const base64data = Buffer.from(data).toString("base64");
    const img = `data:${type};base64,` + base64data;
    setImage(img);

    return data;
  };

  const uploadImage = async (imageData) => {
    setMessage("Uploading Image...");

    //Creates instance to NFT.Storage
    const nftstorage = new NFTStorage({
      token: process.env.REACT_APP_NFT_STORAGE_API_KEY,
    });

    //Sends request to store image
    const { ipnft } = await nftstorage.store({
      image: new File([imageData], "image.jpeg", { type: "image/jpeg" }),
      name: name,
      description: description,
    });

    // Saves the URL
    const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`;
    setURL(url);

    return url;
  };

  //Calls nft contract minting function
  const mintImage = async (tokenURI) => {
    setMessage("Waiting for mint...");

    const signer = await provider.getSigner();
    const transaction = await nft
      .connect(signer)
      .mint(tokenURI, { value: ethers.parseUnits("1", "ether") });
    await transaction.wait();
  };

  const refreshHandler = async () => {
    // Reload page when network changes
    window.location.reload();
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <Row>
        <Col xs={6} md={6}>
          {selectedImage ? (
            <></>
          ) : (
            <>
              <Form onSubmit={submitHandler}>
                <Form.Group style={{ maxWidth: "450px", margin: "10px auto" }}>
                  <Form.Control
                    type="text"
                    style={{ fontSize: 20 }}
                    placeholder="Give your NFT a name"
                    className="my-2"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Form.Control
                    type="text"
                    style={{ fontSize: 20 }}
                    placeholder="Enter description"
                    className="my-2"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  {!isLoading && !image ? (
                    <Button
                      type="submit"
                      variant="outline-primary"
                      style={{ fontSize: 20, width: "100%", margin: "3px" }}
                    >
                      Generate Image
                    </Button>
                  ) : !isLoading && image ? (
                    <Button
                      onClick={refreshHandler}
                      variant="outline-danger"
                      style={{ fontSize: 20, width: "100%", margin: "3px" }}
                    >
                      Start Over
                    </Button>
                  ) : (
                    <></>
                  )}
                </Form.Group>
              </Form>

              <Card
                border="success"
                style={{ width: "40rem", margin: "10px auto" }}
              >
                <div className="image">
                  {!isLoading && url && image ? (
                    <>
                      <Card.Text
                        className="text-center"
                        style={{ fontSize: 20 }}
                      >
                        🎉🎊 CONGRATS!!🎊🎉 Your NFT has been minted.
                      </Card.Text>
                      <Card.Img src={image} />
                    </>
                  ) : !isLoading && !url && image ? (
                    <>
                      <Button
                        onClick={mintHandler}
                        variant="outline-success"
                        style={{ fontSize: 20, width: "99%", margin: "1px" }}
                      >
                        Mint it
                      </Button>
                      <Card.Img src={image} />
                    </>
                  ) : !selectedImage && isLoading ? (
                    <Loading message={message} />
                  ) : (
                    <Card.Text className="text-center" style={{ fontSize: 20 }}>
                      Your AI generated image will apear here.
                    </Card.Text>
                  )}
                </div>
                {!isLoading && image && url && (
                  <p style={{ maxWidth: "800px", margin: "auto" }}>
                    View&nbsp;
                    <a href={url} target="_blank" rel="noreferrer">
                      Metadata
                    </a>
                  </p>
                )}
              </Card>
            </>
          )}
        </Col>
        <Col xs={6} md={6}>
          {image ? (
            <></>
          ) : (
            <>
              <ImageLoader
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />

              <Card
                border="success"
                style={{ width: "40rem", margin: "93px auto" }}
              >
                <div className="image">
                  {!isLoading && url && selectedImage ? (
                    <>
                      <Button
                        onClick={refreshHandler}
                        variant="outline-danger"
                        style={{ fontSize: 20, width: "100%", margin: "3px" }}
                      >
                        Start Over
                      </Button>
                      <Card.Text
                        className="text-center"
                        style={{ fontSize: 20 }}
                      >
                        🎉🎊 CONGRATS!!🎊🎉 Your NFT has been minted.
                      </Card.Text>
                      <Card.Img src={selectedImage} />
                    </>
                  ) : !isLoading && !url && selectedImage ? (
                    <>
                      <Button
                        onClick={refreshHandler}
                        variant="outline-danger"
                        style={{ fontSize: 20, width: "100%", margin: "3px" }}
                      >
                        Start Over
                      </Button>
                      <Button
                        onClick={mintHandler}
                        variant="outline-success"
                        style={{ fontSize: 20, width: "100%", margin: "3px" }}
                      >
                        Mint it
                      </Button>
                      <Card.Img src={selectedImage} />
                    </>
                  ) : selectedImage && isLoading ? (
                    <Loading message={message} />
                  ) : (
                    <Card.Text className="text-center" style={{ fontSize: 20 }}>
                      Your selected image will apear here.
                    </Card.Text>
                  )}
                </div>
                {!isLoading && selectedImage && url && (
                  <p style={{ maxWidth: "800px", margin: "auto" }}>
                    View&nbsp;
                    <a href={url} target="_blank" rel="noreferrer">
                      Metadata
                    </a>
                  </p>
                )}
              </Card>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default App;
