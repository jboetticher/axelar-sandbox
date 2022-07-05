const hre = require("hardhat");

// PARAMETERS HERE (TODO: convert to task)
const ORIGIN_NETWORK = 'ropsten';
const DESTINATION_NETWORK = 'moonbase';
const DESTINATION_ADDRESS = '0x0394c0EdFcCA370B20622721985B577850B0eb75';
const ORIGIN_TOKEN = '0xc778417E063141139Fce010982780140Aa0cD5Ab';
const TOKEN_SYMBOL = 'WETH';
const AMOUNT = '100000000000000000';      // 0.1 WETH

async function main() {
  await hre.run('compile');

  // Gets the gateway address
  let gatewayAddress = ((network) => {
    switch(network) {
      case 'ropsten': return '0xBC6fcce7c5487d43830a219CA6E7B83238B41e71';
      case 'moonbase': return '0x5769D84DD62a6fD969856c75c7D321b84d455929';
      default: return '';
    }
  })(ORIGIN_NETWORK);

  // We find the Axelar gateway contract & the origin token
  const gateway = await hre.ethers.getContractAt(
    "IAxelarGateway",
    gatewayAddress
  );
  const token = await hre.ethers.getContractAt(
    "IERC20",
    ORIGIN_TOKEN
  );
  console.log('Initialized token and gateway objects.');
  console.log('Approving token for gateway address...');

  // Approve the gateway to use the token
  await token.approve(gatewayAddress, AMOUNT);
  console.log('Approval finished.');
  console.log('Sending token through gateway...');

  // Use gateway to send tokens
  const result = await gateway.sendToken(
    DESTINATION_NETWORK, // destination chain name
    DESTINATION_ADDRESS, // some destination wallet address (should be your own)
    TOKEN_SYMBOL, // asset symbol
    AMOUNT // amount (in atomic units)
  );
  

  console.log('Token send through gateway finished.');
  console.log(result);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
