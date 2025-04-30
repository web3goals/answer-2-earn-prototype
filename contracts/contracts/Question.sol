// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {LSP8Mintable} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/presets/LSP8Mintable.sol";
import {_LSP8_TOKENID_FORMAT_NUMBER} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {_LSP4_TOKEN_TYPE_COLLECTION, _LSP4_METADATA_KEY} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";

contract Question is LSP8Mintable {
    struct Reward {
        uint256 value;
        bool sent;
    }

    event QuestionAsked(
        address indexed asker,
        address indexed answerer,
        bytes32 indexed tokenId,
        uint256 value,
        bytes metadataValue
    );

    event QuestionAnswered(
        address indexed answerer,
        bytes32 indexed tokenId,
        bytes metadataValue
    );

    mapping(bytes32 tokenId => Reward) public rewards;

    constructor(
        string memory nftCollectionName,
        string memory nftCollectionSymbol,
        address contractOwner
    )
        LSP8Mintable(
            nftCollectionName,
            nftCollectionSymbol,
            contractOwner,
            _LSP4_TOKEN_TYPE_COLLECTION,
            _LSP8_TOKENID_FORMAT_NUMBER
        )
    {}

    function ask(address answerer, bytes memory metadataValue) public payable {
        require(msg.value > 0, "Value must be greater than 0");
        bytes32 tokenId = keccak256(
            abi.encodePacked(
                block.timestamp,
                block.prevrandao,
                msg.sender,
                answerer
            )
        );
        _mint(answerer, tokenId, true, "");
        _setDataForTokenId(tokenId, _LSP4_METADATA_KEY, metadataValue);
        rewards[tokenId] = Reward({value: msg.value, sent: false});
        emit QuestionAsked(
            msg.sender,
            answerer,
            tokenId,
            msg.value,
            metadataValue
        );
    }

    function answer(
        bytes32 tokenId,
        bytes memory metadataValue
    ) public onlyOwner {
        // Check if the token exists and the reward has not been sent
        require(tokenOwnerOf(tokenId) != address(0), "Token does not exist");
        require(!rewards[tokenId].sent, "Reward already sent");

        // Transfer the reward to the question owner
        (bool success, ) = tokenOwnerOf(tokenId).call{
            value: rewards[tokenId].value
        }("");
        require(success, "Transfer failed");

        // Update the metadata for the token
        _setDataForTokenId(tokenId, _LSP4_METADATA_KEY, metadataValue);

        // Mark the reward as sent
        rewards[tokenId].sent = true;

        emit QuestionAnswered(msg.sender, tokenId, metadataValue);
    }

    function getReward(bytes32 tokenId) public view returns (Reward memory) {
        return rewards[tokenId];
    }
}
