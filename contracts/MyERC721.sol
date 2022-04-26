// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyERC721 is ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Token", "TKN") {}

    function mint(string memory _tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(_msgSender(), newItemId);
        _setTokenURI(newItemId, _tokenURI);

        return newItemId;
    }

    function mintMultiNFT(string[] memory _tokenURIs) public {
        _tokenIds.increment();
        uint256 startTokenId = _tokenIds.current();
        uint256 quantity = _tokenURIs.length;

        _mintMulti(_msgSender(), startTokenId, quantity);
        _setMultiTokenURI(startTokenId, _tokenURIs);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 quantity
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, quantity);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function tokensOfOwner(address owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 tokenId;
        uint256[] memory listToken = new uint256[](balanceOf(owner));
        for (uint256 index = 0; index < listToken.length; index++) {
            tokenId = tokenOfOwnerByIndex(owner, index);
            listToken[index] = tokenId;
        }
        return listToken;
    }

    function allTokens() public view returns (uint256[] memory) {
        uint256 tokenId;
        uint256[] memory listToken = new uint256[](totalSupply());
        for (uint256 index = 0; index < listToken.length; index++) {
            tokenId = tokenByIndex(index);
            listToken[index] = tokenId;
        }
        return listToken;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
