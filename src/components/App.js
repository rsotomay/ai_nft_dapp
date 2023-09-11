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
  const [nft, setNFT] = useState(null);
  const [account, setAccount] = useState(null);

  const [name, setName] = useState(" ");
  const [description, setDescription] = useState(" ");
  const [image, setImage] = useState(null);

  const [balance, setBalance] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

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

    setIsLoading(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // Calls the API to create image from description
    const imageData = createImage();
  };

  const createImage = async () => {
    console.log("Generating Image");

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

    const type = response.headers["content-type"];
    const data = response.data;

    const base64data = Buffer.from(data).toString("base64");
    const img = `data:${type};base64,` + base64data;
    setImage(img);

    return data;
  };

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData();
    }
  }, [isLoading]);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <Container>
        <div className="form mx-5">
          <form onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Give your NFT a name"
              className="my-2"
              onChange={(e) => setName(e.target.value)}
            ></input>
            <div>
              <input
                type="text"
                placeholder="Enter description"
                className="my-2"
                onChange={(e) => setDescription(e.target.value)}
              ></input>
            </div>
            <Button type="submit" style={{ width: "16%" }}>
              submit
            </Button>
          </form>
          <div className="image">
            <Row>
              <img src={image} alt="AI NFT image" style={{ margin: "6px" }} />
            </Row>
          </div>
          <p>
            View&nbsp;
            <a href="" target="_blank" rel="noreferrer">
              Metadata
            </a>
          </p>
        </div>
      </Container>

      {/* {isLoading ? (
        <Loading />
      ) : (
        <>
          <p className="text-center">
            <strong>Your ETH Balance:</strong> {balance} ETH
          </p>
          <p className="text-center">Edit App.js to add your code here.</p>
        </>
      )} */}
    </div>
  );
}

export default App;
