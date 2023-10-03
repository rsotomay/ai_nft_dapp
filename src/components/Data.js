import { ethers } from "ethers";

const Data = ({ cost, totalSupply }) => {
  return (
    <div>
      <p className="text-end mx-5" style={{ color: "silver" }}>
        <strong className="mx-1">Cost to Mint:</strong>
        {ethers.formatUnits(cost, "ether")} ETH
      </p>
      <p className="text-end mx-5" style={{ color: "silver" }}>
        <strong className="mx-1">Total Minted:</strong>
        {totalSupply.toString()} NFTs
      </p>
      <p
        className="text-center mx-5"
        style={{ fontSize: 20, color: "silver", padding: "2rem" }}
      >
        DecentralArt-AI invites you to create your next digital masterpieces
        with the help of AI. Simply provide a prompt, and our cutting-edge AI
        algorithms will spring into action, crafting stunning and unique
        artworks tailored to your vision. Whether you seek abstract beauty,
        vibrant landscapes, or futuristic designs, DecentralArt-AI transforms
        your ideas into captivating visual wonders.
      </p>
    </div>
  );
};

export default Data;
