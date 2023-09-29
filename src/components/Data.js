import { ethers } from "ethers";

const Data = ({ cost, totalSupply }) => {
  return (
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
        vibrant landscapes, or futuristic designs, DecentralArt-AI transforms
        your ideas into captivating visual wonders.
      </p>
    </div>
  );
};

export default Data;
