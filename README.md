# DecentralArt-AI

DecentralArt-AI is a decentralized application that allows users to generate unique images using AI by providing a name and a prompt description. Users can mint these generated images as NFTs on the Ethereum blockchain. Additionally, DecentralArt-AI allows users to upload their existing images and mint them as NFTs, providing a seamless and creative experience for digital artists.

## Features

- AI Image Generation: Users can create unique images by providing a name and a prompt description. These descriptions are processed by AI models to generate one-of-a-kind digital artwork.

- NFT Minting: Users can mint the generated images as non-fungible tokens (NFTs) on the Ethereum blockchain, allowing for ownership and transfer of these digital artworks.

- Image Upload: Users can also upload their existing images and mint them as NFTs.

## Technology Stack & Tools

DecentralArt-AI leverages a variety of technologies to achieve its functionality:

- Solidity: The smart contracts responsible for handling NFT minting and ownership are written in Solidity, a language for Ethereum smart contracts.

- JavaScript: JavaScript is used for various components of the DApp, including testing, front-end interactions and connecting with the Ethereum blockchain.

- [Hardhat](https://hardhat.org/): Hardhat is used for testing and deploying smart contracts to the Ethereum network.

- [Ethers.js](https://docs.ethers.io/v5/): Ethers.js is used for interacting with Ethereum smart contracts and the blockchain.

- [React.js](https://reactjs.org/): The front-end of the DApp is built using React.js, providing a user-friendly interface for users to interact with.

- [NFT.Storage](https://nft.storage/): NFT.Storage is used for making the connection with IPFS and for securely storing the image files associated with minted NFTs.

- [Hugging Face](https://huggingface.co/): Hugging Face's AI models are used for image generation based on user-provided prompts.

- [Node.js](https://nodejs.org/en/): Node.js is used for the initial setup of the project and managing dependencies.

## Getting Started

To set up DecentralArt-AI locally, follow these steps:

- Install Node.js

Open terminal and enter the following commands:

### Clone or download the repository to your local machine:

`$ git clone https://github.com/rsotomay/ai_nft_dapp.git`

### Navigate to the project directory:

`$ cd ai_nft_dapp`

### Install the project dependencies using Node.js:

`$ npm install`

### Run tests using Hardhat:

`$ npx hardhat test`

### Create an .env file in your project to securely store API keys

To connect with the Hugging Face model and generate images with AI, you need to obtain a read access token. Go to [Hugging Face](https://huggingface.co/), create an account, go to profile settings, access tokens, click new token. Create the value below and paste your access token inside:

- **REACT_APP_HUGGING_FACE_API_KEY="Paste your access token here"**

To connect with NFT.Storage and upload the image to IPFS and store the NFTs go to [NFT.Storage](https://nft.storage/), create an account and generate an API key. Create the value below and paste your API key inside:

- **REACT_APP_NFT_STORAGE_API_KEY=" Your API key goes here"**

### Start a Hardhat node for local development:

Open a separate terminal window and run:

`$ npx hardhat node`

### Deploy the smart contract to your local Hardhat node:

`$npx hardhat run scripts/deploy.js --network localhost`

### Run the front-end application:

Open a separate terminal window and run:

`$ npm run start`

Happy minting and creating with DecentralArt-AI! 🎨🚀
