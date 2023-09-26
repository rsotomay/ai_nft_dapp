import { useEffect, useState } from "react";
import { NFTStorage, File } from "nft.storage";
import { Buffer } from "buffer";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { ethers } from "ethers";
import axios from "axios";
import background from "../background.avif";

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
  const [cost, setCost] = useState(0);
  const [balance, setBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [listOfNFTs, setListOfNFTs] = useState(0);

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

    //Fetch Cost
    setCost(await nft.cost());

    //Fetch total supply
    setTotalSupply(await nft.totalSupply());

    // Fetch current account from Metamask when changed
    window.ethereum.on("accountsChanged", async () => {
      setAccount(account);
    });
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

    if (name === " " || description === " ") {
      window.alert("Please provide a name and description");
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
    // const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`;
    const url = `https://gateway.pinata.cloud/ipfs/${ipnft}/image/image.jpeg`;
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
    <Container>
      <div
        style={{
          WebkitBackgroundSize: "cover",
          minHeight: "100vh",
          backgroundPosition: "bottom",
          backgroundImage: `url(${background})`,
        }}
      >
        <Navigation
          account={account}
          setAccount={setAccount}
          nft={nft}
          balance={balance}
          setBalance={setBalance}
          setListOfNFTs={setListOfNFTs}
        />

        <div>
          <p className="text-end mx-5" style={{ color: "silver" }}>
            <strong className="mx-1">Cost to Mint:</strong>
            {ethers.formatUnits(cost, "ether")} ETH
          </p>
          <p className="text-end mx-5" style={{ color: "silver" }}>
            <strong className="mx-1">Total Supply:</strong>
            {totalSupply.toString()} NFTs
          </p>
          <p
            className="text-center mx-5"
            style={{ fontSize: 20, color: "silver", padding: "2rem" }}
          >
            DecentralArt-AI invites you to be the mastermind behind your digital
            masterpieces. Simply provide a prompt, and our cutting-edge AI
            algorithms will spring into action, crafting stunning and unique
            artworks tailored to your vision. Whether you seek abstract beauty,
            vibrant landscapes, or futuristic designs, DecentralArt-AI
            transforms your ideas into captivating visual wonders.
          </p>
        </div>

        <Row xs={1} md={2} className="g-2" style={{ padding: "1rem" }}>
          <Col>
            {selectedImage ? (
              <></>
            ) : (
              <>
                <h2 className="text-center" style={{ color: "silver" }}>
                  Use AI to Generate Images That You Can Mint
                </h2>
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

                <Card
                  className="bg-dark text-white"
                  border="info"
                  style={{
                    width: "28rem",
                    margin: "10px auto",
                  }}
                >
                  <div className="image">
                    {!isLoading && url && image ? (
                      <>
                        <Button
                          onClick={refreshHandler}
                          variant="outline-light"
                          style={{ fontSize: 20, width: "99%", margin: "3px" }}
                        >
                          Start Over to Mint More
                        </Button>
                        <Card.Text
                          className="text-center"
                          style={{ fontSize: 20 }}
                        >
                          🎉🎊 CONGRATS!!🎊🎉 You have minted your NFT.
                        </Card.Text>
                        <Card.Img src={image} />
                      </>
                    ) : !isLoading && !url && image ? (
                      <>
                        <Button
                          onClick={refreshHandler}
                          variant="outline-danger"
                          style={{ fontSize: 20, width: "99%", margin: "3px" }}
                        >
                          Start Over
                        </Button>
                        <Button
                          onClick={mintHandler}
                          variant="outline-success"
                          style={{ fontSize: 20, width: "99%", margin: "3px" }}
                        >
                          Mint it
                        </Button>
                        <Card.Img src={image} />
                      </>
                    ) : !selectedImage && isLoading ? (
                      <Loading message={message} />
                    ) : (
                      <Card.Text
                        className="text-center"
                        style={{ fontSize: 20 }}
                      >
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
          <Col>
            {image ? (
              <></>
            ) : (
              <>
                <ImageLoader setSelectedImage={setSelectedImage} />

                <Form onSubmit={mintHandler}>
                  <Form.Group style={{ width: "28rem", margin: "10px auto" }}>
                    <Form.Control
                      size="lg"
                      type="text"
                      placeholder="Give your image a name"
                      className="my-2"
                      onChange={(e) => setName(e.target.value)}
                      disabled={url}
                    />
                    <Form.Control
                      size="lg"
                      type="text"
                      placeholder="Description"
                      className="my-2"
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={url}
                    />
                    {!isLoading && selectedImage && url ? (
                      <></>
                    ) : (
                      !isLoading &&
                      selectedImage && (
                        <Button
                          type="submit"
                          variant="outline-success"
                          style={{ fontSize: 20, width: "99%", margin: "3px" }}
                        >
                          Mint it
                        </Button>
                      )
                    )}
                  </Form.Group>
                </Form>

                <Card
                  className="bg-dark text-white my-3"
                  border="info"
                  style={{
                    width: "28rem",
                    margin: "auto",
                  }}
                >
                  <div className="image">
                    {!isLoading && url && selectedImage ? (
                      <>
                        <Button
                          onClick={refreshHandler}
                          variant="outline-light"
                          style={{ fontSize: 20, width: "99%", margin: "3px" }}
                        >
                          Start Over to Mint More
                        </Button>
                        <Card.Text
                          className="text-center"
                          style={{ fontSize: 20 }}
                        >
                          🎉🎊 CONGRATS!!🎊🎉 You have minted your NFT.
                        </Card.Text>
                        <Card.Img src={selectedImage} />
                      </>
                    ) : !isLoading && !url && selectedImage ? (
                      <>
                        <Button
                          onClick={refreshHandler}
                          variant="outline-danger"
                          style={{ fontSize: 20, width: "99%", margin: "3px" }}
                        >
                          Start Over
                        </Button>
                        <Card.Img src={selectedImage} />
                      </>
                    ) : selectedImage && isLoading ? (
                      <Loading message={message} />
                    ) : (
                      <Card.Text
                        className="text-center"
                        style={{ fontSize: 20 }}
                      >
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
        <Row>
          {listOfNFTs.length > 0 ? (
            <>
              <h2 className="my-2 text-center" style={{ color: "silver" }}>
                Your collection
              </h2>
              <div className="text-center" style={{ color: "silver" }}>
                {listOfNFTs.map((nftId) => (
                  <img
                    key={nftId}
                    style={{ margin: "6px" }}
                    className="my-3"
                    src={nftId}
                    alt={`NFT ${nftId}`}
                    width="50px"
                    height="50px"
                  />
                ))}
              </div>
            </>
          ) : (
            <></>
          )}
        </Row>
      </div>
    </Container>
  );
}

export default App;
