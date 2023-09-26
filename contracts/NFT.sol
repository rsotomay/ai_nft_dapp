// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIdCounter;

    address public owner;
    uint256 public cost;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cost
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
        cost = _cost;
    }

      // Mapping from owner to list of owned token IDs
    mapping(address => string[]) private ownedTokens;

    function mint(string memory _tokenUri) public payable {
        require(msg.value >= cost);

        tokenIdCounter.increment();

        uint256 newItemId = tokenIdCounter.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenUri);
        // Add the new token to the owner's list of owned tokens
        ownedTokens[msg.sender].push(_tokenUri);
    }

    //Returns all NFTs owned by an owner by token Ids
        function walletOfOwner(address _owner) public view returns(string[] memory) {
            return ownedTokens[_owner];
        }

    function totalSupply() public view returns (uint256) {
        return tokenIdCounter.current();
    }

    function withdraw() public {
        require(msg.sender == owner);
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
