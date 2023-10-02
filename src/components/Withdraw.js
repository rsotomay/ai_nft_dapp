import { ethers } from "ethers";
import Button from "react-bootstrap/Button";

const Withdraw = ({ nft, provider, account, owner, contractBalance }) => {
  const withdrawHandler = async (e) => {
    e.preventDefault();
    if (account !== owner) {
      window.alert("You are not the owner");
    }
    const signer = await provider.getSigner();
    const transaction = nft.connect(signer).withdraw();
    transaction.wait();
  };
  return (
    <div className="d-flex justify-content-end">
      <Button
        variant="success"
        style={{ fontSize: 15, width: "30%", margin: "7px" }}
        className="mx-5"
        onClick={withdrawHandler}
      >
        <strong className="mx-1">Withdraw Contract Balance: </strong>
        {ethers.formatUnits(contractBalance, "ether")} ETH
      </Button>
    </div>
  );
};

export default Withdraw;
