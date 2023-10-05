import { useEffect, useState } from "react";
import { NFTStorage, File } from "nft.storage";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { ethers } from "ethers";
import background from "../background.avif";

// Components
import Navigation from "./Navigation";
import Data from "./Data";
import ImageGenerator from "./ImageGenerator";
import ImageLoader from "./ImageLoader";
import Loading from "./Loading";
import Collection from "./Collection";
import Withdraw from "./Withdraw";

// ABIs: Import your contract ABIs here
import NFT_ABI from "../abis/NFT.json";

// Config: Import your network config here
import config from "../config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState(null);
  const [owner, setOwner] = useState(null);
  const [cost, setCost] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);
  const [balance, setBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [selectedImageData, setSelectedImageData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [listOfNFTs, setListOfNFTs] = useState(0);

  const [name, setName] = useState(" ");
  const [description, setDescription] = useState(" ");
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [url, setUrl] = useState(null);
  const [metaData, setMetaData] = useState(null);

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

    //Fetch contract owner
    setOwner(await nft.owner());

    //Fetch Contract Balance
    setContractBalance(await provider.getBalance(nft.getAddress()));

    //Fetch Cost
    setCost(await nft.cost());

    //Fetch total supply
    setTotalSupply(await nft.totalSupply());

    // Fetch current account from Metamask when changed
    window.ethereum.on("accountsChanged", async () => {
      setAccount(account);
    });
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
      const imageUrl = await uploadImage(imageData);

      //Mint NFT
      await mintImage(imageUrl);

      setIsLoading(false);
      setMessage(" ");
    } else if (selectedImage) {
      setIsLoading(true);

      const selectedImageUrl = await uploadImage(selectedImageData);

      await mintImage(selectedImageUrl);
      setIsLoading(false);
      setMessage(" ");
    }
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
    const url = `https://hardbin.com/ipfs/${ipnft}/image/image.jpeg`;
    setUrl(url);
    const metaData = `https://gateway.pinata.cloud/ipfs/${ipnft}/metadata.json`;
    setMetaData(metaData);

    return url;
  };

  //Calls nft contract minting function
  const mintImage = async (tokenURI) => {
    setMessage("Waiting for mint...");

    const signer = await provider.getSigner();
    const transaction = await nft
      .connect(signer)
      .mint(tokenURI, { value: cost });
    await transaction.wait();
  };

  const refreshHandler = async () => {
    // Reload page
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

        {account !== owner ? (
          <></>
        ) : (
          <Withdraw
            nft={nft}
            provider={provider}
            account={account}
            owner={owner}
            contractBalance={contractBalance}
          />
        )}

        <Data cost={cost} totalSupply={totalSupply} />

        <Row xs={1} md={2} className="g-2" style={{ padding: "1rem" }}>
          <Col>
            {selectedImage ? (
              <></>
            ) : (
              <>
                <h2 className="text-center" style={{ color: "silver" }}>
                  Use AI to Generate Images That You Can Mint
                </h2>
                <ImageGenerator
                  account={account}
                  image={image}
                  name={name}
                  setName={setName}
                  description={description}
                  setDescription={setDescription}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  setMessage={setMessage}
                  setImage={setImage}
                  setImageData={setImageData}
                />

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
                      <a href={metaData} target="_blank" rel="noreferrer">
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
                <ImageLoader
                  setSelectedImageData={setSelectedImageData}
                  setSelectedImage={setSelectedImage}
                />

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
                      <a href={metaData} target="_blank" rel="noreferrer">
                        Metadata
                      </a>
                    </p>
                  )}
                </Card>
              </>
            )}
          </Col>
        </Row>
        <Collection listOfNFTs={listOfNFTs} />
      </div>
    </Container>
  );
}

export default App;
