import { AxelarAssetTransfer, Environment } from "@axelar-network/axelarjs-sdk";
import yargs from 'yargs';

const args = yargs.options({
  source: { type: 'string', demandOption: true, alias: 's' },
  destination: { type: 'string', demandOption: true, alias: 'd' },
  address: { type: 'string', demandOption: true, alias: 'a' },
  token: { type: 'string', demandOption: true, alias: 't' },
  environment: { type: 'boolean', demandOption: false, alias: 'e', default: true }
}).argv;

const sdk = new AxelarAssetTransfer({
  environment: args.environment ? Environment.TESTNET : Environment.MAINNET,
  auth: "local",
});
sdk.getDepositAddress(
  args.source, // source chain
  args.destination, // destination chain
  args.address, // destination address
  args.token // asset to transfer
).then(depositAddress => {
  console.log(`${args.source} -> ${args.destination} (${args.token}) One-Time Address:`);
  console.log(depositAddress);
  return;
})
.catch(err => {
  console.log('ERROR:');
  console.log(err);
})