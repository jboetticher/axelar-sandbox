// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IAxelarExecutable} from "https://github.com/axelarnetwork/axelar-cgp-solidity/blob/main/contracts/interfaces/IAxelarExecutable.sol";
import {StringToAddress, AddressToString} from "./StringAddressUtils.sol";
import {IAxelarGateway} from "https://github.com/axelarnetwork/axelar-cgp-solidity/blob/main/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasReceiver} from "./IAxelarGasReceiver.sol";

// UNTESTED

// Allows users to mint an NFT, but only cross chain.
contract CrossChainNFT is ERC721, IAxelarExecutable {
    constructor(address _gateway, IAxelarGasReceiver _gasReceiver)
        ERC721("Cross Chain NFT", "XCNFT")
        IAxelarExecutable(_gateway)
    {
        gasReceiver = _gasReceiver;
    }

    uint256 currentNFTID;
    IAxelarGasReceiver gasReceiver;

    function _executeWithToken(
        string memory sourceChain,
        string memory sourceAddress,
        bytes calldata payload,
        string memory tokenSymbol,
        uint256 amount
    ) internal override {
        require(
            keccak256(abi.encodePacked(tokenSymbol)) == keccak256("DEV"),
            "Only USDC is accepted"
        );
        require(amount > 0.1 ether, "Not enough to mint!");

        address user = abi.decode(payload, (address));

        _mint(user, currentNFTID);
        currentNFTID++;
    }

    // REMEMBER TO SEND VALUE AS GAS PAYMENT
    function sendMessage(
        string memory message,
        string memory destinationAddress,
        string memory destinationChain
    ) external payable {
        //Create the payload.
        bytes memory payload = abi.encode(msg.sender);

        //Pay for gas. We could also send the contract call here but then the sourceAddress will be that of the gas receiver which is a problem later.
        //You will need to call the SDK to find out how much gas you need

        gasReceiver.payNativeGasForContractCall{value: msg.value}(
            address(this),
            destinationChain,
            destinationAddress,
            payload,
            msg.sender
        );

        //Call remote contract.
        gateway.callContractWithToken(
            destinationChain,
            destinationAddress,
            payload,
            "USDC",
            100000
        );
    }
}
