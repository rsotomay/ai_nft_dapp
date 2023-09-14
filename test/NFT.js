const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

describe("NFT", () => {
  let deployer, minter;
  let nft;

  const NAME = "AI NFT DAPP";
  const SYMBOL = "ANFTD";
  const COST = tokens(1); // 1 ETH
  const URL = "ipfs.io";

  beforeEach(async () => {
    // Setup accounts
    [deployer, minter] = await ethers.getSigners();

    // Deploy NFT contract
    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy(NAME, SYMBOL, COST);

    // Mint
    const transaction = await nft.connect(minter).mint(URL, { value: COST });
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("Returns owner", async () => {
      const result = await nft.owner();
      expect(result).to.equal(deployer.address);
    });

    it("Returns cost", async () => {
      const result = await nft.cost();
      expect(result).to.equal(COST);
    });
  });

  describe("Minting", () => {
    it("Returns owner", async () => {
      const result = await nft.ownerOf("1");
      expect(result).to.equal(minter.address);
    });

    it("Returns URI", async () => {
      const result = await nft.tokenURI("1");
      expect(result).to.equal(URL);
    });

    it("Updates total supply", async () => {
      const result = await nft.totalSupply();
      expect(result).to.equal("1");
    });
  });

  describe("Withdrawing", () => {
    let balanceBefore;

    beforeEach(async () => {
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      const transaction = await nft.connect(deployer).withdraw();
      await transaction.wait();
    });

    it("Updates the owner balance", async () => {
      const result = await ethers.provider.getBalance(deployer.address);
      expect(result).to.be.greaterThan(balanceBefore);
    });

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(nft.getAddress());
      expect(result).to.equal(0);
    });
  });
});
