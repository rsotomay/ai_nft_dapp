import Carousel from "react-bootstrap/Carousel";
import Row from "react-bootstrap/Row";

const Collection = ({ listOfNFTs }) => {
  return (
    <Row>
      {listOfNFTs.length > 0 ? (
        <>
          <h2 className="my-2 text-center" style={{ color: "silver" }}>
            Your collection
          </h2>
          <Carousel fade>
            {listOfNFTs.map((nftId, index) => (
              <Carousel.Item
                key={nftId}
                className="d-flex justify-content-center align-items-center"
              >
                <img
                  key={index}
                  src={nftId}
                  alt={`NFT ${nftId}`}
                  width="250px"
                  height="250px"
                />
                <Carousel.Caption></Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </>
      ) : (
        <></>
      )}
    </Row>
  );
};

export default Collection;
