import Navbar from "react-bootstrap/Navbar";
import { ethers } from "ethers";
import Button from "react-bootstrap/Button";

import logo from "../lion_logo.png";

const Navigation = ({
  account,
  setAccount,
  nft,
  balance,
  setBalance,
  setListOfNFTs,
}) => {
  const connectHandler = async () => {
    // Fetch accounts
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.getAddress(accounts[0]);
    setAccount(account);

    //Fetch Balance
    setBalance(await nft.balanceOf(account));

    //Fetch wallet of owner from contract
    if (account) {
      const getWallet = await nft.walletOfOwner(account);
      setListOfNFTs(getWallet);
    }
  };

  return (
    <Navbar expand="sm">
      <img
        alt="logo"
        src={logo}
        width="100"
        height="100"
        className="d-inline-block align-top mx-5"
      />
      <Navbar.Brand
        style={{ color: "silver", fontSize: 30, fontStyle: "italic" }}
        href="#"
      >
        DecentralArt-AI
      </Navbar.Brand>
      <Navbar.Collapse className="d-flex justify-content-end">
        {account ? (
          <Navbar.Text
            className="d-inline-block align-top mx-5"
            style={{ color: "silver", fontSize: 20 }}
          >
            {account.slice(0, 5) + "..." + account.slice(38, 42)}
            <p className="my-1">
              <strong className="mx-1">You Own:</strong>
              {balance.toString()} NFTs
            </p>
          </Navbar.Text>
        ) : (
          <Button
            variant="secondary"
            style={{ fontSize: 20, width: "30%", margin: "3px" }}
            className="d-inline-block align-top mx-5"
            onClick={connectHandler}
          >
            Connect Your Wallet
          </Button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
