// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./axelar/IAxelarGateway.sol";
import "./axelar/IAxelarGasService.sol";
import "./axelar/IAxelarExecutable.sol";
import "./axelar/StringAddressUtils.sol";

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
// import { IAxelarExecutable } from "https://github.com/axelarnetwork/axelar-cgp-solidity/blob/main/contracts/interfaces/IAxelarExecutable.sol";
// import { StringToAddress, AddressToString } from "./StringAddressUtils.sol";
// import { IAxelarGateway } from "https://github.com/axelarnetwork/axelar-cgp-solidity/blob/main/contracts/interfaces/IAxelarGateway.sol";
// import { IAxelarGasService } from "https://github.com/axelarnetwork/axelar-cgp-solidity/blob/main/contracts/interfaces/IAxelarGasService.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";

// Allows users to mint an NFT, but only cross chain.
contract CrossChainNFT is ERC721, IAxelarExecutable {
    constructor(
        address _gateway,
        IAxelarGasService _gasService,
        IERC20 _wDev
    ) ERC721("Cross Chain NFT", "XCNFT") IAxelarExecutable(_gateway) {
        gasService = _gasService;
        wDev = _wDev;
    }

    uint256 currentNFTID;
    IAxelarGasService gasService;
    IERC20 wDev;

    // Mints the NFT for the user
    function _executeWithToken(
        string memory, /*sourceChain*/
        string memory, /*sourceAddress*/
        bytes calldata payload,
        string memory tokenSymbol,
        uint256 amount
    ) internal override {
        require(
            keccak256(abi.encodePacked(tokenSymbol)) == keccak256("WDEV"),
            "Only WDEV is accepted"
        );
        require(amount >= 0.05 ether, "Not enough to mint!");

        address user = abi.decode(payload, (address));

        _mint(user, currentNFTID);
        currentNFTID++;
    }

    function mintXCNFT(
        string memory destinationAddress,
        string memory destinationChain
    ) external payable {
        // Create the payload.
        bytes memory payload = abi.encode(msg.sender);
        
        // This contract takes the tokens from your account and then puts them into the gateway
        uint256 amount = 0.05 ether;
        wDev.transferFrom(msg.sender, address(this), amount);
        wDev.approve(address(gateway), amount);

        // Pay for gas. 
        // We could also send the contract call here but then the sourceAddress will be that of the gas receiver which is a problem later.
        gasService.payNativeGasForContractCall{value: msg.value}(
            address(this),
            destinationChain,
            destinationAddress,
            payload,
            msg.sender
        );

        // Call remote contract.
        gateway.callContractWithToken(
            destinationChain,
            destinationAddress,
            payload,
            "WDEV",
            amount
        );
    }
}
