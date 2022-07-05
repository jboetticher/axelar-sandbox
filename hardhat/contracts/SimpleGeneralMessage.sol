// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import { IAxelarExecutable } from "https://github.com/axelarnetwork/axelar-cgp-solidity/blob/main/contracts/interfaces/IAxelarExecutable.sol";
import { StringToAddress, AddressToString } from "./StringAddressUtils.sol";
import { IERC20 } from "https://github.com/axelarnetwork/axelar-cgp-solidity/blob/main/contracts/interfaces/IERC20.sol";
import { IAxelarGateway } from "https://github.com/axelarnetwork/axelar-cgp-solidity/blob/main/contracts/interfaces/IAxelarGateway.sol";
import { IAxelarGasReceiver } from "./IAxelarGasReceiver.sol";

// Moonbase Alpha
// 0x559CDC37E1ABA65DFc208106A507f5eD7FCCe703
// Gateway:         0x5769D84DD62a6fD969856c75c7D321b84d455929
// GasReceiver:     0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6

// Ropsten
// Gateway:         0xBC6fcce7c5487d43830a219CA6E7B83238B41e71
// GasReceiver:     0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6

// Packages and sends a string from one chain to another.
contract SimpleGeneralMessage is IAxelarExecutable {
    using AddressToString for address;
    using StringToAddress for string;

    error AlreadyInitialized();

    string private chainName;   //To check if we are the source chain.
    IAxelarGasReceiver gasReceiver;

    string public lastMessage; // The last message we received

    constructor(string memory chainName_, address gateway_, address gasReceiver_) IAxelarExecutable(address(0)) {
        if(address(gateway) != address(0) || address(gasReceiver) != address(0)) revert AlreadyInitialized();
        gasReceiver = IAxelarGasReceiver(gasReceiver_);
        gateway = IAxelarGateway(gateway_);
        chainName = chainName_;
    }

    //Locks and sends a token.
    // REMEMBER TO SEND VALUE AS GAS PAYMENT
    function sendMessage(
        string memory message,
        string memory destinationAddress,
        string memory destinationChain
    ) external payable {
        //Create the payload.
        bytes memory payload = abi.encode(message);

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
        gateway.callContract(
            destinationChain, 
            destinationAddress, 
            payload
        );
    }

    //This is automatically executed by Axelar Microservices since gas was payed for.
    function _execute(string memory /*sourceChain*/, string memory sourceAddress, bytes calldata payload) internal override {
        require(sourceAddress.toAddress() == address(this), "NOT_A_LINKER");

        //Decode the payload.
        lastMessage = abi.decode(payload, (string));
    }
}