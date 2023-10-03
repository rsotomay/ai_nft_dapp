import { ethers } from "ethers";
import Button from "react-bootstrap/Button";

const Withdraw = ({ nft, provider, account, owner, contractBalance }) => {
  const withdrawHandler = async (e) => {
    e.preventDefault();
    if (account !== owner) {
      window.alert("You are not the owner");
    }

    if (contractBalance <= 0) {
      window.alert("There are not enough funds");
      window.location.reload();
    }
    const signer = await provider.getSigner();
    const transaction = await nft.connect(signer).withdraw();
    await transaction.wait();
    window.location.reload();
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
