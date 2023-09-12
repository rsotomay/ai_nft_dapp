import { useEffect, useState } from "react";
import { NFTStorage, File } from "nft.storage";
import { Buffer } from "buffer";
import Form from "react-bootstrap/Form";
import { Container, Col, Row, Button } from "react-bootstrap";
import { ethers } from "ethers";
import axios from "axios";

// Components
import Navigation from "./Navigation";
import Loading from "./Loading";

// ABIs: Import your contract ABIs here
import NFT_ABI from "../abis/NFT.json";

// Config: Import your network config here
import config from "../config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState(null);

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
    const imageData = createImage();

    //Uploads image ti IPFS (NFT.Storage)
    const url = await uploadImage(imageData);

    //Mint NFT
    await mintImage(url);

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

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <hr />

      <Form onSubmit={submitHandler}>
        <Form.Group style={{ maxWidth: "450px", margin: "10px auto" }}>
          <Form.Control
            type="text"
            placeholder="Give your NFT a name"
            className="my-2"
            onChange={(e) => setName(e.target.value)}
          />
          <Form.Control
            type="text"
            placeholder="Enter description"
            className="my-2"
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" style={{ width: "40%" }}>
            Generate Image
          </Button>
        </Form.Group>
      </Form>

      <Row style={{ maxWidth: "840px", margin: "10px auto" }}>
        <div className="image">
          {!isLoading && image ? (
            <img src={image} alt="AI NFT image" style={{ margin: "6px" }} />
          ) : isLoading ? (
            <Loading message={message} />
          ) : (
            <></>
          )}
        </div>
      </Row>
      {!isLoading && url && (
        <p style={{ maxWidth: "800px", margin: "auto" }}>
          View&nbsp;
          <a href={url} target="_blank" rel="noreferrer">
            Metadata
          </a>
        </p>
      )}
    </div>
  );
}

export default App;
