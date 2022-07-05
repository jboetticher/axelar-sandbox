// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

// import { IAxelarExecutable } from "https://github.com/axelarnetwork/axelar-cgp-solidity/blob/main/contracts/interfaces/IAxelarExecutable.sol";
// import { StringToAddress, AddressToString } from "./StringAddressUtils.sol";
// import { IERC20 } from "https://github.com/axelarnetwork/axelar-cgp-solidity/blob/main/contracts/interfaces/IERC20.sol";
// import { IAxelarGateway } from "https://github.com/axelarnetwork/axelar-cgp-solidity/blob/main/contracts/interfaces/IAxelarGateway.sol";
// import { IAxelarGasReceiver } from "./IAxelarGasReceiver.sol";

import "./axelar/IAxelarGateway.sol";
import "./axelar/IAxelarGasReceiver.sol";
import "./axelar/IAxelarExecutable.sol";
import "./axelar/StringAddressUtils.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Packages and sends a string from one chain to another.
contract SimpleGeneralMessage is IAxelarExecutable {
    using AddressToString for address;
    using StringToAddress for string;

    error AlreadyInitialized();

    IAxelarGasReceiver gasReceiver;

    string public lastMessage; // The last message we received

    constructor(address gateway_, address gasReceiver_)
        IAxelarExecutable(address(0))
    {
        if (
            address(gateway) != address(0) || address(gasReceiver) != address(0)
        ) revert AlreadyInitialized();
        gasReceiver = IAxelarGasReceiver(gasReceiver_);
        gateway = IAxelarGateway(gateway_);
    }

    // Locks and sends a token.
    // REMEMBER TO SEND VALUE AS GAS PAYMENT
    function sendMessage(
        string memory message,
        string memory destinationAddress,
        string memory destinationChain
    ) external payable {
        // Create the payload.
        bytes memory payload = abi.encode(message);

        // Pay for gas. We could also send the contract call here but then the sourceAddress will be that of the gas receiver which is a problem later.
        // You will need to call the SDK to find out how much gas you need

        gasReceiver.payNativeGasForContractCall{value: msg.value}(
            address(this),
            destinationChain,
            destinationAddress,
            payload,
            msg.sender
        );

        // Call remote contract.
        gateway.callContract(destinationChain, destinationAddress, payload);
    }

    // This is automatically executed by Axelar Microservices since gas was payed for.
    function _execute(
        string memory, /*sourceChain*/
        string memory sourceAddress,
        bytes calldata payload
    ) internal override {
        require(sourceAddress.toAddress() == address(this), "NOT_A_LINKER");

        //Decode the payload.
        lastMessage = abi.decode(payload, (string));
    }
}

// Moonbase Alpha
// 0x64d19F9B92879626B035dd59961b58D236946103
// Gateway:         0x5769D84DD62a6fD969856c75c7D321b84d455929
// GasReceiver:     0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6

// Ropsten
// 0xB5F906476d7eCA41Fd00593A20D838611285B0B2
// Gateway:         0xBC6fcce7c5487d43830a219CA6E7B83238B41e71
// GasReceiver:     0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6

// Polygon Mumbai
// 0xFF0FAF2C30bcbAa9757ea19C74196C4D8F70a5fb
// Gateway:         0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B
// GasReceiver:     0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6

// Avalanche Fuji
// 0xFF0FAF2C30bcbAa9757ea19C74196C4D8F70a5fb
// Gateway:         0xC249632c2D40b9001FE907806902f63038B737Ab
// GasReceiver:     0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6

// Fantom Testnet
// 0xFF0FAF2C30bcbAa9757ea19C74196C4D8F70a5fb
// Gateway:         0x97837985Ec0494E7b9C71f5D3f9250188477ae14
// GasReceiver:     0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6