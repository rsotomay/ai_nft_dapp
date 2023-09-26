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
  const URL2 = "ipfs.io2";

  beforeEach(async () => {
    // Setup accounts
    [deployer, minter] = await ethers.getSigners();

    // Deploy NFT contract
    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy(NAME, SYMBOL, COST);

    // Mint
    let transaction;
    transaction = await nft.connect(minter).mint(URL, { value: COST });
    await transaction.wait();

    transaction = await nft.connect(minter).mint(URL2, { value: COST });
    await transaction.wait();
  });

  describe("Deployment", () => {
    it("Returns owner", async () => {
      expect(await nft.owner()).to.equal(deployer.address);
    });

    it("Returns cost", async () => {
      expect(await nft.cost()).to.equal(COST);
    });
  });

  describe("Minting", () => {
    it("Returns owner address", async () => {
      expect(await nft.ownerOf("1")).to.equal(minter.address);
    });

    it("Returns total of NFTs the minter owns", async () => {
      expect(await nft.balanceOf(minter.address)).to.equal("2");
    });

    it("Returns URI", async () => {
      expect(await nft.tokenURI("1")).to.equal(URL);
    });

    it("Updates total supply", async () => {
      expect(await nft.totalSupply()).to.equal("2");
    });
  });

  describe("Returns Wallet of Owner", () => {
    let minterNFTs;

    it("returns tokens URIs of owner", async () => {
      minterNFTs = await nft.walletOfOwner(minter.address);
      expect(minterNFTs.length).to.equal(2);
    });

    it("checks the order of the owner wallet token list is correct", async () => {
      expect(minterNFTs[0]).to.equal(URL);
      expect(minterNFTs[1]).to.equal(URL2);
    });

    it("return an empty list for a user with no NFTs", async () => {
      const noNFTs = await nft.walletOfOwner(deployer.address);
      expect(noNFTs.length).to.equal(0);
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
      expect(
        await ethers.provider.getBalance(deployer.address)
      ).to.be.greaterThan(balanceBefore);
    });

    it("Updates the contract balance", async () => {
      expect(await ethers.provider.getBalance(nft.getAddress())).to.equal(0);
    });
  });
});
