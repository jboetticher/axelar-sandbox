const { AxelarGMPRecoveryAPI, Environment } = require("@axelar-network/axelarjs-sdk");
import yargs from 'yargs';

/*

Uses the AxelarGMPRecoveryAPI module to get information about a pending transaction.
The transaction hash is the same hash as what was generated on the source chain.

Example:
0x66299719a6c6253d3b996ed82bd285919708ac3d1253a686c1c4fc5bcf7f3e47

*/

const args = yargs.options({
    hash: { type: 'string', demandOption: true, alias: 'h' }
  }).argv;

const sdk = new AxelarGMPRecoveryAPI({
    environment: Environment.TESTNET,
});

async function main(txHash) {
    const txStatus = await sdk.queryTransactionStatus(txHash);
    console.log(txStatus);
}

main(args.hash);
