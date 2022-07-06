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
 
   // The last message we received from Axelar
   IAxelarGasReceiver gasReceiver;
 
   // The last message we received from Axelar
   string public lastMessage;
 
   constructor(address gateway_, address gasReceiver_)
       IAxelarExecutable(address(0))
   {
       gasReceiver = IAxelarGasReceiver(gasReceiver_);
 
       // We are explicitly setting the gateway for demonstration purposes
       // You could also place gateway_ into the IAxelarExecutable constructor
       gateway = IAxelarGateway(gateway_);
   }
 
   // Locks and sends a token
   // REMEMBER TO SEND VALUE AS GAS PAYMENT
   function sendMessage(
       string memory message,
       string memory destinationAddress,
       string memory destinationChain
   ) external payable {
       // Create the payload.
       bytes memory payload = abi.encode(message);
 
       // Pay for gas
       // You will need to use the SDK to find out how much gas you need
       gasReceiver.payNativeGasForContractCall{value: msg.value}(
           address(this),
           destinationChain,
           destinationAddress,
           payload,
           msg.sender
       );
 
       // Call remote contract
       gateway.callContract(destinationChain, destinationAddress, payload);
   }
 
   // This is automatically executed by Axelar Relay Services if gas was paid for
   function _execute(
       string memory, /*sourceChain*/
       string memory, /*sourceAddress*/
       bytes calldata payload
   ) internal override {
       //Decode the payload.
       lastMessage = abi.decode(payload, (string));
   }
}


// Moonbase Alpha
// 0x4d7A40C0F7950Ea270DA795B4e68a36a0d9FE8ad
// Gateway:         0x5769D84DD62a6fD969856c75c7D321b84d455929
// GasReceiver:     0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6

// Ropsten
// 0xb96f012b2879117F9D4a2393Bd630202D6D4ba38
// Gateway:         0xBC6fcce7c5487d43830a219CA6E7B83238B41e71
// GasReceiver:     0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6

// Polygon Mumbai
// 0x06071356e3A09EA6365f63744aC5a4e0B2EE1f68
// Gateway:         0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B
// GasReceiver:     0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6

// Avalanche Fuji
// 0x06071356e3A09EA6365f63744aC5a4e0B2EE1f68
// Gateway:         0xC249632c2D40b9001FE907806902f63038B737Ab
// GasReceiver:     0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6

// Fantom Testnet
// 0x06071356e3A09EA6365f63744aC5a4e0B2EE1f68
// Gateway:         0x97837985Ec0494E7b9C71f5D3f9250188477ae14
// GasReceiver:     0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6