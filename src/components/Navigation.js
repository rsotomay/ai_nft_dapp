import Navbar from "react-bootstrap/Navbar";
import { ethers } from "ethers";
import Button from "react-bootstrap/Button";

import logo from "../lion_logo.png";

const Navigation = ({ account, setAccount }) => {
  const connectHandler = async () => {
    // Fetch accounts
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = ethers.getAddress(accounts[0]);
    setAccount(account);
  };

  return (
    <Navbar className="my-3">
      <img
        alt="logo"
        src={logo}
        width="140"
        height="140"
        className="d-inline-block align-top mx-5"
      />
      <Navbar.Brand
        style={{ color: "silver", fontSize: 50, fontStyle: "italic" }}
        href="#"
      >
        AI NFT DAPP
      </Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        {account ? (
          <Navbar.Text
            className="d-inline-block align-top mx-5"
            style={{ color: "black", fontSize: 25 }}
          >
            {account.slice(0, 5) + "..." + account.slice(38, 42)}
          </Navbar.Text>
        ) : (
          <Button
            variant="dark"
            style={{ fontSize: 20, width: "20%", margin: "3px" }}
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
